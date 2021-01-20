import PropTypes from 'prop-types'

import useAuth from '../lib/hooks/useAuth'
import useCart from '../lib/hooks/useCart'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ title, children }) {
  const [user, loading] = useAuth()
  const { cart } = useCart()
  console.log(user, loading)

  if (!loading) {
    return <div></div>
  }

  return (
    <>
      <Header title={title} user={user} cart={cart} />
      <main>
        { children }
      </main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}