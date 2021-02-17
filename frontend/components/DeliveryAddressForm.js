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
    changeAddress({
      deliveryId: value,
      deliveryIsValid: value !== -1
    })
  }

  return (
    <>
      <p>Введите адрес доставки:</p>

      {addresses.length > 0 && (
        <form className="checkout-addressform-choice">
            <label>
              <input
                type="radio"
                value={false}
                checked={addressCreate === false}
                onChange={changeAddressCreate}
              />
              <span className="checkmark-round"></span>
              Выбрать адрес
            </label>

            <label>
              <input
                type="radio"
                value={true}
                checked={addressCreate === true}
                onChange={changeAddressCreate}
              />
              <span className="checkmark-round"></span>
              Создать новый адрес
            </label>
        </form>
      )}

      {addressCreate
        ? (
        <div className="checkout-addressform-address">
          <form className="checkout-addressform-address-form fade">
            {error && <p>&#9888; {error}</p>}

            <div className="">
              <label htmlFor="city">
                Город*
              </label>
              <input
                name="city"
                id="city"
                ref={register}
              />
              {formErrors.city && <p>&#9888; {formErrors.city.message}</p>}
            </div>

            <div className="">
              <label htmlFor="street">
                Улица*
              </label>
              <input
                name="street"
                id="street"
                ref={register}
              />
              {formErrors.street && <p>&#9888; {formErrors.street.message}</p>}
            </div>

            <div className="">
              <label htmlFor="houseNumber">
                Дом*
              </label>
              <input
                name="houseNumber"
                id="houseNumber"
                ref={register}
              />
              {formErrors.houseNumber && <p>&#9888; {formErrors.houseNumber.message}</p>}
            </div>

            <div className="">
              <label htmlFor="appartmentNumber">
                Квартира
              </label>
              <input
                name="appartmentNumber"
                id="appartmentNumber"
                ref={register}
              />
              {formErrors.appartmentNumber && <p>&#9888; {formErrors.appartmentNumber.message}</p>}
            </div>

          </form>

        </div>
      ) : (
        <form className="checkout-addressform-choice">
          {addresses.map(address => (
            <label key={address.id}>
              <input
                type="radio"
                value={address.id}
                checked={deliveryId === address.id}
                onChange={handleChangeSelected}
              />
              <span className="checkmark-round"></span>
              {`${address.city}, ${address.street}, ${address.house_number}
              ${address.appartment_number}`}
            </label>
          ))}
        </form>
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