import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import CategoryCard from '../components/CategoryCard'
import VerticalCards from '../components/VerticalCards'
import VerticalCard from '../components/VerticalCard'
import { categoryUrl, hitsUrl, noveltiesUrl } from '../constants'

const carouselImages = [
  { id: 1, src: "carousel-img1.jpg" },
  { id: 2, src: "carousel-img2.jpg" },
  { id: 3, src: "carousel-img3.jpg" },
]

export async function getStaticProps() {
  const res = await fetch(categoryUrl)
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

      return data.results
    }

    fetchData(hitsUrl).then(data => setHits(data))
    fetchData(noveltiesUrl).then(data => setNovelties(data))
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

      <section className="vertical">
        <h4 className="vertical-title">Хиты продаж</h4>
        <VerticalCards>
          {hits.map((hit) => (
            <VerticalCard
              key={hit.slug}
              title={hit.name}
              slug={hit.slug}
              price={hit.minimum_price}
              images={hit.images}
            />
          ))}
        </VerticalCards>
      </section>

      <section className="vertical">
        <h4 className="vertical-title">Новинки</h4>
        <VerticalCards>
          {novelties.map((novelty) => (
            <VerticalCard
              key={novelty.slug}
              title={novelty.name}
              slug={novelty.slug}
              price={novelty.minimum_price}
              images={novelty.images}
            />
          ))}
        </VerticalCards>
      </section>
    </Layout>
  )
}

Home.propTypes = {
  categories: PropTypes.array
}