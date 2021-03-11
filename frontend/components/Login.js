import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import useAuth from '../lib/hooks/useAuth'

const schema = yup.object().shape({
  email: yup.string()
    .email('Неверный адрес электронной почты')
    .required('Введите электронную почту'),
  password: yup.string()
    .min(8, 'Пароль должен быть длиннее 8 символов')
    .max(40, 'Пароль должен быть короче 40 символов')
    .required('Введите пароль'),
})

export default function Login() {
  const router = useRouter()
  const redirect = router.query.redirect
  const { user, error, tryToLoginUser } = useAuth()
  const [processing, setProcessing] = useState(false)
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })

  const handleLoginFormSubmit = async (data) => {
    setProcessing(true)
    await tryToLoginUser(data)
    setProcessing(false)
  }

  if (user) {
    router.push(redirect ?? '/')
    return <div></div>
  }

  return (
    <section className="register">
      <h1>Войти в аккаунт</h1>
      <span>У меня нет аккаунта. </span>
      <Link href={`/register${redirect ? `?redirect=${redirect}` : ''}`}>
        <a>Зарегистрироваться</a>
      </Link>

      <div className="wrapper">
        <form
          className="form form--register"
          onSubmit={handleSubmit(handleLoginFormSubmit)}
        >
          {error &&
            <p className="form-error form-error--center">&#9888; {error}</p>}

          <div className="form-vertical">
            <label className="form-label" htmlFor="email">
              Электронная почта
            </label>
            <input
              className="form-input"
              name="email"
              id="email"
              ref={register}
            />
            {errors.email
              && <p className="form-error">&#9888; {errors.email.message}</p>}
          </div>

          <div className="form-vertical">
            <label className="form-label" htmlFor="password">
              Пароль
            </label>
            <input
              className="form-input"
              type="password"
              name="password"
              id="password"
              ref={register}
            />
            {errors.password &&
              <p className="form-error">&#9888; {errors.password.message}</p>}
          </div>

          <button disabled={processing} type="submit">
            Войти
          </button>
        </form>
      </div>
    </section>
  )
}
