import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import { convertPrice, convertSize } from '../lib/utils/converters'


export default function FavoritesItem(props) {
  const {
    name,
    slug,
    size,
    price,
    images,
    manufacturer,
    material,
    inStock,
  } = props

  const mainImage = images.length > 0 ? images[0].image : null

  const imageName = name.replace(/ /g, '_').replace(/\"/g, '')

  const imageSrc = mainImage
    ? `/media/product-images/${imageName}.jpg`
    : `/media/product-images/No_Image.jpg`

  return (
    <div className="favorites-item">
      <div className="favorites-item-img">
        <Image
          src={imageSrc}
          alt={slug}
          height={120}
          width={120}
        />
      </div>
      <div className="favorites-item-name">
        <Link href={`/products/${slug}`} replace>
          <a><h5>{name}</h5></a>
        </Link>
        <p>{`Производитель: ${manufacturer}`}</p>
        <p>{`Материал: ${material}`}</p>
        <p>{`Размер: ${convertSize(size)}`}</p>
      </div>
      <div className="favorites-item-price">
        <h5>{`${convertPrice(price)} ₽`}</h5>
        <p>{inStock}</p>
      </div>
    </div>
  )
}

FavoritesItem.propTypes = {
  name: PropTypes.string,
  slug: PropTypes.string,
  size: PropTypes.string,
  price: PropTypes.string,
  images: PropTypes.array,
  manufacturer: PropTypes.string,
  material: PropTypes.string,
  inStock: PropTypes.string,
}