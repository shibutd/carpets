import Image from 'next/image'

export default function ProductMain() {
  return (
    <>
      <div className="product-main-images">
        <Image
          src="/images/hits-img1.jpg"
          alt="product"
          height={500}
          width={500}
        />
      </div>

      <div className="product-main-props">
        <h2>Ковер Grazia RG233-R87</h2>
        <div className="product-main-size">
          <h5>Выбрать размер:</h5>
          <select name="select" defaultValue="67x105">
            <option value="67x105">67 x 105 см</option>
            <option value="67x210">67 x 210 см</option>
            <option value="95x140">95 x 140 см</option>
          </select>
        </div>
        <h3>10 000 ₽</h3>
        <div className="product-main-buttons">
          <button className="product-buy">В корзину</button>
          <button className="product-favorite">
            <Image
              src="/icons/heart-regular.svg"
              alt="heart"
              height={15}
              width={15}
            />
          </button>
          <button className="product-compare">
            <Image
              src="/icons/chart-bar-regular.svg"
              alt="chart"
              height={15}
              width={15}
            />
          </button>
        </div>
      </div>
    </>
  )
}