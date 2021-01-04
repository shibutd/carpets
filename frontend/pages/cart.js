import Link from 'next/link'

import Layout from '../components/Layout'

export default function Cart() {
  return (
    <Layout
      title={"Орормление заказа | Алладин96.ру"}
    >
      <Link href="/">
        <a>Return back</a>
      </Link>
      <h3>This is shopping-cart page</h3>
    </Layout>
  )
}