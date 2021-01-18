import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import VerticalCard from '../../components/VerticalCard'
import { categoryUrl, productUrl } from '../../constants'


export async function getServerSideProps({ query }) {
  const { slug } = query
  const res = await fetch(`${categoryUrl}/${slug}`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }
  }
}

export default function Category({ data }) {
  const { name, slug, properties } = data
  const { manufacturers, materials, sizes } = properties

  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchData(url) {
      const res = await fetch(url)
      let data = await res.json()

      if (!data) {
        return []
      }

      return data.results
    }

    const url = `${productUrl}?category=${slug}`
    fetchData(url).then(data => setProducts(data))
  }, [])

  return (
    <Layout
      title={`${name} | Алладин96.ру`}
    >

      <section className="category-main">
        <h1>{name}</h1>

        <div className="category-wrapper">

          {products.map((product) => (
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
      </section>

    </Layout>
  )
}

Category.propTypes = {
  data: PropTypes.object
}