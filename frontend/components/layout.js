import React from 'react'
import PropTypes from 'prop-types'

import useAuth from '../lib/hooks/useAuth'
import useCart from '../lib/hooks/useCart'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ title, children }) {
  const authContext = useAuth()
  const { cart } = useCart()

  if (!authContext.loaded) {
    return null
  }

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...authContext,
      })
    }
    return child
  })

  return (
    <>
      <Header title={title} auth={authContext} cart={cart} />
      <main>
        {childrenWithProps}
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