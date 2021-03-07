import { useState, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { usePopper } from 'react-popper';

import SvgUserRegular from './icons/SvgUserRegular'
import SvgUserSolid from './icons/SvgUserSolid'


 function UserIcon({ user, onLogout }) {
  const [dropdownShow, setDropdownShow] = useState(false)
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  const userDisplayed = useMemo(() => {
    if (user !== undefined && user !== null) {
      const usernameParts = user.split('@')
      return usernameParts[0].charAt(0).toUpperCase() + usernameParts[0].slice(1)
    }
  }, [user])

  return (
    <>
      {user
        ? (
          <>
            <div
              id="dropdown-button"
              ref={setReferenceElement}
              className="search-nav-icon"
              onClick={() => setDropdownShow(!dropdownShow)}
            >
              <SvgUserSolid width={18} height={18} />
              <p>{userDisplayed}</p>
            </div>

            <div
              id="dropdown-menu"
              className={dropdownShow ? "visible" : "hidden"}
              ref={setPopperElement}
              style={styles.popper}
              onClick={onLogout}
              {...attributes.popper}
            >
              Выйти
            </div>
          </>)
        : (
          <Link href="/login">
            <a>
              <div className="search-nav-icon">
                <SvgUserRegular width={18} height={18} />
                <p>Войти</p>
              </div>
            </a>
          </Link>
        )
      }
    </>
  )
}

UserIcon.propTypes = {
  user: PropTypes.string,
  onLogout: PropTypes.func,
}

export default memo(UserIcon)