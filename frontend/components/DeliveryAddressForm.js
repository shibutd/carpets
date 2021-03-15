import { memo } from 'react'
import PropTypes from 'prop-types'

function DeliveryAddressForm({
  address,
  changeAddress,
  addressCreate,
  changeAddressCreate,
  addresses,
  register,
  formErrors,
  error,
}) {
  const { deliveryId } = address

  const handleChangeSelected = (e) => {
    const value = parseInt(e.target.value)
    const deliveryAddress = addresses.filter(address => address.id === value)[0]
    changeAddress({
      deliveryId: value,
      deliveryAddress: deliveryAddress || {},
      deliveryIsValid: value !== -1
    })
  }

  return (
    <>
      <p>Введите адрес доставки:</p>

      {addresses.length > 0 && (
        <div className="checkout-addressform-choice light-gray-container">
          <form className="form form--choice">
            <label className="form-label">
              <input
                className="form-input"
                type="radio"
                value={false}
                checked={addressCreate === false}
                onChange={changeAddressCreate}
              />
              <span className="checkmark-round"></span>
              Выбрать ранее введенный адрес
            </label>

            <label className="form-label">
              <input
                className="form-input"
                type="radio"
                value={true}
                checked={addressCreate === true}
                onChange={changeAddressCreate}
              />
              <span className="checkmark-round"></span>
              Создать новый адрес
            </label>
          </form>
        </div>
      )}

      {addressCreate
        ? (
        <div className="checkout-addressform-address light-gray-container">
          <form className="form form--address fade">
            {error && <p>&#9888; {error}</p>}

            <div className="form-horizontal">
              <label className="form-label" htmlFor="city">
                Город*
              </label>
              <input
                className="form-input"
                name="city"
                id="city"
                ref={register}
              />
              {formErrors.city
                && <p className="form-error">&#9888; {formErrors.city.message}</p>}
            </div>

            <div className="form-horizontal">
              <label className="form-label" htmlFor="street">
                Улица*
              </label>
              <input
                className="form-input"
                name="street"
                id="street"
                ref={register}
              />
              {formErrors.street
                && <p className="form-error">&#9888; {formErrors.street.message}</p>}
            </div>

            <div className="form-horizontal">
              <label className="form-label" htmlFor="houseNumber">
                Дом*
              </label>
              <input
                className="form-input"
                name="houseNumber"
                id="houseNumber"
                ref={register}
              />
              {formErrors.houseNumber
                && <p className="form-error">&#9888; {formErrors.houseNumber.message}</p>}
            </div>

            <div className="form-horizontal">
              <label className="form-label" htmlFor="appartmentNumber">
                Квартира
              </label>
              <input
                className="form-input"
                name="appartmentNumber"
                id="appartmentNumber"
                ref={register}
              />
              {formErrors.appartmentNumber
                && <p className="form-error">&#9888; {formErrors.appartmentNumber.message}</p>}
            </div>

          </form>

        </div>
        ) : (
        <div className="checkout-addressform-choice light-gray-container">
          <form className="form form--choice">
            {addresses.map(address => (
              <label key={address.id} className="form-label">
                <input
                  className="form-input"
                  type="radio"
                  value={address.id}
                  checked={deliveryId === address.id}
                  onChange={handleChangeSelected}
                />
                <span className="checkmark-round"></span>
                <span>{`${address.city}`}</span>
                <span>{`, ${address.street}`}</span>
                <span>{`, ${address.houseNumber}`}</span>
                <span>{address.appartmentNumber && `, ${address.appartmentNumber}`} </span>
              </label>
            ))}
          </form>
        </div>
      )}
    </>
  )
}

DeliveryAddressForm.propTypes = {
  address: PropTypes.object,
  changeAddress: PropTypes.func,
  addressCreate: PropTypes.bool,
  changeAddressCreate: PropTypes.func,
  addresses: PropTypes.arrayOf(PropTypes.object),
  register: PropTypes.func,
  formErrors: PropTypes.object,
  error: PropTypes.string,
}

export default memo(DeliveryAddressForm)