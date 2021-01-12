import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function VerticalCard({ title, slug, price, imageSrc }) {
  let priceToString = price.toString().split('.')[0]

  if (imageSrc !== undefined && imageSrc.startsWith('http')) {
    imageSrc = `media/product-images/${title.replace(' ', '_')}.jpg`
  }

  return (
    <div className="vertical-card">
      <div className="vertical-card-image">
        <Image
          src={`/images/${imageSrc}`}
          alt={slug}
          height={150}
          width={150}
          loading="eager"
        />
      </div>
      <div className="vertical-card-title">
        <Link href={`/products/${slug}`}><a>{title}</a></Link>
      </div>
      <div className="vertical-card-cost">
        {(priceToString.length > 3)
          ? (priceToString.slice(0, -3).concat(' ', priceToString.slice(-3)))
          : (priceToString)
        } ₽
      </div>
    </div>
  )
}

VerticalCard.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  price: PropTypes.string,
  imageSrc: PropTypes.string,
}