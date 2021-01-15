import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

export default function CategoryCard({ title, slug, imageSrc }) {

  const imageName = title.replace(' ', '_').replace('"', '')
  if (imageSrc !== undefined && imageSrc.startsWith('http')) {
    imageSrc = `/media/category-images/${imageName}.jpg`
  }

  return (
    <div className="categories-card">
      <Link href={`/categories/${slug}`}>
        <a>
          <p className="categories-card-title">{title}</p>
          <Image
            src={imageSrc}
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