import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'

import Layout from '../../components/Layout'
import VerticalProductCard from '../../components/VerticalProductCard'
import CategorySidebar from '../../components/CategorySidebar'
import BouncerLoading from '../../components/BouncerLoading'
import { fetchProducts } from '../../lib/utils/fetchProducts'
import { nodeCategoryUrl } from '../../constants'


export async function getServerSideProps({ query }) {
  const { slug } = query
  const res = await fetch(`${nodeCategoryUrl}${slug}/`)
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

function Pagination({
  page,
  changeToPrevPage,
  changeToNextPage,
  prevPageButtonDisabled,
  nextPageButtonDisabled
}) {
  return (
    <div className="page-section">
      <button
        onClick={changeToPrevPage}
        disabled={prevPageButtonDisabled}
      >
        &#x276E;
      </button>
        <div className="page-section-number">{page}</div>
      <button
        onClick={changeToNextPage}
        disabled={nextPageButtonDisabled}
      >
       &#x276F;
      </button>
    </div>
  )
}

function ProductGrid({ products }) {
  return (
    <div className="category-products-grid">
      {(products.map((product) => (
        <VerticalProductCard
          key={product.slug}
          name={product.name}
          slug={product.slug}
          price={product.minimumPrice}
          images={product.images}
        />)))}
    </div>
  )
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

  const handleChangeFilterConditions = useCallback((checkboxes, ranges) => {
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
  }, [isPreviousData, data])

  const handleClickShowFilters = useCallback(() => {
    const categorySidebar = document.querySelector('.category-sidebar')
    const body = document.getElementsByTagName('body')[0]
    categorySidebar.classList.toggle('is-open')
    body.classList.toggle('no-scroll')
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
              <div className="bouncer-wrapper">
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
                <ProductGrid
                  products={data?.results || []}
                />
                <Pagination
                  page={page}
                  changeToPrevPage={handlePrevPage}
                  changeToNextPage={handleNextPage}
                  prevPageButtonDisabled={page === 1}
                  nextPageButtonDisabled={isPreviousData || !data.next}
                />
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

Pagination.propTypes = {
  page: PropTypes.number,
  changeToPrevPage: PropTypes.func,
  changeToNextPage: PropTypes.func,
  prevPageButtonDisabled: PropTypes.bool,
  nextPageButtonDisabled: PropTypes.bool,
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
}

Category.propTypes = {
  category: PropTypes.object,
  name: PropTypes.string,
  slug: PropTypes.string,
  properties: PropTypes.object,
}
