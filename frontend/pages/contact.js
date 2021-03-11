import { useState } from 'react'

import Layout from '../components/Layout'


export default function Contact() {
  const [textAreaValue, setTextAreaValue] = useState('')
  const [contactValue, setContactValue] = useState('')

  const validateText = (text) => text.replace(/ /g, '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateText(textAreaValue) && validateText(contactValue)) {
      alert(`Сообщение отправлено: ${textAreaValue}`)
      setTextAreaValue('')
      setContactValue('')
    }
  }

  return (
    <Layout
      title={"Обратная связь | Алладин96.ру"}
    >
      <section className="contact">
        <h1>Обратная связь</h1>
        <h5>Здесь Вы можете задать вопрос, оставить жалобу или внести предложение:</h5>
        <div className="wrapper">
          <form className="form form--contact" onSubmit={handleSubmit}>
            <textarea
              className="form-textarea"
              rows="15"
              cols="30"
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
            />
            <label htmlFor="text">
              Телефон или Email для связи:
            </label>
            <input
              className="form-input"
              name="text"
              type="text"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
            />
            <button onClick={handleSubmit}>Отправить</ button>
          </form>
        </div>
      </section>
    </Layout>
  )
}