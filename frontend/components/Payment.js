import React from 'react'

export default function Payment({ changeTab }) {
  return (
    <div>


      <div className="checkout-buttons">
        <button
          id="backwardbutton"
          onClick={() => changeTab(-1)}
        >
          &#10094; Назад
        </button>
        <button
          id="forwardbutton"
          style={{ opacity: 0 }}
        >
          Далее &#10095;
        </button>
      </div>
    </div>
  )
}