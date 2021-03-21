import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import { convertPrice, convertSize, getValidImageSrc } from '../lib/utils/converters'


export default function FavoritesItem(props) {
  const {
    id,
    size,
    price,
    name,
    slug,
    images,
    quantities,
    onDelete,
  } = props

  const inStock = () => {
    for (let i = 0; i < quantities.length; i++) {
      if (quantities[i].amount > 0)  {
        return true
      }
    }
    return false
  }

  return (
    <div className="favorites-item">
      <div className="favorites-item-img">
        <Image
          src={getValidImageSrc(images)}
          alt={slug}
          height={120}
          width={120}
        />
      </div>
      <div className="favorites-item-name">
        <Link href={`/products/${slug}`} replace>
          <a><h5>{name}</h5></a>
        </Link>
        <p>{`Размер: ${convertSize(size)}`}</p>
      </div>
      <div className="favorites-item-price">
        <h5>{`${convertPrice(price)} ₽`}</h5>
        <p>{inStock() ? 'Есть в наличии' : 'Под заказ'}</p>
        <button
          id="favorites-delete-button"
          onClick={() => onDelete(id)}
        >
          Удалить из избранного
        </button>
      </div>
    </div>
  )
}

FavoritesItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  slug: PropTypes.string,
  size: PropTypes.string,
  price: PropTypes.string,
  images: PropTypes.array,
  quantities: PropTypes.array,
  onDelete: PropTypes.func,
}