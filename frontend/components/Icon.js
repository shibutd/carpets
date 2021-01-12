import Image from 'next/image'

export default function Icon({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      layout="fixed"
      width={18}
      height={18}
    />
  )
}