import { useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux'

import { logout } from '../lib/slices/authSlice'
import SvgUserRegular from './icons/SvgUserRegular'
import SvgUserSolid from './icons/SvgUserSolid'


export default function UserIcon({ user }) {
  const dispatch = useDispatch()
  const [dropdownShow, setDropdownShow] = useState(false)
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  const userDisplayed = (username) => {
    if (username !== undefined && username !== null) {
      const usernameParts = username.split('@')
      return usernameParts[0].charAt(0).toUpperCase() + usernameParts[0].slice(1)
    }
  }

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
              <p>{userDisplayed(user)}</p>
            </div>

            <div
              id="dropdown-menu"
              className={dropdownShow ? "visible" : "hidden"}
              ref={setPopperElement}
              style={styles.popper}
              onClick={() => dispatch(logout())}
              {...attributes.popper}
            >
              Выйти
            </div>
          </>
        )
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
  user: PropTypes.string
}