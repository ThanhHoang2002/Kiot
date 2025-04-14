import { useLocation, useNavigate } from "react-router-dom"

import HeaderItem, { HeaderItemProps } from "./HeaderItem"
import UserProfile from "./UserProfile"

import { eyeIcon,boxIcon,customerIcon,employeeIcon,sellIcon } from "@/assets/icon"
import {paths} from "@/config/paths"
const headerItems : HeaderItemProps[]= [
  {
    title: "Tổng quan",
    link: paths.home,
    icon: eyeIcon ,
  },
  {
    title: "Hàng hóa",
    link: paths.products,
    icon: boxIcon,
  }
  ,
  {
    title: "Bán hàng",
    link: paths.transaction,
    icon: sellIcon,
  },
  {
    title: "Khách hàng",
    link: paths.customer,
    icon: customerIcon,
  },
  {
    title: "Nhân viên",
    link: paths.employee,
    icon: employeeIcon,
  }
]

const HomeHeader = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const navigate = useNavigate()
  return (
    <div className="hidden h-full w-full items-center justify-between text-white xl:flex">
      <img src='https://logo.kiotviet.vn/KiotViet-Logo-Horizontal-White-Text.svg' alt="logo" className="ml-1 h-11 cursor-pointer" onClick={()=>navigate('/')}/>
      <div className="flex h-full items-center justify-center">
        {
          headerItems.map((item, index) => (
            <HeaderItem key={index} {...item} isActive={item.link===currentPath}/>
          ))
        }
      </div>
     <UserProfile/>
    </div>
  )
}

export default HomeHeader