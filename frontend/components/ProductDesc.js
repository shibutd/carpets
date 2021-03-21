import { useState } from 'react'
import PropTypes from 'prop-types'


export default function ProductDesc({
  manufacturer,
  material,
  description,
  quantities,
}) {

  const [currentTab, setCurrentTab] = useState(1)
  const [
    askQuestionTextareaValue,
    setAskQuestionTextareaValue
  ] = useState('')
  let renderingComponent = null

  const handleAskQuestion = (e) => {
    e.preventDefault()
    if (askQuestionTextareaValue !== '') {
      alert('Вопрос отправлен: ' + askQuestionTextareaValue)
      setAskQuestionTextareaValue('')
    }
  }

  if (currentTab === 1) {
    renderingComponent = (
      <div className="product-desc-desc property">
        {description ? <p>description</p> : <p>Здесь пока ничего нет :(</p>}
      </div>
    )
  }

  if (currentTab === 2) {
    renderingComponent = (
      <div className="product-desc-props property">
        <div className="props">
          <div className="props-title">
            Бренд
          </div>
          <div className="props-value">
            Ragolle
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Коллекция
          </div>
          <div className="props-value">
            Grazia
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Страна бренда
          </div>
          <div className="props-value">
            Бельгия
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Страна производства
          </div>
          <div className="props-value">
            {manufacturer}
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Тип производства
          </div>
          <div className="props-value">
            машинное
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Плотность ворса
          </div>
          <div className="props-value">
            890500 точек/м2
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Материал
          </div>
          <div className="props-value">
            {material}
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Состав ворса
          </div>
          <div className="props-value">
            60% вискоза, 40% хлопка
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Состав основы
          </div>
          <div className="props-value">
            100% хлопка
          </div>
        </div>
        <div className="props">
          <div className="props-title">
            Высота ворса
          </div>
          <div className="props-value">
            3 мм
          </div>
        </div>
      </div>
    )
  }

  if (currentTab === 3) {
    renderingComponent = (
      <div className="product-desc-available property">
        {quantities?.map(qunatity => (
          <div key={qunatity.address} className="available-place light-gray-container">
            <div className="available-place-address">
              {qunatity.address}
            </div>
            <div className="available-place-phone">
              +7 (343) 237 47 47
            </div>
            <div className="available-place-availablity ">
              {qunatity.amount > 0 ? "Есть в наличии" : "Под заказ"}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (currentTab === 4) {
    renderingComponent = (
      <div className="product-desc-question property">
        <p>Для этого товара пока нет вопросов</p>
        <p>Здесь Вы можете задать вопрос о товаре, наши специалисты помогут найти ответ:</p>

        <form className="form form--product-ask" onSubmit={handleAskQuestion}>
          <textarea
            className="form-textarea"
            rows="4"
            cols="30"
            value={askQuestionTextareaValue}
            onChange={(e) => setAskQuestionTextareaValue(e.target.value)}
          />
          <button onClick={handleAskQuestion}>Задать вопрос</button>
        </form>
      </div>
    )
  }

  return (
    <>
    <ul className="product-desc-tabs">
      <li
        className={currentTab === 1 ? 'active-tab' : ''}
        onClick={() => setCurrentTab(1)}
      >
        Описание
      </li>
      <li
        className={currentTab === 2 ? 'active-tab' : ''}
        onClick={() => setCurrentTab(2)}
      >
        Характеристики
      </li>
      <li
        className={currentTab === 3 ? 'active-tab' : ''}
        onClick={() => setCurrentTab(3)}
      >
        Наличие в магазинах
      </li>
      <li
        className={currentTab === 4 ? 'active-tab' : ''}
        onClick={() => setCurrentTab(4)}
      >
        Вопрос-ответ
      </li>
    </ul>
    { renderingComponent }
    </>
  )
}

ProductDesc.propTypes = {
  manufacturer: PropTypes.string,
  material: PropTypes.string,
  description: PropTypes.string,
  quantities: PropTypes.array,
}