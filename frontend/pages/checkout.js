import { useState } from 'react'

import Layout from '../components/Layout'
import OrderSummary from '../components/OrderSummary'
import AddressForm from '../components/AddressForm'
import Payment from '../components/Payment'


export default function Checkout() {
  const [currentTab, setCurrentTab] = useState(1)
  let renderComponent

  const handleChangeCurrentTab = (n) => {
    const newTab = currentTab + n
    if (newTab > 0 && newTab <= 3) setCurrentTab(newTab)
  }


  if (currentTab === 1) {
    renderComponent = <OrderSummary />
  }

  if (currentTab === 2) {
    renderComponent = <AddressForm />
  }

  if (currentTab === 3) {
    renderComponent = <Payment />
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
              data-desc="Оформление"
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

          <div className="checkout-buttons">
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
          </div>

        </div>
      </section>
    </Layout>
  )
}