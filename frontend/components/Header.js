import { useState, useEffect, useRef, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import UserIcon from './UserIcon'
import ShoppingCartSolid from './icons/ShoppingCartSolid'
import HearthRegular from './icons/HearthRegular'
import Search from './Search'
import ShopAddresses from './ShopAddresses'
import Catalog from './Catalog'
import useOnClickOutSide from '../lib/hooks/useOnClickOutside'
import {
  getPickupAddresses,
  selectAddress,
} from '../lib/slices/addressSlice'

function Header({ title, auth, cart }) {
  const { user, logoutUser } = auth
  const dispatch = useDispatch()
  const { pickupAddresses: addresses } = useSelector(selectAddress)
  const [state, setState] = useState({
    cartLength: 0,
    openAddressesTab: false,
    openCatalog: false,
    catalogLabel: "Каталог товаров",
    addresses: [],
    categories: []
  })
  const addressRef = useRef(null)
  const catalogRef = useRef(null)

  useOnClickOutSide(addressRef, () =>
    setStateWithValue('openAddressesTab', false)
  )
  useOnClickOutSide(catalogRef, () =>
    setStateWithValue('openCatalog', false)
  )

  const setStateWithValue = (property, value) =>
    setState(state => ({ ...state, [property]: value }))

  const setStateToggleValue = (property) =>
    setState(state => ({ ...state, [property]: !state[property] }))

  const handleOpenAddressesTab = useCallback(() =>
    setStateToggleValue('openAddressesTab')
  , [])

  const handleOpenCatalog = useCallback(() =>
    setStateToggleValue('openCatalog')
  , [])

  const handleClickBurgerMenu = () => {
    const topNavMenu = document.querySelector('.top-nav-menu')
    const burger = document.querySelector('.burger')

    topNavMenu.classList.toggle('top-nav-menu-open')
    burger.classList.toggle('burger-open')
  }

  function showSearchNav() {
    const topNav = document.querySelector('.top-nav')
    const searchNav = document.querySelector('.search-nav')

    if (!topNav || !searchNav) return

    const scrolled = document.scrollingElement.scrollTop

    if (scrolled >= topNav.clientHeight + searchNav.clientHeight) {
      topNav.style.marginBottom = `${searchNav.clientHeight}px`
      searchNav.classList.add('search-nav-fixed')
    } else {
      topNav.style.marginBottom = "0"
      searchNav.classList.remove('search-nav-fixed')
    }
  }

  function showCatalogLabel() {
    if (document.documentElement.clientWidth <= 480) {
      setStateWithValue('catalogLabel', '')
    } else {
      setStateWithValue('catalogLabel', 'Каталог товаров')
    }
  }

  useEffect(() => {
    if (addresses.length === 0) {
      dispatch(getPickupAddresses())
    }

    window.addEventListener('scroll', showSearchNav)
    window.addEventListener('resize', showCatalogLabel)

    showCatalogLabel()
    showSearchNav()

    return () => {
      window.removeEventListener('scroll', showSearchNav)
      window.removeEventListener('resize', showCatalogLabel)
    }
  }, [])

  useEffect(() => {
    let length = 0
    for (let i = 0; i < cart.length; i++) {
      length += cart[i].quantity
    }
    setStateWithValue('cartLength', length)
  }, [cart])

  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Алладин96 - магазин ковров в Екатеринбурге"/ >
        <meta name="robots" content="index,follow" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/tippy.js/dist/tippy.css"
        />
        <link rel="icon" href="/icons/favicon.svg" />
        <title>{title}</title>
      </Head>

      <nav className="top-nav">
        <div className="top-nav-logo">
          <Link href="/">
            <a>
              <Image
                src="/icons/aladdin_logo.svg"
                alt="logo"
                layout="intrinsic"
                width={260}
                height={90}
              />
            </a>
          </Link>
          <div className="burger" onClick={handleClickBurgerMenu}>
            <span />
            <span />
            <span/ >
          </div>
        </div>
        <ShopAddresses
          ref={addressRef}
          addresses={addresses}
          opened={state.openAddressesTab}
          handleClick={handleOpenAddressesTab}
        />
        <ul className="top-nav-menu">
          <li><Link href="/promotions"><a>Акции</a></Link></li>
          <li><Link href="/delivery"><a>Доставка и оплата</a></Link></li>
          <li><Link href="/shops"><a>Магазины</a></Link></li>
          <li><Link href="/contact"><a>Обратная связь</a></Link></li>
        </ul>
      </nav>

      <nav className="search-nav">
        <Catalog
          ref={catalogRef}
          label={state.catalogLabel}
          opened={state.openCatalog}
          handleClick={handleOpenCatalog}
        />
        <Search />
        <ul>
          <li>
            <UserIcon user={user} onLogout={logoutUser} />
          </li>
          {user && (
            <li>
              <Link href="/favorites">
                <a>
                  <div className="search-nav-icon">
                    <HearthRegular width={18} height={18} />
                    <p>Избранное</p>
                  </div>
                </a>
              </Link>
            </li>
          )}
          <li>
            <Link href="/shopping-cart">
              <a>
                <div
                  id={(state.cartLength > 0) ? "shopping-cart" : ""}
                  className="search-nav-icon"
                  value={(state.cartLength > 0) ? state.cartLength : ""}
                >
                  <ShoppingCartSolid width={18} height={18} />
                  <p>Корзина</p>
                </div>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  auth: PropTypes.object,
  cart: PropTypes.array,
}

export default memo(Header)