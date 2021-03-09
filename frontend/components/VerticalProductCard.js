import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import { convertPrice } from '../lib/utils/converters'


export default function VerticalProductCard(props) {
  const { title, slug, price, images } = props

  const mainImage = images.length > 0 ? images[0].image : null
  const imageName = title.replace(/ /g, '_').replace(/\"/g, '')

  const imageSrc = mainImage
    ? `/media/product-images/${imageName}.jpg`
    : `/media/product-images/No_Image.jpg`

  return (
    <div className="category-card">
      <div className="vertical-card-left">
        <div className="vertical-card-image">
          <Link href={`/products/${slug}`}>
            <a>
              <Image
                src={imageSrc}
                alt={slug}
                height={170}
                width={170}
                loading="eager"
              />
            </a>
          </Link>
        </div>
        <div className="vertical-card-title">
          <Link href={`/products/${slug}`}><a>{title}</a></Link>
        </div>
        <div className="vertical-card-cost">
          от {`${convertPrice(price)} ₽`}
        </div>
      </div>
    </div>
  )
}

VerticalProductCard.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  price: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
}