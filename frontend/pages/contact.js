import Link from 'next/link'

import Layout from '../components/layout'

export default function Contact() {
  return (
    <Layout>
      <Link href="/">
        <a>Return back</a>
      </Link>
      <h3>This is contact page</h3>
    </Layout>
  )
}