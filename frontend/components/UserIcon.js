import { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Tippy from '@tippyjs/react/headless'

import SvgUserRegular from './icons/SvgUserRegular'
import SvgUserSolid from './icons/SvgUserSolid'


 function UserIcon({ user, onLogout }) {

  const displayedUser = useMemo(() => {
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
            <Tippy
              interactive={true}
              interactiveBorder={20}
              delay={[200, null]}
              placement='bottom'
              offset={[15, 0]}
              hideOnClick={true}
              render={attrs => (
                <div
                  id="dropdown-menu"
                  onClick={onLogout}
                  {...attrs}
                >
                  Выйти
                </div>
              )}
            >
              <div
                id="dropdown-button"
                className="search-nav-icon"
              >
                <SvgUserSolid width={18} height={18} />
                <p>{displayedUser}</p>
              </div>
            </Tippy>
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