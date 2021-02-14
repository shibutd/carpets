

export default function Payment({ changeTab }) {

  const handleClick = (e) => {
    const value = e.target.value
    console.log(value)
  }

  return (
    <div className="checkout-payment">

      <div className="checkout-payment-form">

        <script src="https://js.stripe.com/v3/"></script>

        <div className="new-card-form">
          <form className="stripe-form" id="stripe-form">

            <div className="stripe-form-row" id="creditCard">
              <label htmlFor="card-element" id="stripeBtnLabel">
                Введите данные банковской карты:
              </label>
              <div
                id="card-element"
                className="StripeElement StripeElement--empty"
              >
                <div
                  className="__PrivateStripeElement"
                  style={{ margin: '0px !important', padding: '0px !important', border: 'none !important', display: 'block !important', background: 'transparent !important', position: 'relative !important', opacity: '1 !important' }}
                >
                  <iframe
                    frameBorder="0"
                    allowtransparency="true"
                    scrolling="no"
                    name="__privateStripeFrame5"
                    allowpaymentrequest="true"
                    src="https://js.stripe.com/v3/elements-inner-card-19066928f2ed1ba3ffada645e45f5b50.html#style[base][color]=%2332325d&amp;style[base][fontFamily]=%22Helvetica+Neue%22%2C+Helvetica%2C+sans-serif&amp;style[base][fontSmoothing]=antialiased&amp;style[base][fontSize]=16px&amp;style[base][::placeholder][color]=%23aab7c4&amp;style[invalid][color]=%23fa755a&amp;style[invalid][iconColor]=%23fa755a&amp;componentName=card&amp;wait=false&amp;rtl=false&amp;keyMode=test&amp;origin=https%3A%2F%2Fstripe.com&amp;referrer=https%3A%2F%2Fstripe.com%2Fdocs%2Fstripe-js&amp;controllerId=__privateStripeController1"
                    title="Secure payment input frame"
                    style={{ border: 'none !important', margin: '0px !important', padding: '0px !important', width: '1px !important', minWidth: '100% !important', overflow: 'hidden !important', display: 'block !important', height: '19.2px' }}
                  >
                  </iframe>
                </div>
              </div>
            </div>
            <div className="stripe-form-row">
              <button className="" onClick={handleClick}>
                Отправить платеж
              </button>
            </div>

            <div id="card-errors" role="alert"></div>
          </form>
        </div>

      </div>

      <div className="checkout-buttons">
        <button
          className="dark-gray-button"
          onClick={() => changeTab(-1)}
        >
          &#10094; Назад
        </button>
        <button
          style={{ opacity: 0 }}
        >
          Далее &#10095;
        </button>
      </div>

    </div>
  )
}