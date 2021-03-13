export function convertPrice(price) {
  if (price === undefined) {
    return 0
  }
  if (typeof price !== 'string') {
    price = price.toFixed(2).toString()
  }

  const priceSplitted = price.split('.')
  let priceFirstPart = priceSplitted[0]
  const priceSecondPart = priceSplitted[1] ? priceSplitted[1] : ""

  priceFirstPart = (priceFirstPart.length > 3)
    ? (priceFirstPart.slice(0, -3).concat(' ', priceFirstPart.slice(-3)))
    : priceFirstPart

  return priceSecondPart
    ? priceFirstPart.concat('.', priceSecondPart)
    : priceFirstPart
}

export function convertSize(size) {
  return size.replace(/\*/g, ' x ')
}

export function getValidImageSrc(images) {
  const imageSrc = images.length > 0 ? images[0].image : null
  return imageSrc ?? '/images/no_image.jpg'
}