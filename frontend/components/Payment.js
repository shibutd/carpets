import { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'

import BouncerLoading from './BouncerLoading'
import CheckMarkIcon from './icons/CheckMarkIcon'
import WarningIcon from './icons/WarningIcon'
import useOrders from '../lib/hooks/useOrders'
import { selectAddress, resetAddress } from '../lib/slices/addressSlice'
import { resetCart } from '../lib/slices/cartSlice'
import { convertPrice } from '../lib/utils/converters'

Modal.setAppElement('#__next')

const MyLink = forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Вернуться на главную страницу
    </a>
  )
})

const ModalContainer = ({ loading, error, handleClickReturn }) => {

  if (loading) return (
    <div className="modal-payment-message modal-payment-loading">
      <BouncerLoading />
      <span>Обработка платежа...</span>
    </div>
  )

  if (!loading) return (
    <>
      {error
        ? (
          <div className="modal-payment-message">
            <WarningIcon width={25} height={25} />
            <span>Во время обработки платежа произошла ошибка!</span>
          </div>
          ) : (
          <div className="modal-payment-message">
            <CheckMarkIcon width={25} height={25} />
            <span>Ваш заказ успешно оформлен!</span>
          </div>
        )}
      <Link href="/" passHref className="modal-payment-link">
        <MyLink onClick={handleClickReturn} />
      </Link>
    </>
  )
}

export default function Payment({ cart, changeTab }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const {
    addressType,
    addressId,
    address,
    loading,
    error,
  } = useSelector(selectAddress)
  const [showModal, setShowModal] = useState(false)
  const { createPickupOrder, createDeliveryOrder } = useOrders()

  const total = cart.reduce((sum, item) => {
    return sum + item.variation.price * item.quantity
  }, 0)

  const addressStringRepresentation = (address) => {
    const addressFileredValues = Object.entries(address)
      .filter(entry =>
        entry[1] !== null
          && !['latitude', 'longitude'].includes(entry[0])
      )

    return (
      <>
        {addressFileredValues.map((val, i) =>
          <span key={i}>{val[1]}</span>
        )}
      </>
    )
  }

  const resetAndReturnToIndexPage = async () => {
    router.push('/')
    await dispatch(resetAddress())
    await dispatch(resetCart())
  }

  const handleCloseModal = async () => {
    if (error) {
      setShowModal(false)
      return
    }
    await resetAndReturnToIndexPage()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowModal(true)

    if (addressType === 'pickup') {
      await createPickupOrder(addressId)
    } else {
      await createDeliveryOrder(addressId)
    }
  }

  return (
    <div className="checkout-payment">

      <div className="checkout-payment-order light-gray-container">
        <h5>Ваш заказ:</h5>
        <p>Сумма к оплате:<span>{` ${convertPrice(total)} ₽`}</span></p>
        <p>Тип доставки:<span>{addressType === 'pickup' ? ' Самовывоз' : ' Доставка по адресу'}</span></p>
        <p id="checkout-payment-address">
          Адрес доставки:
          {addressStringRepresentation(address)}
        </p>
      </div>

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
              <button id="payment-button" onClick={handleSubmit}>
                Отправить платеж
              </button>
            </div>

            <div id="card-errors" role="alert"></div>
          </form>
        </div>

      </div>

      <div className="checkout-buttons">
        <button
          disabled={showModal}
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

      <Modal
        className="modal modal-payment"
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        <ModalContainer
          loading={loading}
          error={error}
          handleClickReturn={resetAndReturnToIndexPage}
        />
      </Modal>
    </div>
  )
}

Payment.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.object),
  changeTab: PropTypes.func
}