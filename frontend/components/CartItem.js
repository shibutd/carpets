import Image from 'next/image'

export default function CartItem(
  {
    item,
    changeItemQuantity,
    removeFromCart
  }
) {
  const totalItemPrice = item.price * item.quantity
  const priceToString = totalItemPrice.toString()

  return (
    <div className="cart-products-item">
      <div className="cart-products-item-img">
        <Image
          src={`/images/${item.imageSrc}`}
          alt=""
          height={120}
          width={120}
        />
      </div>
      <div className="cart-products-item-name">
        {item.title}
      </div>
      <div className="cart-products-item-plusminus">
        <Image
          src="/icons/minus-solid.svg"
          alt="minus"
          layout="fixed"
          height={14}
          width={14}
          onClick={() => changeItemQuantity(item.id, -1)}
        />
        <div className="cart-products-item-plusminus-val">
          {item.quantity}
        </div>
        <Image
          src="/icons/plus-solid.svg"
          alt="plus"
          layout="fixed"
          height={14}
          width={14}
          onClick={() => changeItemQuantity(item.id, 1)}
        />
      </div>
      <div className="cart-products-item-price">
        {(priceToString.length > 3)
          ? (priceToString.slice(0, -3).concat(' ', priceToString.slice(-3)))
          : (priceToString)
        } ₽
      </div>
      <div className="cart-products-item-likedelete">
        <Image
          src="/icons/heart-regular.svg"
          alt=""
          height={14}
          width={14}
        />
        <Image
          src="/icons/trash-solid.svg"
          alt=""
          height={14}
          width={14}
          onClick={() => removeFromCart(item.id)}
        />
      </div>
    </div>
  )
}