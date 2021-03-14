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
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Пароли должны совпадать")
    .required('Введите пароль повторно'),
})

export default function Register() {
  const router = useRouter()
  const { user, error, tryToRegisterUser } = useAuth()
  const [processing, setProcessing] = useState(false)
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const redirect = router.query.redirect

  const handleLoginFormSubmit = async (data) => {
    setProcessing(true)
    await tryToRegisterUser(data)
    setProcessing(false)
  }

  if (user) {
    router.push(redirect ?? '/')
    return <div></div>
  }

  console.log(error)

  return (
    <section className="register">
      <h1>Регистрация</h1>
      <span>Я уже зарегистрировался. </span>
      <Link href={`/login${redirect ? `?redirect=${redirect}` : ''}`}>
        <a>Войти в аккаунт</a>
      </Link>

      <div className="wrapper">
        <form
          className="form form--register"
          onSubmit={handleSubmit(handleLoginFormSubmit)}
        >
          {error && <p className="form-error form-error--center">&#9888; {error}</p>}

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
              autoComplete="on"
            />
            {errors.password && <p>&#9888; {errors.password.message}</p>}
          </div>

          <div className="form-vertical">
            <label className="form-label" htmlFor="confirmPassword">
              Подтвердите пароль
            </label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              ref={register}
              autoComplete="on"
            />
            {errors.confirmPassword &&
              <p className="form-error">&#9888; {errors.confirmPassword.message}</p>}
          </div>

          <button disabled={processing} type="submit">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </section>
  )
}
