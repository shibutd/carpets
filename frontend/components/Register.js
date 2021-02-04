import { useState, memo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

// import useAuth from '../lib/hooks/useAuth'

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

function Register({ user, error, tryToRegisterUser }) {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "admin@admin.com",
      password: "54321qwe",
      confirmPassword: "54321qwe",
    },
  })

  const handleLoginFormSubmit = async (data) => {
    setProcessing(true)
    await tryToRegisterUser(data)
    setProcessing(false)
  }

  if (user) {
    router.query.redirect
      ? router.push(`${router.query.redirect}`)
      : router.push('/')

    return <div></div>
  }

  return (
    <section className="register">
      <h1>Регистрация</h1>
      <p>Я уже зарегистрировался. </p>
      <Link href="/login">
        <a>Войти в аккаунт</a>
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

        <div className="register-form-input">
          <label htmlFor="confirmPassword">
            Подтвердите пароль
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            ref={register}
          />
          {errors.confirmPassword && (
            <p>&#9888; {errors.confirmPassword.message}</p>
          )}
        </div>

        <button disabled={processing} type="submit">Зарегистрироваться</button>
      </form>
    </section>
  )
}

export default memo(Register)