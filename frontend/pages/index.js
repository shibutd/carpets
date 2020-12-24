import Head from 'next/head'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, selectUser } from '../lib/slices/authSlice'
import styles from '../styles/Home.module.css'

export default function Home() {
  const dispatch = useDispatch()
  const { user, error } = useSelector(selectUser)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const handleChangeEmail = (e) => {
    setUserEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setUserPassword(e.target.value)
  }

  const handleLogin = (e) => {
    e.preventDefault()

    const userData = {
      email: userEmail,
      password: userPassword
    }
    console.log(userData)
    dispatch(login(userData))

    setUserEmail('')
    setUserPassword('')
  }

  const handleLogout = (e) => {
    dispatch(logout())
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>

          <div className={styles.card}>
            <form onSubmit={handleLogin}>
              {user ? <h3>Welcome, {user}</h3> : <h3>Login &rarr;</h3>}
              {error && <div>{error}</div>}
              <label>
                Email:
                <input type="email" value={userEmail} onChange={handleChangeEmail} required />
              </label>
              <br />
              <label>
                Pasword:
                <input type="password" value={userPassword} onChange={handleChangePassword} required />
              </label>
              <br />
              <input type="submit" value="Login" />
            </form>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
