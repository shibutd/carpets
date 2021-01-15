import { useState } from 'react'
import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import ProductMain from '../../components/ProductMain'
import ProductDesc from '../../components/ProductDesc'
import VerticalCards from '../../components/VerticalCards'
import VerticalCard from '../../components/VerticalCard'
import { productUrl } from '../../constants'

const similarProducts = []

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
  const { variations } = data
  const [selectedVariation, setSelectedVariation] = useState(
    variations ? variations[0] : {}
  )

  const handleOptionChange = (e) => {
    const targetValue = e.target.value

    const variation = variations.find(
      v => (v.id === targetValue)
    )

    if (variation) {
      setSelectedVariation(variation)
    }
  }

  return (
    <Layout
      title={`${data.name} | Алладин96.ру`}
    >
      <section className="product-main">
        <ProductMain
          product={data}
          variations={variations}
          option={selectedVariation}
          onOptionChange={handleOptionChange}
        />
      </section>

      <section className="product-desc">
        <ProductDesc
          product={data}
          quantities={selectedVariation.quantities}
          option={selectedVariation}
        />
      </section>

      <section className="vertical">
        <h4 className="vertical-title">Похожие товары</h4>
        <VerticalCards>
          {similarProducts.map(product => (
            <VerticalCard
              key={product.slug}
              title={product.name}
              slug={product.slug}
              price={product.minimum_price}
              imageSrc={product.images[0].image}
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