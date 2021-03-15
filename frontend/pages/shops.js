import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import Tippy from '@tippyjs/react'

import Layout from '../components/Layout'
import BouncerLoading from '../components/BouncerLoading'
import MapContainer from '../components/MapContainer'
import LocationIcon from '../components/icons/LocationIcon'
import {
  getPickupAddresses,
  selectAddress,
} from '../lib/slices/addressSlice'
import { convertPhoneNumber } from '../lib/utils/converters'


Modal.setAppElement('#__next')

const ModalContainer = ({ selectedShop }) => {

  if (!selectedShop) return null

  const { name, latitude, longitude } = selectedShop
  return (
    <>
      <h5>{`${name}:`}</h5>
      <MapContainer position={{ lat: latitude, lng: longitude }} />
    </>
  )
}

const ShopsTable = ({ shops, selectShop, openMap }) => {

  const handleOpenMap = (index) => {
    if (shops.length >= index) {
      selectShop(shops[index])
    }
    openMap()
  }

  return (
      <table className="table table--shops">
        <thead>
          <tr>
            <td>№</td>
            <td>Адрес</td>
            <td>Телефон</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
        {shops.map((shop, idx) => (
          <tr key={shop.id}>
            <td>{idx + 1}.</td>
            <td>{shop.name}</td>
            <td>{convertPhoneNumber(shop.phoneNumber)}</td>
            <td>
              <Tippy
                theme='blue'
                delay={[100, null]}
                content="Показать на карте"
              >
                <div>
                  <LocationIcon
                    className="location-icon"
                    width={28}
                    height={28}
                    onClick={() => handleOpenMap(idx)}
                  />
                </div>
              </Tippy>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
  )
}

export default function Shops() {
  const dispatch = useDispatch()
  const {
    pickupAddresses: shops,
    pickupAddressesLoding: loading
  } = useSelector(selectAddress)
  const [selectedShop, setSelectedShop] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(true)
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('no-scroll')
  }

  const closeModal = () => {
    setShowModal(false)
    const body = document.getElementsByTagName('body')[0]
    body.classList.remove('no-scroll')
  }

  const handleSelectShop = useCallback((shop) => {
    setSelectedShop(shop)
  }, [])

  const handleOpenModal = useCallback(() => {
    // setShowModal(true)
    openModal()
  }, [])

  useEffect(() => {
    if (shops.length === 0) {
      dispatch(getPickupAddresses())
    }
  }, [])

  return (
    <Layout
      title={"Магазины | Алладин96.ру"}
    >
      <section className="shops">
        <h1>Магазины</h1>
        <div className="shops-wrapper">
          <Modal
            className="modal modal-shops fade fade--fast"
            overlayClassName="modal-overlay fade fade--fast"
            isOpen={showModal}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={true}
          >
            <ModalContainer selectedShop={selectedShop} />
          </Modal>
          {loading ? (
            <div className="bouncer-wrapper">
              <BouncerLoading />
            </div>
          ) : shops.length > 0 ? (
            <ShopsTable
              shops={shops}
              selectShop={handleSelectShop}
              openMap={handleOpenModal}
            />
          ) : (
            <p>Здесь пока ничего нет :(</p>
          )}
        </div>
      </section>
    </Layout>
  )
}

ModalContainer.propTypes = {
  selectedShop: PropTypes.object
}

ShopsTable.propTypes = {
  shops: PropTypes.arrayOf(PropTypes.object),
  selectShop: PropTypes.func,
  openMap: PropTypes.func
}
