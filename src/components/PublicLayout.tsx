import { Outlet } from 'react-router-dom'
import Header from './Header'
import MobileFooterNav from './MobileFooterNav'
import SiteFooter from './SiteFooter'

/** Shared shell for all public-facing pages: header + content + NAP footer + mobile nav. */
export default function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <SiteFooter />
      <MobileFooterNav />
    </>
  )
}
