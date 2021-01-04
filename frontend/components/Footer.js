import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <p><i>&copy Аладдин96, 2020</i></p>
      <div>
        <Link href="/politics">
          <a>Политика обработки персональных данных</a>
        </Link>
      </div>
    </footer>
  )
}