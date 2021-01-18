import { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import { promotionUrl } from '../constants'

// const promotions = [
//   { id: 1, title: "Два товара по цене одного", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id neque in nibh egestas ultricies." },
//   { id: 2, title: "Третий товар в чеке со скидкой 20%", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac iaculis neque, eget accumsan ipsum. Maecenas egestas lectus felis, id tempus quam luctus ut. Mauris." },
//   { id: 3, title: "Доставка бесплатно при заказе от 10 000 рублей",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur sollicitudin purus, sed pellentesque sem rhoncus sed. Duis id augue mauris. Nunc ac metus non tortor pharetra maximus. Duis ac arcu pulvinar, tincidunt tellus non." },
// ]

export default function Promotions() {
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    async function fetchData(url) {
      const res = await fetch(url)
      let data = await res.json()

      if (!data) {
        return []
      }

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
        {promotions.map((promotion) => (
          <div key={promotion.id} className="promotion">
            <h5>{promotion.title}</h5>
            <p>{promotion.description}</p>
          </div>
        ))}
      </section>
    </Layout>
  )
}