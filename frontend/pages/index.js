import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import CategoryCard from '../components/CategoryCard'
import VerticalCards from '../components/VerticalCards'
import VerticalVariationCard from '../components/VerticalVariationCard'
import { nodeCategoryUrl, hitsUrl, noveltiesUrl } from '../constants'

const carouselImages = [
  { id: 1, src: "carousel-img1.jpg" },
  { id: 2, src: "carousel-img2.jpg" },
  { id: 3, src: "carousel-img3.jpg" },
]

export async function getStaticProps() {
  const res = await fetch(nodeCategoryUrl)
  let categories = await res.json()

  if (!categories) {
    categories = []
  }

  return {
    props: { categories }
  }
}

export default function Home({ categories }) {
  const [hits, setHits] = useState([])
  const [novelties, setNovelties] = useState([])

  useEffect(() => {
    async function fetchData(url) {
      const res = await fetch(url)
      let data = await res.json()

      if (!data) {
        return []
      }

      return data
    }

    fetchData(hitsUrl)
      .then(data => setHits(data))
    fetchData(noveltiesUrl)
      .then(data => setNovelties(data))
  }, [])

  return (
    <Layout
      title={"Алладин96.ру | магазин ковров"}
    >
      <section className="carousel">
        <Carousel images={carouselImages} />
      </section>

      <section className="categories">
        <h4>Популярные категории</h4>
        <div className="categories-cards">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              title={category.name}
              slug={category.slug}
              imageSrc={category.image}
            />
          ))}
        </div>
      </section>

      <VerticalCards title={"Хиты продаж"}>
        {hits.map((hit) => (
          <VerticalVariationCard
            key={hit.id}
            id={hit.id}
            name={hit.product.name}
            slug={hit.product.slug}
            size={hit.size}
            price={hit.price}
            images={hit.product.images}
          />
        ))}
      </VerticalCards>
      <VerticalCards title={"Новинки"}>
        {novelties.map((novelty) => (
          <VerticalVariationCard
            key={novelty.id}
            id={novelty.id}
            name={novelty.product.name}
            slug={novelty.product.slug}
            size={novelty.size}
            price={novelty.price}
            images={novelty.product.images}
          />
        ))}
      </VerticalCards>
    </Layout>
  )
}

Home.propTypes = {
  categories: PropTypes.array
}