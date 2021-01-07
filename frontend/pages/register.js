import Link from 'next/link'
import { login, logout, selectUser } from '../lib/slices/authSlice'

import Layout from '../components/Layout'
import Register from '../components/Register'

export default function RegisterPage() {

  return (
    <Layout
      title={"Регистрация | Алладин96.ру"}
    >
      <section className="register">
        <h1>Регистрация</h1>
        <p>Я уже зарегистрировался. </p><Link href="/login"><a>Войти в аккаунт</a></Link>
        <Register />
      </section>
    </Layout>
  )
}
