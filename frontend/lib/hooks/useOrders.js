import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectUser } from '../slices/authSlice'

import { authAxios } from '../utils/authAxios'
import { createOrderUrl } from '../../constants'

const PICKUP_TYPE = 'PickupOrder'
const DELIVERY_TYPE = 'DeliveryOrder'


export default function useOrders() {
  const dispatch = useDispatch()
  const authInfo = useSelector(selectUser)

  const createOrder = useCallback(async (data) => {
    try {
      const axios = await authAxios(dispatch, authInfo)
      const res = await axios({
        method: 'post',
        url: createOrderUrl,
        data: data
      })

      return res
    } catch (error) {
      return error.response
    }
  }, [])

  const createPickupOrder = useCallback(async (id) => {
    return await createOrder({
      ordertype: PICKUP_TYPE,
      pickupAddress: id,
    })
  }, [])

  const createDeliveryOrder = useCallback(async (id) => {
    return await createOrder({
      ordertype: DELIVERY_TYPE,
      deliveryAddress: id,
    })
  }, [])

  return {
    createPickupOrder,
    createDeliveryOrder,
  }
}