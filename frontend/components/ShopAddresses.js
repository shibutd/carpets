import { useState, useEffect, memo, forwardRef } from 'react'
import PropTypes from 'prop-types'

import ChevronDownSolid from './icons/ChevronDownSolid'
import ChevronUpSolid from './icons/ChevronUpSolid'
import { pickupAddressUrl } from '../constants'

const ShopAddresses = forwardRef(({ opened, handleClick }, ref) => {
  const [addresses, setAddresses] = useState([
    { name: '', phoneNumber: '+79121448812' }
  ])
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0)

  const convertPhoneNumber = (number) => {
    let convertedNumber = ''
    return convertedNumber.concat(
      number.slice(0, 2),
      ' (',
      number.slice(2, 5),
      ') ',
      number.slice(-7, -4),
      ' ',
      number.slice(-4, -2),
      ' ',
      number.slice(-2),
    )
  }

  // console.log(ref)

  const selectAddress = (e) => {
    setSelectedAddressIdx(e.currentTarget.dataset.div_id)
    handleClick()
  }

  useEffect(() => {
    async function fetchAddresses(url) {
      const res = await fetch(url)

      if (!res.ok) {
        return []
      }

      return await res.json()
    }

    fetchAddresses(pickupAddressUrl).then((data) => {
      setAddresses(data)
    })

  }, [])

  return (
    <div ref={ref} className="top-nav-address">
      <button onClick={handleClick}>
        Адреса магазинов
        {!opened ? (
          <ChevronDownSolid
            width={10}
            height={10}
            style={{marginLeft: "5px"}}
          />
        ) : (
          <ChevronUpSolid
            width={10}
            height={10}
            style={{marginLeft: "5px"}}
          />
        )}
      </button>
      <a href="#">
        {(addresses.length > selectedAddressIdx)
          ? convertPhoneNumber(addresses[selectedAddressIdx].phoneNumber)
          : ''
        }
      </a>
      {opened &&
      (<div className="top-nav-address-list">
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
      </div>)}
    </div>
  )
})

ShopAddresses.displayName = ShopAddresses

ShopAddresses.propTypes = {
  opened: PropTypes.bool,
  handleClick: PropTypes.func,
}

export default memo(ShopAddresses)