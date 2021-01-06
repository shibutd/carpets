import Link from 'next/link'
import { login, logout, selectUser } from '../lib/slices/authSlice'

import Layout from '../components/Layout'
import Register from '../components/Register'

export default function RegisterPage() {
  // const { user, error } = useSelector(selectUser)
  // const [userEmail, setUserEmail] = useState('')
  // const [userPassword, setUserPassword] = useState('')

  // const handleChangeEmail = (e) => {
  //   setUserEmail(e.target.value)
  // }

  // const handleChangePassword = (e) => {
  //   setUserPassword(e.target.value)
  // }

  // const handleLogin = (e) => {
  //   e.preventDefault()

  //   const userData = {
  //     email: userEmail,
  //     password: userPassword
  //   }
  //   dispatch(login(userData))

  //   setUserEmail('')
  //   setUserPassword('')
  // }

  // const handleLogout = (e) => {
  //   dispatch(logout())
  // }

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


  //         <div className={styles.card}>
  //           <form onSubmit={handleLogin}>
  //             {user ? <h3>Welcome, {user}</h3> : <h3>Login &rarr;</h3>}
  //             {error && <div>{error}</div>}
  //             <label>
  //               Email:
  //               <input type="email" value={userEmail} onChange={handleChangeEmail} required />
  //             </label>
  //             <br />
  //             <label>
  //               Pasword:
  //               <input type="password" value={userPassword} onChange={handleChangePassword} required />
  //             </label>
  //             <br />
  //             <input type="submit" value="Login" />
  //           </form>
  //           <button onClick={handleLogout}>Logout</button>
  //         </div>

}
