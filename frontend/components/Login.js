import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"
// import Image from 'next/image'

import { login, selectUser } from '../lib/slices/authSlice'

// import { login, logout, selectUser } from '../lib/slices/authSlice'
// import useAuth from '../lib/hooks/useAuth'

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
  const dispatch = useDispatch()
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [user, loading] = useAuth()
  const { user, error } = useSelector(selectUser)
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  })


  const handleLoginFormSubmit = (data) => {
    console.log(data)

    // const userData = { email, password }
    // dispatch(login(userData))

    // setEmail('')
    // setPassword('')
  }

  return (
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

        <button type="submit">Войти</button>
      </form>
  )
}