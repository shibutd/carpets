import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function ProductDesc({ product }) {
  const { manufacturer, material, quantities } = product

  const [currentTab, setCurrentTab] = useState(1)
  const [
    askQuestionTextareaValue,
    setAskQuestionTextareaValue
  ] = useState('')
  let renderingComponent = ''

  useEffect(() => {
    const tabs = Array.from(document.querySelectorAll(".tab"))
    tabs.forEach(
      tab => tab.className = tab.className.replace(" active-tab", "")
    )
    tabs[currentTab - 1].className += " active-tab"
  }, [currentTab])

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
        <p>Сверхтонкие воздушные ковры из мягкой вискозы и хлопка Grazia от фабрики Ragolle выполнены в классических, неоклассических и современных дизайнах. Здесь можно встретить как стилизацию под восточные ковры, так и оригинальные будто состаренные ковры в стиле пэчворк. <br />Благодаря содержащейся в бельгийских коврах вискозе они невероятно тонкие. На ощупь такие же мягкие и красиво переливаются и блестят на солнце, как натуральные шёлковые. Ковры не будут терять яркости цветов при попадании солнечных лучей и надолго сохранят насыщенные оттенки.</p>
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
        {quantities.map(qunatity => (
          <div key={qunatity.address} className="available-place">
            <div className="available-place-address">
              {qunatity.address}
            </div>
            <div className="available-place-phone">
              +7 (343) 237 47 47
            </div>
            <div className="available-place-availablity">
              {qunatity.amount > 0 ? "Есть в наличии" : "Нет в наличии"}
            </div>
          </div>
        ))}

       {/* <div className="available-place">
          <div className="available-place-address">
            ул.Донбасская, 2
          </div>
          <div className="available-place-phone">
            +7 (343) 237 47 47
          </div>
          <div className="available-place-availablity">
            Нет в наличии
          </div>
        </div>
        <div className="available-place">
          <div className="available-place-address">
            ул.Татищева, 25
          </div>
          <div className="available-place-phone">
            +7 (343) 237 47 55
          </div>
          <div className="available-place-availablity">
            В наличии 2 шт.
          </div>
        </div>
        <div className="available-place">
          <div className="available-place-address">
            ул.Московский тракт, 2б
          </div>
          <div className="available-place-phone">
            +7 (343) 237 47 22
          </div>
          <div className="available-place-availablity">
            Нет в наличии
          </div>
        </div>*/}
      </div>
    )
  }

  if (currentTab === 4) {
    renderingComponent = (
      <div className="product-desc-question property">
        <p>Для этого товара пока нет вопросов</p>
        <p>Задавайте вопросы и наши эксперты помогут вам найти ответ:</p>

        <form onSubmit={handleAskQuestion}>
          <textarea
            className="question-textarea"
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
    <div className="product-desc-tab">
      <span className="tab" onClick={() => setCurrentTab(1)}>Описание</span>
      <span className="tab" onClick={() => setCurrentTab(2)}>Характеристики</span>
      <span className="tab" onClick={() => setCurrentTab(3)}>Наличие в магазинах</span>
      <span className="tab" onClick={() => setCurrentTab(4)}>Вопрос-ответ</span>
    </div>
    { renderingComponent }
    </>
  )
}

ProductDesc.propTypes = {
  product: PropTypes.object
}