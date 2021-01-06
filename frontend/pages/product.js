import Link from 'next/link'
import Image from 'next/image'

import Layout from '../components/Layout'
import ProductMain from '../components/ProductMain'
import ProductDesc from '../components/ProductDesc'
import VerticalCards from '../components/VerticalCards'
import VerticalCard from '../components/VerticalCard'

export default function Product() {
  const similarProducts = [
    {title: "Ковер Комфорт 22206-29766o", price: 2000, imageSrc: "hits-img1.jpg"},
    {title: "Ковер Комфорт 22206-29766n", price: 22000, imageSrc: "hits-img2.jpg"},
    {title: "Ковер Комфорт 22206-29766n", price: 5000, imageSrc: "hits-img3.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 15000, imageSrc: "hits-img4.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 1000, imageSrc: "hits-img5.jpg"},
  ]

  return (
    <Layout
      title={"Выбор товара | Алладин96.ру"}
    >
      <section className="product-main">
        <ProductMain />
      </section>

      <section className="product-desc">
        <ProductDesc />
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