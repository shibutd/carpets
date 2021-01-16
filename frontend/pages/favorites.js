import { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import FavoritesItem from '../components/FavoritesItem'
// import { favoritesUrl } from '../constants'

const favorites = [
  {id: 1, name: 'Ковер "Акварель"', slug: 'kover-akvarel', size: '2,00*2,90', price: '1185.15', images: [], "manufacturer": "Россия", "material": "Шерсть", 'inStock': "Есть в наличии"},
  {id: 2, name: 'Ковер "Болора"', slug: 'kover-bolora', size: '2,00*2,90', price: '6612.00', images: [], "manufacturer": "Турция", "material": "Шерсть", 'inStock': "Есть в наличии"},
  {id: 3, name: 'Ковер "Болора"', slug: 'kover-bolora', size: '1,60*2,30', price: '3548.44', images: [], "manufacturer": "Турция", "material": "Шерсть", 'inStock': "Нет в наличии"},
]


export default function Favorites() {
  // const [favorites, setFavorites] = useState([])

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   if (validateText(textAreaValue) && validateText(contactValue)) {
  //     alert(`Сообщение отправлено: ${textAreaValue}`)
  //     setTextAreaValue('')
  //     setContactValue('')
  //   }
  // }

  // useEffect(() => {
  //   async function fetchData(url) {
  //     const res = await fetch(url)
  //     let data = await res.json()

  //     if (!data) {
  //       return []
  //     }

  //     return data.results
  //   }

  //   fetchData(favoritesUrl).then(data => setFavorites(data))
  // }, [])

  return (
    <Layout
      title={"Избранное | Алладин96.ру"}
    >
      <section className="favorites">
        <h1>Избранное</h1>
        <div className="favorites-wrapper">
          {favorites?.length > 0 ? (
            favorites.map((favorite) => (
              <FavoritesItem
                key={favorite.id}
                name={favorite.name}
                slug={favorite.slug}
                size={favorite.size}
                price={favorite.price}
                images={favorite.images}
                manufacturer={favorite.manufacturer}
                material={favorite.material}
                inStock={favorite.inStock}
              />
            ))) :
          (<div className="favorites-empty">
            <p>В избранном пусто :(</p>
            <p>Добавляйте товары в избранное, чтобы быстрее находить их позже</p>
          </div>)}
        </div>
      </section>
    </Layout>
  )
}