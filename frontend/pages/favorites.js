import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import FavoritesItem from '../components/FavoritesItem'
import useAuth from '../lib/hooks/useAuth'
import { authAxios } from '../lib/utils/authAxios'
import { favoritesUrl } from '../constants'


export default function Favorites() {
  // const router = useRouter()
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  // const [user, loading] = useAuth()

  useEffect(() => {
    async function fetchData(url) {
      const data = await authAxios().get(url)

      if (!data) {
        return []
      }

      return data.data
    }

    fetchData(favoritesUrl).then(data => {
      setFavorites(data)
      setFavoritesLoading(false)
    })
  }, [])

  // if (loading) {
  //   return <div></div>
  // }

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
                size={favorite.size}
                price={favorite.price}
                name={favorite.product.name}
                slug={favorite.product.slug}
                images={favorite.product.images}
                quantities={favorite.quantities}
              />
            ))) : (
              favoritesLoading ? (
                <div className="favorites-empty">
                  <p>Загрузка...</p>
                </div>
              ) : (
            <div className="favorites-empty">
            <p>В избранном пусто :(</p>
            <p>Добавляйте товары в избранное, чтобы быстрее находить их позже</p>
          </div>))}
        </div>
      </section>
    </Layout>
  )
}