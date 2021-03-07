import { useState, useEffect, useRef, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import UserIcon from './UserIcon'
import ShoppingCartSolid from './icons/ShoppingCartSolid'
import HearthRegular from './icons/HearthRegular'
import Search from './Search'
import ShopAddresses from './ShopAddresses'
import Catalog from './Catalog'
import useOnClickOutSide from '../lib/hooks/useOnClickOutSide'


function Header({ title, auth, cart }) {
  const { user, logoutUser } = auth
  const [cartLength, setCartLength] = useState(0)
  const [openedAddresses, setOpenedAddresses] = useState(false)
  const [openCatalog, setOpenCatalog] = useState(false)
  const [catalogLabel, setCatalogLabel] = useState("Каталог товаров")
  const addressRef = useRef(null)
  const catalogRef = useRef(null)

  useOnClickOutSide(addressRef, () => setOpenedAddresses(false))
  useOnClickOutSide(catalogRef, () => setOpenCatalog(false))

  const handleOpenAddresses = useCallback(() => {
    setOpenedAddresses(prev => !prev)
  }, [])

  const handleOpenCatalog = useCallback(() => {
    setOpenCatalog(prev => !prev)
  }, [])

  const handleClickedBurgerMenu = () => {
    const topNavMenu = document.querySelector('.top-nav-menu')
    const burger = document.querySelector('.burger')

    topNavMenu.classList.toggle('top-nav-menu-open')
    burger.classList.toggle('burger-open')
  }

  function showSearchNav() {
    const topNav = document.querySelector('.top-nav')
    const searchNav = document.querySelector('.search-nav')

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
      setCatalogLabel("")
    } else {
      setCatalogLabel("Каталог товаров")
    }
  }

  useEffect(() => {
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
    setCartLength(length)
  }, [cart])

  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Алладин96 - магазин ковров в Екатеринбурге"/ >
        <meta name="robots" content="index,follow" />
        <style type="text/css">
          @import url('https://unpkg.com/tippy.js/dist/tippy.css');
        </style>
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
          <div className="burger" onClick={handleClickedBurgerMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <ShopAddresses
          ref={addressRef}
          opened={openedAddresses}
          handleClick={handleOpenAddresses}
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
          label={catalogLabel}
          opened={openCatalog}
          handleClick={handleOpenCatalog}
        />
        <Search />
        <ul>
          <li>
            <UserIcon user={user} onLogout={logoutUser} />
          </li>
          {user &&
            (<li>
              <Link href="/favorites">
                <a>
                  <div className="search-nav-icon">
                    <HearthRegular width={18} height={18} />
                    <p>Избранное</p>
                  </div>
                </a>
              </Link>
            </li>)}
          <li>
            <Link href="/shopping-cart">
              <a>
                <div
                  id={(cartLength > 0) ? "shopping-cart" : ""}
                  className="search-nav-icon"
                  value={(cartLength > 0) ? cartLength : ""}
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