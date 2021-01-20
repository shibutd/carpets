import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'

import Layout from '../../components/Layout'
import VerticalCard from '../../components/VerticalCard'
import CategorySidebar from '../../components/CategorySidebar'
import { fetchProducts } from '../../lib/utils/fetchProducts'
import { categoryUrl } from '../../constants'


export async function getServerSideProps({ query }) {
  const { slug } = query
  const res = await fetch(`${categoryUrl}/${slug}`)
  const category = await res.json()

  if (!category) {
    return {
      notFound: true,
    }
  }

  return {
    props: { category }
  }
}

export default function Category({ category }) {
  const { name, slug, properties } = category
  // const { manufacturers, materials, sizes } = properties
  const [filterConditions, setFilterConditions] = useState([])
  // const [filterConditions, setFilterConditions] = useState(() => {
  //   const initialConditions = properties.reduce(
  //     (properties, property) => ({ ...properties, [property]: [] })
  //   )
  //   return { ...initialConditions, from_size: '', to_size: '' }
  // })
  const [page, setPage] = useState(1)
  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery(
    ['products', slug, page, filterConditions],
    () => fetchProducts(slug, page, filterConditions),
    {
      keepPreviousData : true,
      staleTime: 6000,
      cacheTime: 60000,
      refetchOnWindowFocus: false,
    }
  )

  const handleChangeFilterConditions = (checkboxes) => {
    const conditions = checkboxes.filter((item) => item.value)
    console.log(conditions)
    setFilterConditions(conditions)
    // const newConditions = properties.map(
    //   (properties, property) => ({ ...properties, [property]: [] })
    // )
    // return { ...initialConditions, from_size: '', to_size: '' }
  }


  // const [products, setProducts] = useState([])

  // useEffect(() => {
  //   async function fetchData(url) {
  //     const res = await fetch(url)
  //     let data = await res.json()

  //     if (!data) {
  //       return []
  //     }

  //     return data.results
  //   }

  //   const url = `${productUrl}?category=${slug}`
  //   fetchData(url).then(data => setProducts(data))
  // }, [])

  if (isLoading) {
    return (<div></div>)
  }

  return (
    <Layout
      title={`${name} | Алладин96.ру`}
    >

      <section className="category-main">
        <h1>{name}</h1>

        <div className="category-wrapper">

          <div className="category-product-list">
            {data.results.map((product) => (
              <VerticalCard
                key={product.slug}
                title={product.name}
                slug={product.slug}
                price={product.minimumPrice}
                images={product.images}
                className="category-card"
              />
            ))}
          </div>

          <div className="category-sidebar">

            <CategorySidebar
              properties={properties}
              onChange={handleChangeFilterConditions}
            />

          </div>

        </div>
      </section>

    </Layout>
  )
}

Category.propTypes = {
  data: PropTypes.object
}