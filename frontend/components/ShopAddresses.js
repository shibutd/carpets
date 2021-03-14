import { useState, memo, forwardRef } from 'react'
import PropTypes from 'prop-types'

import ChevronDownSolid from './icons/ChevronDownSolid'
import ChevronUpSolid from './icons/ChevronUpSolid'
import { convertPhoneNumber } from '../lib/utils/converters'

const Button = ({ opened, handleClick }) => {
  const properties = { width: 10, height: 10, style: { marginLeft: '5px' } }

  return (
    <button onClick={handleClick}>
      Адреса магазинов
      {!opened ? (
        <ChevronDownSolid { ...properties } />
      ) : (
        <ChevronUpSolid { ...properties } />
      )}
    </button>
  )
}

const ShopAddresses = forwardRef((
  { opened, addresses, handleClick },
  ref
) => {
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0)

  const selectAddress = (e) => {
    setSelectedAddressIdx(e.currentTarget.dataset.div_id)
    handleClick()
  }

  return (
    <div ref={ref} className="top-nav-address">
      <Button opened={opened} handleClick={handleClick} />
      <a href="#">
        {(addresses.length > selectedAddressIdx)
          ? convertPhoneNumber(
              addresses[selectedAddressIdx].phoneNumber
            )
          : ''
        }
      </a>
      {opened && (
        <div className="top-nav-address-list">
          {addresses.map((address, i) => (
            <div
              key={address.phoneNumber}
              className="top-nav-address-item"
              onClick={selectAddress}
              data-div_id={i}
            >
              {address.name} &mdash; {convertPhoneNumber(address.phoneNumber)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

ShopAddresses.displayName = ShopAddresses

Button.propTypes = {
  opened: PropTypes.bool,
  handleClick: PropTypes.func,
}

ShopAddresses.propTypes = {
  opened: PropTypes.bool,
  addresses: PropTypes.arrayOf(PropTypes.object),
  handleClick: PropTypes.func,
}

export default memo(ShopAddresses)