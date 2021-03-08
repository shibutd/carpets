import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import Tippy from '@tippyjs/react'

import Layout from '../components/Layout'
import BouncerLoading from '../components/BouncerLoading'
import MapContainer from '../components/MapContainer'
import LocationIcon from '../components/icons/LocationIcon'
import { pickupAddressUrl } from '../constants'

Modal.setAppElement('#__next')

const ModalContainer = ({ selectedShop }) => {

  if (!selectedShop) return null

  const { name, latitude, longitude } = selectedShop
  return (
    <>
      <h5 id="shop-name">{`Магазин "${name}" на карте:`}</h5>
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
    <table className="checkout-ordersummary-table shops-table light-gray-container">
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
          <td>{shop.phoneNumber}</td>
          <td width="1%">
            <Tippy
              theme='blue'
              interactive={true}
              interactiveBorder={20}
              delay={[100, null]}
              content="Показать на карте"
            >
              <div>
                <LocationIcon
                  id="location-icon"
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
  const [shops, setShops] = useState([])
  const [shopsLoading, setShopsLoading] = useState(true)
  const [selectedShop, setSelectedShop] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleSelectShop = useCallback((shop) => {
    setSelectedShop(shop)
  }, [])

  const handleOpenModal = useCallback(() => {
    setShowModal(true)
  }, [])

  useEffect(() => {
    async function fetchData(url) {
      const res = await fetch(url)
      let data = await res.json()

      if (!data) {
        return []
      }

      setShopsLoading(false)
      return data
    }

    fetchData(pickupAddressUrl).then(data => setShops(data))
  }, [])

  return (
    <Layout
      title={"Магазины | Алладин96.ру"}
    >
      <section className="shops">
        <h1>Магазины</h1>
        <div className="shops-wrapper">
          <Modal
            className="modal modal-shops"
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            shouldCloseOnOverlayClick={true}
          >
            <ModalContainer selectedShop={selectedShop} />
          </Modal>
          {shopsLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '2rem'
              }}
            >
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
