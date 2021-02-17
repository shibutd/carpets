import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import OrderSummary from '../components/OrderSummary'
import AddressForm from '../components/AddressForm'
import Payment from '../components/Payment'
import useAuth from '../lib/hooks/useAuth'
import useCart from '../lib/hooks/useCart'


export default function Checkout() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState(1)
  const { user, loaded } = useAuth()
  const { cart } = useCart()
  let renderComponent

  const handleChangeCurrentTab = useCallback((n) => {
    const newTab = currentTab + n
    if (newTab > 0 && newTab <= 3) setCurrentTab(newTab)
  }, [currentTab])

  if (!loaded) {
    return <div></div>
  }

  if (loaded && !user) {
    router.push('/login?redirect=favorites')
    return <div></div>
  }

  if (cart.length === 0) {
    router.push('/')
    return <div></div>
  }

  if (currentTab === 1) {
    renderComponent =
      <OrderSummary
        cart={cart}
        changeTab={handleChangeCurrentTab}
      />
  }

  if (currentTab === 2) {
    renderComponent = <AddressForm changeTab={handleChangeCurrentTab} />
  }

  if (currentTab === 3) {
    renderComponent =
      <Payment
        cart={cart}
        changeTab={handleChangeCurrentTab}
      />
  }

  return (
    <Layout
      title={"Оформление заказа | Алладин96.ру"}
    >
      <section className="checkout">
        <h1>Оформление заказа</h1>
        <div className="checkout-wrapper">

          <div className="checkout-circles">
            <div
              className={`checkout-circle ${currentTab === 1 ? "circle-active" : ""}`}
              data-desc="Проверка"
            >
              1
            </div>
            <div
              className={`checkout-circle ${currentTab === 2 ? "circle-active" : ""}`}
              data-desc="Доставка"
            >
              2
            </div>
            <div
              className={`checkout-circle ${currentTab === 3 ? "circle-active" : ""}`}
              data-desc="Оплата"
            >
              3
            </div>
          </div>

          {renderComponent}

          {/*<div className="checkout-buttons">
            <button
              id="backwardbutton"
              onClick={() => handleChangeCurrentTab(-1)}
              style={(currentTab === 1) ? { opacity: 0 } : {}}
            >
              &#10094; Назад
            </button>
            <button
              id="forwardbutton"
              onClick={() => handleChangeCurrentTab(1)}
              style={(currentTab === 3) ? { opacity: 0 } : {}}
            >
              Далее &#10095;
            </button>
          </div>*/}

        </div>
      </section>
    </Layout>
  )
}