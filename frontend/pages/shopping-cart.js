import Layout from '../components/Layout'
import Cart from '../components/Cart'


export default function ShoppingCart() {

  return (
    <Layout
      title={"Орормление заказа | Алладин96.ру"}
    >
      <section className="cart">
        <h1>Корзина</h1>
        <Cart />
      </section>
    </Layout>
  )
}