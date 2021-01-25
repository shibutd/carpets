import { useState, useEffect, memo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import GridLinesSolid from './icons/GridLinesSolid'
import KovryIcon from './icons/KovryIcon'
import PalasyIcon from './icons/PalasyIcon'
import BlanketIcon from './icons/BlanketIcon'
import PillowIcon from './icons/PillowIcon'

import { categoryUrl } from '../constants'


const Catalog = forwardRef(({ opened, handleClick }, ref) => {
  const [categories, setCategories] = useState([])
  const iconProps = { width: 22, height: 22 }

  const icons = [
    { category: "kovry", icon: <KovryIcon { ...iconProps } /> },
    { category: "palasy", icon: <PalasyIcon { ...iconProps } /> },
    { category: "odeiala", icon: <BlanketIcon { ...iconProps } /> },
    { category: "postelnoe-bele", icon: <PillowIcon { ...iconProps } /> },
  ]

  useEffect(() => {
    async function fetchCategories(url) {
      const res = await fetch(url)

      if (!res.ok) {
        return []
      }

      return await res.json()
    }

    fetchCategories(categoryUrl).then((data) => {

      const categoriesWithIcons = data.map((category) => {
        const categoryIcon = icons.find(
          (x) => (x.category === category.slug)
        )
        const icon = categoryIcon ? categoryIcon.icon : null
        return { ...category, icon }
      })

      setCategories(categoriesWithIcons)
    })
  }, [])

  return (
    <button ref={ref} id="catalog" onClick={handleClick}>
      Каталог товаров
      <GridLinesSolid
        width={10}
        height={10}
        style={{marginLeft: "5px"}}
        fill="white"
      />
      {opened &&
        <div className="catalog-menu">
          {categories.map((category) => (
            <div
              className="catalog-item"
              key={category.slug}
            >
              <div className="catalog-item-icon">{category.icon}</div>
                <Link href={`/categories/${category.slug}`}>
                  <a>
                    <div className="catalog-item-name">
                      {category.name}
                    </div>
                  </a>
                </Link>
            </div>
          ))}
        </div>
      }
    </button>
  )
})

Catalog.displayName = Catalog

Catalog.propTypes = {
  opened: PropTypes.bool,
  handleClick: PropTypes.func,
}

export default memo(Catalog)