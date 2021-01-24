import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import UserIcon from './UserIcon'
import ShoppingCartSolid from './icons/ShoppingCartSolid'
import HearthRegular from './icons/HearthRegular'
import Search from './Search'
import ShopAddresses from './ShopAddresses'

export default function Header({ title, user, cart }) {
  const [cartLength, setCartLength] = useState(0)
  const [openedAddresses, setOpenedAddresses] = useState(false)
  // const [openCatalog, setOpenCatalog] = useState(false)

  const handleOpenAddresses = useCallback(() => {
    setOpenedAddresses(prev => !prev)
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
        <title>{title}</title>
      </Head>

      <nav className="top-nav">
        <Link href="/">
          <a>
            <Image
              src="/icons/aladdin_logo.svg"
              alt="logo"
              layout="fixed"
              width={260}
              height={90}
            />
          </a>
        </Link>
        <ShopAddresses
          opened={openedAddresses}
          handleClick={handleOpenAddresses}
        />
        <ul>
          <li><Link href="/promotions"><a>Акции</a></Link></li>
          <li><Link href="/delivery"><a>Доставка и оплата</a></Link></li>
          <li><Link href="/shops"><a>Магазины</a></Link></li>
          <li><Link href="/contact"><a>Обратная связь</a></Link></li>
        </ul>
      </nav>

      <nav className="search-nav">
        <button>Каталог товаров</button>
        <Search />
        <ul>
          <li>
            <UserIcon user={user} />
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
  user: PropTypes.string,
  cart: PropTypes.array,
}