import PropTypes from 'prop-types'

import Layout from '../../components/Layout'
import { productUrl } from '../../constants'


export async function getServerSideProps({ query }) {
  const { slug } = query
  const res = await fetch(`${productUrl}/?category=${slug}`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }
  }
}

export default function Category({ data }) {

  return (
    <Layout
      title={"Категория | Алладин96.ру"}
    >

      <section className="category-main">
      </section>

    </Layout>
  )
}

Category.propTypes = {
  data: PropTypes.object
}