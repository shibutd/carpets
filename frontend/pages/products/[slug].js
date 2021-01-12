import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import ProductMain from '../../components/ProductMain'
import ProductDesc from '../../components/ProductDesc'
import VerticalCards from '../../components/VerticalCards'
import VerticalCard from '../../components/VerticalCard'
import { productUrl } from '../../constants'

export async function getServerSideProps({ query }) {
  const { slug } = query
  const res = await fetch(`${productUrl}/${slug}/`)
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

export default function Product({ data }) {
  const similarProducts = [
    { title: "Ковер Комфорт 22206-29766o", price: "2000", imageSrc: "hits-img1.jpg" },
    { title: "Ковер Комфорт 22206-29766n", price: "22000", imageSrc: "hits-img2.jpg" },
    { title: "Ковер Комфорт 22206-29766n", price: "5000", imageSrc: "hits-img3.jpg" },
    { title: "Ковер Домо 27005-29545n", price: "15000", imageSrc: "hits-img4.jpg" },
    { title: "Ковер Домо 27005-29545n", price: "1000", imageSrc: "hits-img5.jpg" },
  ]

  return (
    <Layout
      title={`${data.name} | Алладин96.ру`}
    >
      <section className="product-main">
        <ProductMain product={data} />
      </section>

      <section className="product-desc">
        <ProductDesc product={data} />
      </section>

      <section className="vertical">
        <h4 className="vertical-title">Похожие товары</h4>
        <VerticalCards>
          {similarProducts.map(product => (
            <VerticalCard
              key={product.imageSrc}
              title={product.title}
              price={product.price}
              imageSrc={product.imageSrc}
            />
          ))}
        </VerticalCards>
      </section>

    </Layout>
  )
}

Product.propTypes = {
  data: PropTypes.object
}