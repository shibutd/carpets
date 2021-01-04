import Head from 'next/head'
import Link from 'next/link'
// import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { login, logout, selectUser } from '../lib/slices/authSlice'

import Layout from '../components/Layout'
import Carousel from '../components/Carousel'
import CategoryCard from '../components/CategoryCard'
import VerticalCards from '../components/VerticalCards'
import VerticalCard from '../components/VerticalCard'

export default function Home() {
  const carouselImages = [
    {id: 1, src: "carousel-img1.jpg"},
    {id: 2, src: "carousel-img2.jpg"},
    {id: 3, src: "carousel-img3.jpg"},
  ]
  const categories = [
    {title: "Российские ковры", href: "#", imageSrc: "ros-kovry.jpg"},
    {title: "Белорусские ковры", href: "#", imageSrc: "belorys-kovry.jpg"},
    {title: "Турецкие ковры", href: "#", imageSrc: "tur-kovry.jpg"},
    {title: "Детские ковры", href: "#", imageSrc: "detskie-kovry.jpg"},
  ]
  const hits = [
    {title: "Ковер Домо 27005-29545n", price: 1000, imageSrc: "hits-img2.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 2000, imageSrc: "hits-img3.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 5000, imageSrc: "hits-img1.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 9000, imageSrc: "hits-img4.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 4000, imageSrc: "hits-img5.jpg"},
  ]
  const novelties = [
    {title: "Ковер Комфорт 22206-29766o", price: 2000, imageSrc: "hits-img1.jpg"},
    {title: "Ковер Комфорт 22206-29766n", price: 22000, imageSrc: "hits-img2.jpg"},
    {title: "Ковер Комфорт 22206-29766n", price: 5000, imageSrc: "hits-img3.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 15000, imageSrc: "hits-img4.jpg"},
    {title: "Ковер Домо 27005-29545n", price: 1000, imageSrc: "hits-img5.jpg"},
  ]

  // const dispatch = useDispatch()
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
      title={"Алладин96.ру | магазин ковров"}
    >
      <section className="carousel">
        <Carousel images={carouselImages} />
      </section>

      <section className="categories">
        <h4>Популярные категории</h4>
        <div className="categories-cards">
          {categories.map((category) => (
            <CategoryCard
              key={category.imageSrc}
              title={category.title}
              href={category.href}
              imageSrc={category.imageSrc}
            />
          ))}
        </div>
      </section>

      <section className="vertical">
        <h4 className="vertical-title">Хиты продаж</h4>
        <VerticalCards>
          {hits.map(hit => (
            <VerticalCard
              key={hit.imageSrc}
              title={hit.title}
              price={hit.price}
              imageSrc={hit.imageSrc}
            />
          ))}
        </VerticalCards>
      </section>

      <section className="vertical">
        <h4 className="vertical-title">Новинки</h4>
        <VerticalCards>
          {novelties.map(novelty => (
            <VerticalCard
              key={novelty.imageSrc}
              title={novelty.title}
              price={novelty.price}
              imageSrc={novelty.imageSrc}
            />
          ))}
        </VerticalCards>
      </section>
    </Layout>
  )

  // return (
  //   <div className={styles.container}>
  //     <Head>
  //       <title>Create Next App</title>
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

  //     <main className={styles.main}>
  //       <h1 className={styles.title}>
  //         Welcome to Next.js!
  //       </h1>

  //       <Link href="/about">
  //         <a>About</a>
  //       </Link>

  //       <Link href="/contact">
  //         <a>Contact</a>
  //       </Link>

  //       <p className={styles.description}>
  //         Get started by editing{' '}
  //         <code className={styles.code}>pages/index.js</code>
  //       </p>

  //       <div className={styles.grid}>

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

  //       </div>
  //     </main>

  //     <footer className={styles.footer}>
  //       <a
  //         href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Powered by{' '}
  //         <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
  //       </a>
  //     </footer>
  //   </div>
  // )
}
