import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import CategoryCard from '../components/CategoryCard'
import VerticalCards from '../components/VerticalCards'
import VerticalCard from '../components/VerticalCard'
import { categoryUrl, productUrl } from '../constants'

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

  const carouselImages = [
    { id: 1, src: "carousel-img1.jpg" },
    { id: 2, src: "carousel-img2.jpg" },
    { id: 3, src: "carousel-img3.jpg" },
  ]
  // const categories = [
  //   { title: "Российские ковры", href: "#", imageSrc: "ros-kovry.jpg" },
  //   { title: "Белорусские ковры", href: "#", imageSrc: "belorys-kovry.jpg" },
  //   { title: "Турецкие ковры", href: "#", imageSrc: "tur-kovry.jpg" },
  //   { title: "Детские ковры", href: "#", imageSrc: "detskie-kovry.jpg" },
  // ]
  // const hits = [
  //   { title: "Ковер Домо 27005-29545n", price: 1000, imageSrc: "hits-img2.jpg" },
  //   { title: "Ковер Домо 27005-29545n", price: 2000, imageSrc: "hits-img3.jpg" },
  //   { title: "Ковер Домо 27005-29545n", price: 5000, imageSrc: "hits-img1.jpg" },
  //   { title: "Ковер Домо 27005-29545n", price: 9000, imageSrc: "hits-img4.jpg" },
  //   { title: "Ковер Домо 27005-29545n", price: 4000, imageSrc: "hits-img5.jpg" },
  // ]
  // const novelties = [
  //   { title: "Ковер Комфорт 22206-29766o", price: 2000, imageSrc: "hits-img1.jpg" },
  //   { title: "Ковер Комфорт 22206-29766n", price: 22000, imageSrc: "hits-img2.jpg" },
  //   { title: "Ковер Комфорт 22206-29766n", price: 5000, imageSrc: "hits-img3.jpg" },
  //   { title: "Ковер Домо 27005-29545n", price: 15000, imageSrc: "hits-img4.jpg" },
  //   { title: "Ковер Домо 27005-29545n", price: 1000, imageSrc: "hits-img5.jpg" },
  // ]

  useEffect(() => {
    async function fetchData(url) {
      const res = await fetch(url)
      let data = await res.json()

      if (!data) {
        return []
      }

      return data.results
    }

    fetchData(productUrl)
      .then(data => setHits(data))
    fetchData(productUrl)
      .then(data => setNovelties(data))

    // setHits(hits)
    // setNovelties(novelties)
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
          {hits.map((hit, i) => (
            <VerticalCard
              key={i}
              title={hit.name}
              slug={hit.slug}
              price={hit.price}
              imageSrc={hit.image}
            />
          ))}
        </VerticalCards>
      </section>

      <section className="vertical">
        <h4 className="vertical-title">Новинки</h4>
        <VerticalCards>
          {novelties.map((novelty, i) => (
            <VerticalCard
              key={i}
              title={novelty.title}
              slug={novelty.slug}
              price={novelty.price}
              imageSrc={novelty.image}
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