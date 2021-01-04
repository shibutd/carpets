import Link from 'next/link'
import Image from 'next/image'

export default function VerticalCard({ title, price, imageSrc }) {
  let priceToString = price.toString()

  return (
    <div className="vertical-card">
      <div className="vertical-card-image">
        <Image
          src={`/images/${imageSrc}`}
          alt={title}
          height={150}
          width={150}
          loading="eager"
        />
      </div>
      <div className="vertical-card-title">
        <Link href="/product"><a>{title}</a></Link>
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