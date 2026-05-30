import { Outlet } from 'react-router-dom'
import Header from './Header'
import MobileFooterNav from './MobileFooterNav'

/** Shared shell for all public-facing pages: one header + bottom nav. */
export default function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <MobileFooterNav />
    </>
  )
}
