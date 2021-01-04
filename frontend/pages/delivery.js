import Link from 'next/link'

import Layout from '../components/Layout'

export default function Delivery() {
  return (
    <Layout
      title="Доставка | Алладин96.ру"
    >
      <Link href="/">
        <a>Return back</a>
      </Link>
      <h3>This is contact page</h3>
    </Layout>
  )
}