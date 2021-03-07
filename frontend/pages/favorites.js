import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import FavoritesItem from '../components/FavoritesItem'
import BouncerLoading from '../components/BouncerLoading'
import useAuth from '../lib/hooks/useAuth'
import useFavorites from '../lib/hooks/useFavorites'


export default function Favorites() {
  const router = useRouter()
  const [favoriteItems, setFavoriteItems] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  const { user, loaded } = useAuth()
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
    if (user) {
      getFavorites().then((res) => {
        setFavoriteItems(res ? res.data : [])
        setFavoritesLoading(false)
      })
    }
  }, [user])

  if (!loaded) {
    return <div></div>
  }

  if (loaded && !user) {
    router.push('/login?redirect=favorites')
    return <div></div>
  }

  return ((loaded && user) &&
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
                <div
                  style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
                >
                  <BouncerLoading />
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