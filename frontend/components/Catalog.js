import { useState, useEffect, memo, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'

import GridLinesSolid from './icons/GridLinesSolid'
import KovryIcon from './icons/KovryIcon'
import PalasyIcon from './icons/PalasyIcon'
import BlanketIcon from './icons/BlanketIcon'
import PillowIcon from './icons/PillowIcon'
import { getCategories, selectCategory } from '../lib/slices/categorySlice'

const iconProps = { width: 22, height: 22 }

const icons = [
  { category: "kovry", icon: <KovryIcon { ...iconProps } /> },
  { category: "palasy", icon: <PalasyIcon { ...iconProps } /> },
  { category: "odeiala", icon: <BlanketIcon { ...iconProps } /> },
  { category: "postelnoe-bele", icon: <PillowIcon { ...iconProps } /> },
]

const Catalog = forwardRef(({ label, opened, handleClick }, ref) => {
  const [categoriesWithIcons, setCategoriesWithIcons] = useState([])
  const dispatch = useDispatch()
  const { categories } = useSelector(selectCategory)

  useEffect(() => {
    async function fetchCategories() {
      if (categories.length === 0) {
        await dispatch(getCategories())
      }

      const categoriesWithIcons = categories.reduce((acc, current) => {
        const categoryIcon = icons.find(x => x.category === current.slug)
        const icon = categoryIcon ? categoryIcon.icon : null
        console.log(current)
        return [ ...acc, { ...current, icon }]
      }, [])

      console.log(categoriesWithIcons)

      setCategoriesWithIcons(categoriesWithIcons)
    }

    fetchCategories()
  }, [categories])

  return (

    <div>
      <button ref={ref} className="catalog" onClick={handleClick}>
        {label}
        <GridLinesSolid
          width={10}
          height={10}
          style={{marginLeft: "5px"}}
          fill="white"
        />
        {opened && (
          <div className="catalog-menu">
            {categoriesWithIcons.map(category => (
              <Link href={`/categories/${category.slug}`} key={category.slug}>
                <a>
                  <div
                    className="catalog-item"
                  >
                    <div className="catalog-item-icon">
                      {category.icon}
                    </div>
                    <div className="catalog-item-name">
                      {category.name}
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </div>)}
      </button>
    </div>
  )
})

Catalog.displayName = Catalog

Catalog.propTypes = {
  label: PropTypes.string,
  opened: PropTypes.bool,
  handleClick: PropTypes.func,
}

export default memo(Catalog)