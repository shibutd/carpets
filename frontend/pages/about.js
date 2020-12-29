import Link from 'next/link'

import Layout from '../components/layout'

export default function About() {
  return (
    <Layout>
      <Link href="/">
        <a>Return back</a>
      </Link>
      <h3>This is about page</h3>
    </Layout>
  )
}