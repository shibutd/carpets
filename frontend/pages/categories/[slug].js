import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'

import Layout from '../../components/Layout'
import VerticalProductCard from '../../components/VerticalProductCard'
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
  const [filterConditions, setFilterConditions] = useState([])

  const [page, setPage] = useState(1)
  const {
    isLoading,
    isError,
    data,
    // isFetching,
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

  const handleChangeFilterConditions = useCallback(
    (checkboxes, ranges) => {
      let conditions = checkboxes.filter(item => item.value)
      setFilterConditions([ ...conditions, ...ranges])
    }, [])

  const handlePrevPage = useCallback(() => {
    setPage(old => Math.max(old - 1, 0))
  }, [])

  const handleNextPage = useCallback(() => {
    if (!isPreviousData && data.next) {
      setPage(old => old + 1)
    }
  }, [])

  return (
    <Layout
      title={`${name} | Алладин96.ру`}
    >
      <section className="category-main">
        <h1>{name}</h1>
        <div className="category-wrapper">
          <div className="category-product-list">
            {isLoading ? (
              <div
                style={{ fontSize: "var(--text)", textAlign: "center" }}
              >
                Загрузка...
              </div>
            ) : isError ? (
              <div
                style={{ fontSize: "var(--text)", textAlign: "center" }}
              >
                Ошибка при получении данных
              </div>
            ) : (
              <>
                <div className="category-products-grid">
                  {(data.results.map((product) => (
                    <VerticalProductCard
                      key={product.slug}
                      title={product.name}
                      slug={product.slug}
                      price={product.minimumPrice}
                      images={product.images}
                    />)))}
                </div>
                <div className="page-section">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    &#x276E;
                  </button>
                    <div className="page-section-number">{page}</div>
                  <button
                    onClick={handleNextPage}
                   disabled={isPreviousData || !data.next}
                  >
                   &#x276F;
                  </button>
                </div>
              </>
            )}
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