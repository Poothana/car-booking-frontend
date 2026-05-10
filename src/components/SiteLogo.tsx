import mathiCabsLogo from '../assets/images/mathi-cabs-logo.png'
import './SiteLogo.css'

type Props = {
  alt?: string
  className?: string
}

export default function SiteLogo({ alt = 'Mathi Cabs', className = '' }: Props) {
  return <img src={mathiCabsLogo} alt={alt} className={`site-logo-img ${className}`.trim()} decoding="async" />
}
