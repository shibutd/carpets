import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { login, selectUser } from '../lib/slices/authSlice'
// import useAuth from '../lib/hooks/useAuth'
import useCart from '../lib/hooks/useCart'

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
  const dispatch = useDispatch()
  const [processing, setProcessing] = useState(false)
  const { updateCart } = useCart()
  const { user, error } = useSelector(selectUser)
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "admin@admin.com",
      password: "54321qwe",
    },
  })


  const handleLoginFormSubmit = (data) => {
    setProcessing(true)
    console.log(data)
    // const dispatchResponse = await dispatch(login(data))

    // if (dispatchResponse.meta.requestStatus === "fulfilled") {
    //   console.log("login response successful")
    //   router.push('/')
    // } else {
    //   console.log("login response unsuccessful")
    // }
    dispatch(login(data))
      .then(() => {
        updateCart()
        router.push('/')
      })

    setProcessing(false)
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

      <button disabled={processing} type="submit">Войти</button>
    </form>
  )
}