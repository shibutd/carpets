import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { registerUser, selectUser } from '../lib/slices/authSlice'
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

export default function Register() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [processing, setProcessing] = useState(false)
  const { user, error } = useSelector(selectUser)
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
    console.log(data)
    const dispatchResponse = await dispatch(registerUser(data))

    if (dispatchResponse.meta.requestStatus === "fulfilled") {
      console.log("register response successful")
      router.push('/')
    } else {
      console.log("register response unsuccessful")
    }

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
  )
}