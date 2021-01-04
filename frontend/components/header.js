import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import Icon from './icon'

export default function Header({ title, user }) {
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
        <Image
          src="/icons/aladdin_logo.svg"
          alt="logo"
          layout="fixed"
          width={250}
          height={80}
        />
        <div className="top-nav-address">
          <button>Адреса магазинов</button>
          <a href="">+7 (343) 237 47 47</a>
        </div>
        <ul>
          <li><Link href="/promotions"><a>Акции</a></Link></li>
          <li><Link href="/delivery"><a>Доставка и оплата</a></Link></li>
          <li><Link href="/shops"><a>Магазины</a></Link></li>
          <li><Link href="/contact"><a>Обратная связь</a></Link></li>
        </ul>
      </nav>

      <nav className="search-nav">
        <button>Каталог товаров</button>
        <div className="search-nav-input">
          <input type="text" placeholder="Поиск по товарам" />
          <a href="#">
            <Icon src={"/icons/search-solid.svg"} alt={"search"} />
          </a>
        </div>
        <ul>
          <li>
            <a href="#">
              <div className="search-nav-icon">
                <Icon src={"/icons/user-regular.svg"} alt={"user"} />
                <p>Войти</p>
              </div>
            </a>
          </li>
          <li>
            <a href="#">
              <div className="search-nav-icon">
                <Icon src={"/icons/heart-regular.svg"} alt={"heart"} />
                <p>Избранное</p>
              </div>
            </a>
          </li>
          <li>
            <a href="#">
              <div className="search-nav-icon">
                <Icon src={"/icons/chart-bar-regular.svg"} alt={"chart"} />
                <p>Сравнение</p>
              </div>
            </a>
          </li>
          <li>
            <a href="cart.html">
              <div className="search-nav-icon">
                <Icon src={"/icons/shopping-cart-solid.svg"} alt={"shopping-cart"} />
                <p>Корзина</p>
              </div>
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}