import Link from 'next/link'

import Layout from '../components/Layout'
import Cart from '../components/Cart'

export default function ShoppingCart() {
  const items = [
    {id: 1, title: "Ковер Комфорт 22204-29766n", quantity: 2, price: 10000, imageSrc: "hits-img2.jpg"},
    {id: 2, title: "Ковер Домо 27005-29545n", quantity: 1, price: 22000, imageSrc: "hits-img3.jpg"},
    {id: 3, title: "Ковер Домо 27005-29557n", quantity: 1, price: 5000, imageSrc: "hits-img1.jpg"},
  ]

  return (
    <Layout
      title={"Орормление заказа | Алладин96.ру"}
    >
      <section className="cart">
        <h1>Корзина</h1>
        <Cart items={items} />
      </section>
    </Layout>
  )
}