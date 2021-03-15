import { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import BouncerLoading from '../components/BouncerLoading'
import { promotionUrl } from '../constants'


export default function Promotions() {
  const [promotions, setPromotions] = useState([])
  const [promotionsLoading, setPromotionsLoading] = useState(true)

  useEffect(() => {
    async function fetchData(url) {
      const res = await fetch(url)
      let data = await res.json()

      if (!data) {
        return []
      }

      setPromotionsLoading(false)
      return data
    }

    fetchData(promotionUrl).then(data => setPromotions(data))
  }, [])

  return (
    <Layout
      title={"Акции | Алладин96.ру"}
    >
      <section className="promotions">
        <h1>Акции</h1>
        {promotionsLoading ? (
          <div className="bouncer-wrapper">
            <BouncerLoading />
          </div>
        ) : promotions.length > 0 ? (
          promotions.map((promotion) => (
            <div key={promotion.id} className="promotion">
              <h5>{promotion.title}</h5>
              <p>{promotion.description}</p>
            </div>
          ))
        ) : (
          <div className="error-message">Здесь пока ничего нет :(</div>
        )}
      </section>
    </Layout>
  )
}