import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectUser } from '../lib/slices/authSlice'
import useAuth from '../lib/hooks/useAuth'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ title, children }) {
  const [user, loading] = useAuth()

  if (!loading) {
    return <div></div>
  }

  return (
    <>
      <Header title={title} user={user} />
      <main>
        { children }
      </main>
      <Footer />
    </>
  )
}