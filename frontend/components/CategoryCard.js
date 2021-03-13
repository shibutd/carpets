import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function CategoryCard({ title, slug, imageSrc }) {

  return (
    <div className="categories-card">
      <Link href={`/categories/${slug}`}>
        <a>
          <p className="categories-card-title">{title}</p>
          <Image
            src={imageSrc ?? '/images/no_image.jpg'}
            alt={title}
            width={500}
            height={500}
          />
        </a>
      </Link>
    </div>
  )
}

CategoryCard.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  imageSrc: PropTypes.string,
}