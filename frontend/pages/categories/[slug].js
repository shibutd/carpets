import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import VerticalCard from '../../components/VerticalCard'

import { productUrl } from '../../constants'


// export async function getServerSideProps({ query }) {
//   const { slug } = query
//   const res = await fetch(`${productUrl}/?category=${slug}`)
//   const data = await res.json()

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: { data }
//   }
// }

const category = {
  name: 'Ковры',
  slug: 'kovry',
  products: [
    { id: 1, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 2, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 3, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 4, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 5, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 6, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 7, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 8, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 9, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 10, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 11, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 12, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 13, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 14, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 15, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
    { id: 16, name: 'Ковер "Акварель"', slug: 'kover-akvarel', images: [], minimalPrice: 1000 },
  ]
}

export default function Category({ data }) {
  const { name, slug, products } = category

  return (
    <Layout
      title={"Категория | Алладин96.ру"}
    >

      <section className="category-main">
        <h1>{name}</h1>

        <div className="category-wrapper">
          {products.map((product) => (
            <VerticalCard
              key={product.id}
              title={product.name}
              slug={product.slug}
              price={product.minimalPrice}
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