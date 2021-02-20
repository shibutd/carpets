import { memo } from 'react'
import PropTypes from 'prop-types'

function PickupAddressForm({
  address,
  changeAddress,
  addresses,
}) {
  const { pickupId } = address

  const handleChangeSelected = (e) => {
    const value = parseInt(e.target.value)
    const pickupAddress = (addresses.filter(address => address.id === value)[0])
    changeAddress({
      pickupId: value,
      pickupAddress: pickupAddress || {},
      pickupIsValid: value !== -1
    })
  }

  return (
    <>
      <p>Выберите пункт самовывоза:</p>
      <div className="checkout-addressform-address">
        <select value={pickupId} onChange={handleChangeSelected}>
          <option value={-1}>{"..."}</option>
          {addresses.map(address => (
            <option
              key={address.id}
              value={address.id}
            >
              {address.name}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

PickupAddressForm.propTypes = {
  address: PropTypes.object,
  changeAddress: PropTypes.func,
  addresses: PropTypes.arrayOf(PropTypes.object),
}

export default memo(PickupAddressForm)