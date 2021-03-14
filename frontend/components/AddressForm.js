import { useState, useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import BouncerLoading from './BouncerLoading'
import PickupAddressForm from './PickupAddressForm'
import DeliveryAddressForm from './DeliveryAddressForm'
import {
  createDeliveryAddress,
  changeAddress,
  selectAddress,
} from '../lib/slices/addressSlice'
import { fetchUserAddresses } from '../lib/utils/fetchUserAddresses'

const schema = yup.object().shape({
  city: yup.string()
    .required('Введите город'),
  street: yup.string()
    .required('Введите улицу'),
  houseNumber: yup.number()
    .typeError('Введите номер дома')
    .required('Введите номер дома'),
  appartmentNumber: yup.string().notRequired(),
})


export default function AddressForm({ changeTab }) {
  let renderedElement
  const dispatch = useDispatch()
  const { loading, error, pickupAddresses } = useSelector(selectAddress)

  const [deliveryType, setDeliveryType] = useState('pickup')
  const [deliveryAddressCreate, setDeliveryAddressCreate] = useState(true)

  const [selected, setSelected] = useState({
    pickupId: -1,
    pickAddress: {},
    pickupIsValid: false,
    deliveryId: -1,
    deliveryAddress: {},
    deliveryIsValid: false,
  })

  const { register, errors: formErrors, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const {
    // isLoading,
    // isError,
    data: userAddresses,
  } = useQuery('userAddresses',
    () => fetchUserAddresses(),
    {
      staleTime: 6000,
      cacheTime: 60000,
      refetchOnWindowFocus: false,
    }
  )

  const formIsValid = () => {
    const { isDirty, isValid } = formState
    return isDirty && isValid
  }

  const isDisabled = useMemo(() => {
    switch (deliveryType) {
      case 'pickup':
        return !selected.pickupIsValid
      case 'delivery':
        return deliveryAddressCreate
          ? !formIsValid()
          : !selected.deliveryIsValid
      default:
        return true
    }
  }, [deliveryType, selected, formState])

  const handleChangeSelected = useCallback((args) => {
    setSelected({ ...selected, ...args })
  }, [])

  const handleChangeDeliveryAddressCreate = useCallback((e) => {
    const value = e.target.value
    setDeliveryAddressCreate(value === 'true' ? true : false)
  }, [])

  const handleChangeTab = async () => {
    if (isDisabled) return

    if (deliveryType === 'pickup') {
      dispatch(changeAddress({
        type: 'pickup',
        ...selected.pickupAddress
      }))
    } else if (deliveryType === 'delivery' && deliveryAddressCreate) {
      const disp = await dispatch(createDeliveryAddress(getValues()))
      if (disp.meta.requestStatus === 'rejected') return
    } else if (deliveryType === 'delivery' && !deliveryAddressCreate) {
      dispatch(changeAddress({
        type: 'delivery',
        ...selected.deliveryAddress
      }))
    }
    changeTab(1)
  }

  renderedElement = deliveryType === 'pickup'
    ? <PickupAddressForm
        address={selected}
        changeAddress={handleChangeSelected}
        addresses={pickupAddresses ?? []}
      />
    : <DeliveryAddressForm
        address={selected}
        changeAddress={handleChangeSelected}
        addressCreate={deliveryAddressCreate}
        changeAddressCreate={handleChangeDeliveryAddressCreate}
        addresses={userAddresses ?? []}
        register={register}
        formErrors={formErrors}
        error={error}
      />

  return (
    <div className="checkout-addressform">
      <p>Выберите тип доставки:</p>
      <form className="checkout-addressform-choice">
          <label>
            <input
              type="radio"
              value="pickup"
              checked={deliveryType === "pickup"}
              onChange={() => setDeliveryType('pickup')}
            />
            <span className="checkmark-round"></span>
            Самовывоз
          </label>

          <label>
            <input
              type="radio"
              value="delivery"
              checked={deliveryType === "delivery"}
              onChange={() => setDeliveryType('delivery')}
            />
            <span className="checkmark-round"></span>
            Доставка
          </label>
      </form>
      {renderedElement}
      <div className="checkout-buttons">
        <button
          className="dark-gray-button"
          onClick={() => changeTab(-1)}
        >
          &#10094; Назад
        </button>
        <button
          disabled={isDisabled}
          onClick={() => handleChangeTab()}
        >
          {loading
            ? <BouncerLoading
                totalHeight={'20px'}
                height={'5px'}
                width={'5px'}
                background={'white'}
              />
            : <span>Далее &#10095;</span>
          }
        </button>
      </div>
    </div>
  )
}