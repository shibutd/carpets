import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import FavoritesItem from '../components/FavoritesItem'
// import useAuth from '../lib/hooks/useAuth'
// import { authAxios } from '../lib/utils/authAxios'
// import { favoritesUrl } from '../constants'
import useFavorites from '../lib/hooks/useFavorites'


export default function Favorites() {
  // const router = useRouter()
  const [favoriteItems, setFavoriteItems] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  // const [user, loading] = useAuth()
  const {
    getFavorites,
    removeFromFavorites,
  } = useFavorites()

  async function handleRemoveFavorite(id) {
    const res = await removeFromFavorites(id)
    if (res.status === 204) {
      const newFavorites = favoriteItems.filter(
        (item) => (item.id !== id)
      )
      setFavoriteItems(newFavorites)
    }
  }

  useEffect(() => {
    getFavorites().then((res) => {
      setFavoriteItems(res.data)
      setFavoritesLoading(false)
    })
  }, [])

  return (
    <Layout
      title={"Избранное | Алладин96.ру"}
    >
      <section className="favorites">
        <h1>Избранное</h1>
        <div className="favorites-wrapper">
          {favoriteItems?.length > 0 ? (
            favoriteItems.map((item) => (
              <FavoritesItem
                key={item.id}
                id={item.id}
                size={item.size}
                price={item.price}
                name={item.product.name}
                slug={item.product.slug}
                images={item.product.images}
                quantities={item.quantities}
                onDelete={handleRemoveFavorite}
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