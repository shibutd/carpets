import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'

import Layout from '../../components/Layout'
import VerticalProductCard from '../../components/VerticalProductCard'
import CategorySidebar from '../../components/CategorySidebar'
import BouncerLoading from '../../components/BouncerLoading'
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

  const handlePrevPage = () => {
    setPage(old => Math.max(old - 1, 0))
  }

  const handleNextPage = () => {
    if (!isPreviousData && data.next) {
      setPage(old => old + 1)
    }
  }

  const handleClickShowFilters = useCallback(() => {
    const categorySidebar = document.querySelector('.category-sidebar')
    categorySidebar.classList.toggle('is-open')
  }, [])

  return (
    <Layout
      title={`${name} | Алладин96.ру`}
    >
      <section className="category-main">
        <h1>{name}</h1>

        <div className="category-wrapper">
          <span
            id="filter-open"
            className="filter-toggle"
            onClick={handleClickShowFilters}
          >
            Фильтры
          </span>
          <div className="category-product-list">
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '2rem'
                }}
              >
                <BouncerLoading />
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
          <div className="category-sidebar light-gray-container">
            <CategorySidebar
              properties={properties}
              onChange={handleChangeFilterConditions}
              toggleShowFilters={handleClickShowFilters}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}

Category.propTypes = {
  category: PropTypes.object,
  name: PropTypes.string,
  slug: PropTypes.string,
  properties: PropTypes.object,
}