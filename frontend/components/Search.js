import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

import SearchSolid from './icons/SearchSolid'
import CloseSignSolid from './icons/CloseSignSolid'
import { clientProductUrl } from '../constants'

export default function Search() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [resultOpen, setResultOpen] = useState(false)
  const timerId = useRef(null)
  const controller = new AbortController()
  const signal = controller.signal

  const handleClose = useCallback(() => {
    clearTimeout(timerId.current)
    controller.abort()
    setResultOpen(false)
    setValue('')
  }, [])

  const handleChangeValue = useCallback((e) => {
    const value = e.target.value
    clearTimeout(timerId.current)
    controller.abort()
    setResultOpen(false)
    setValue(value)
  }, [])

  useEffect(() => {
    async function fetchData(query) {
      const url = `${clientProductUrl}?search=${query.replace(/ /g, '+')}`
      const res = await fetch(url, {
        method: "get",
        signal,
      })

      if (!res.ok) {
        setSearchResults([])
      }

      const data = await res.json()
      return data
    }

    function fetchFromServer(query) {
      fetchData(query).then(data => {
        setSearchResults(data.results)
        setResultOpen(true)
        setLoading(false)
      }).catch(e => {
        e.name === 'AbortError'
          ? null
          : console.log(e.message)
      })
    }

    if (value.trim().length > 2) {
      setLoading(true)

      timerId.current = setTimeout(() => {
        fetchFromServer(value)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [value])

  const results = (
    <div className="search-nav-result">
      {searchResults.length > 0
        ? (searchResults.map((result, i) => (
          <Link key={result.slug} href={`products/${result.slug}`}>
            <a>
              <div>{`${i + 1}. ${result.name}`}</div>
            </a>
          </Link>
        )))
        : (<p>Ничего не найдено по Вашему запросу</p>)}
    </div>
  )

  return (
    <div className="search-nav-input">
      <input
        type="text"
        placeholder="Поиск по товарам"
        value={value}
        onChange={handleChangeValue}
      />

      {(value || resultOpen) &&
        <button id="search-close-button" onClick={handleClose}>
          {loading && <p>Загрузка...</p>}<CloseSignSolid width={18} height={18} />
        </button>
      }

      <button>
        <SearchSolid width={18} height={18} />
      </button>
      {resultOpen && results}
    </div>
  )
}