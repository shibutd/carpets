import { useState } from 'react'
import { usePopper } from 'react-popper';
import Link from 'next/link'
import Image from 'next/image'

import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../lib/slices/authSlice'
import Icon from './Icon'

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
              <Icon src={"/icons/user-solid.svg"} alt={"user"} />
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
                <Icon src={"/icons/user-regular.svg"} alt={"user"} />
                <p>Войти</p>
              </div>
            </a>
          </Link>
        )
      }
    </>
  )
}