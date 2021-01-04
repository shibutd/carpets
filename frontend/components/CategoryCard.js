import Link from 'next/link'
import Image from 'next/image'

export default function CategoryCard({ title, href, imageSrc }) {
  return (
    <div className="categories-card">
      <Link href={href}>
        <a>
          <p className="categories-card-title">{title}</p>
          <Image
            src={`/images/${imageSrc}`}
            alt={title}
            width={500}
            height={500}
          />
        </a>
      </Link>
    </div>
  )
}