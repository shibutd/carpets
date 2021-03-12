import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import { convertPrice, getValidImageSrc } from '../lib/utils/converters'


export default function VerticalProductCard(props) {
  const { name, slug, price, images } = props

  return (
    <div className="category-card">
      <div className="vertical-card-left">
        <div className="vertical-card-image">
          <Link href={`/products/${slug}`}>
            <a>
              <Image
                src={getValidImageSrc(images)}
                alt={slug}
                height={170}
                width={170}
                loading="eager"
              />
            </a>
          </Link>
        </div>
        <div className="vertical-card-title">
          <Link href={`/products/${slug}`}><a>{name}</a></Link>
        </div>
        <div className="vertical-card-cost">
          от {`${convertPrice(price)} ₽`}
        </div>
      </div>
    </div>
  )
}

VerticalProductCard.propTypes = {
  name: PropTypes.string,
  slug: PropTypes.string,
  price: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
}