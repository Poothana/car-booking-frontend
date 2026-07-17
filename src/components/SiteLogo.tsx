import './SiteLogo.css'

type Props = {
  alt?: string
  className?: string
}

export default function SiteLogo({ alt = 'Mathi Cabs', className = '' }: Props) {
  return (
    <img
      src="/mathi-cabs-logo.webp"
      alt={alt}
      className={`site-logo-img ${className}`.trim()}
      width={320}
      height={132}
      decoding="async"
    />
  )
}
