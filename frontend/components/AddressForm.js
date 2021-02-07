import { useState, useEffect, useMemo } from 'react'
// import { useRouter } from 'next/router'
// import Link from 'next/link'
import { useQuery } from 'react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { fetchAddresses } from '../lib/utils/fetchAddresses'

const schema = yup.object().shape({
  city: yup.string()
    .required('Введите город'),
  street: yup.string()
    .required('Введите улицу'),
  houseNumber: yup.number()
    .required('Введите номер дома'),
  appartmentNumber: yup.string().notRequired(),
})

export default function AddressForm({ changeTab }) {
  const [deliveryType, setDeliveryType] = useState("pickup")
  // const [addresses, setAddresses] = useState([])
  const [selected, setSelected] = useState('none')
  // const [disabled, setDisabled] = useState(true)
  const { register, errors, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      city: 'Екатеринбург',
      street: 'Фролова',
      houseNumber: 27,
      appartmentNumber: 100,
    },
  })

  const {
    // isLoading,
    // isError,
    data: addresses,
  } = useQuery(
    'addresses',
    () => fetchAddresses(),
    {
      staleTime: 6000,
      cacheTime: 60000,
      refetchOnWindowFocus: false,
    }
  )

  const handleOptionChange = (e) => {
    const value = e.target.value
    setDeliveryType(value)
  }

  const handleChangeSelect = (e) => {
    const value = e.target.value
    setSelected(value)
  }

  const isDisabled = useMemo(() => {
    if (deliveryType === 'pickup') {
      return selected === 'none'
    }
    if (deliveryType === 'delivery') {
      return (!formState.isDirty) || (!formState.isValid)
    }
    return true
  }, [deliveryType, selected, formState])

  // useEffect(() => {
  //   const { isDirty, isValid } = formState
  //   console.log("isDirty", isDirty)
  //   console.log("isValid", isValid)
  // }, [formState])

  return (
    <div className="checkout-addressform">
      <p>Выберите тип доставки:</p>
      <form className="checkout-addressform-choice">
        <label>
          <input
            type="radio"
            value="pickup"
            checked={deliveryType === "pickup"}
            onChange={handleOptionChange}
          />
          Самовывоз
        </label>
        <label>
          <input
            type="radio"
            value="delivery"
            checked={deliveryType === "delivery"}
            onChange={handleOptionChange}
          />
          Доставка
        </label>
      </form>

      {(deliveryType === "pickup") && (
        <>
          <p>Выберите пункт самовывоза:</p>
          <div className="checkout-addressform-address">
            <label htmlFor="">Выбрать:</label>
            <select value={selected} onChange={handleChangeSelect}>
              <option value="none">{"..."}</option>
              {(addresses || []).map(address => (
                <option
                  key={address.phoneNumber}
                  value={address.name}
                >
                  {address.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {(deliveryType === "delivery") && (
      <>
        <p>Введите адрес доставки:</p>
        <div className="checkout-addressform-address">
          <form className="checkout-addressform-address-form fade">
            {/*{error && <p>&#9888; {error}</p>}*/}

            <div className="">
              <label htmlFor="city">
                Город*
              </label>
              <input
                name="city"
                id="city"
                ref={register}
              />
              {errors.city && <p>&#9888; {errors.city.message}</p>}
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
              {errors.street && <p>&#9888; {errors.street.message}</p>}
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
              {errors.houseNumber && <p>&#9888; {errors.houseNumber.message}</p>}
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
              {errors.appartmentNumber && <p>&#9888; {errors.appartmentNumber.message}</p>}
            </div>

          </form>
        </div>
      </>)}
      <div className="checkout-buttons">
        <button
          id="backwardbutton"
          onClick={() => changeTab(-1)}
        >
          &#10094; Назад
        </button>
        <button
          id="forwardbutton"
          disabled={isDisabled}
          onClick={() => changeTab(1)}
        >
          Далее &#10095;
        </button>
      </div>
    </div>
  )
}