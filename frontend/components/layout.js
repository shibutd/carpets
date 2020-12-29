import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Header from './header'
import { selectUser } from '../lib/slices/authSlice'
import useMounted from '../lib/hooks/useMounted'

export default function Layout({children}) {
  const { user } = useSelector(selectUser)
  const mounted = useMounted()

  if (!mounted) {
    return <div></div>
  }

  return (
    <>
      <Header user={user} />
      { children }
    </>
  )
}