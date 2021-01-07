import Link from 'next/link'
import { login, logout, selectUser } from '../lib/slices/authSlice'

import Layout from '../components/Layout'
import Login from '../components/Login'

export default function LoginPage() {

  return (
    <Layout
      title={"Вход в аккаунт | Алладин96.ру"}
    >
      <section className="register">
        <h1>Войти в аккаунт</h1>
        <p>У меня нет аккаунта. </p><Link href="/register"><a>Зарегистрироваться</a></Link>
        <Login />
      </section>
    </Layout>
  )
}
