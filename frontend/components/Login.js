import { useState, memo } from 'react'
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

function Login() {
  const router = useRouter()
  const { user, error, tryToLoginUser } = useAuth()
  const [processing, setProcessing] = useState(false)
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })
  const redirect = router.query.redirect

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
      <p>У меня нет аккаунта. </p>
      <Link href={`/register${redirect ? `?redirect=${redirect}` : ''}`}>
        <a>Зарегистрироваться</a>
      </Link>

      <form
        className="register-form"
        onSubmit={handleSubmit(handleLoginFormSubmit)}
      >
        {error && <p>&#9888; {error}</p>}

        <div className="register-form-input">
          <label htmlFor="email">
            Электронная почта
          </label>
          <input
            name="email"
            id="email"
            ref={register}
          />
          {errors.email && <p>&#9888; {errors.email.message}</p>}
        </div>

        <div className="register-form-input">
          <label htmlFor="password">
            Пароль
          </label>
          <input
            type="password"
            name="password"
            id="password"
            ref={register}
          />
          {errors.password && <p>&#9888; {errors.password.message}</p>}
        </div>

        <button disabled={processing} type="submit">
          Войти
        </button>
      </form>
    </section>
  )
}

export default memo(Login)