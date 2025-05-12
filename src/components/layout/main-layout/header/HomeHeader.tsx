import { Factory, FileChartColumn, List, UserIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import HeaderItem, { HeaderItemProps } from "./HeaderItem"
import UserProfile from "./UserProfile"

import { eyeIcon,boxIcon,customerIcon,sellIcon } from "@/assets/icon"
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
    title: "Hóa đơn",
    link: paths.invoice,
    icon: <FileChartColumn className="mr-2 h-5 w-5"/>,
  },
  {
    title: "Khách hàng",
    link: paths.customer,
    icon: customerIcon,
  },
 {
    title: "Danh mục",
    link: paths.category,
    icon: <List className="mr-2 h-5 w-5"/>,
  },
  {
    title: "Nhà cung cấp",
    link: paths.supplier,
    icon: <Factory className="mr-2 h-5 w-5"/>,
  },
    {
    title: "Người dùng",
    link: paths.users,
    icon: <UserIcon className="mr-2 h-5 w-5"/>,
  },
  
]

const HomeHeader = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const navigate = useNavigate()
  return (
    <div className="flex h-full w-full items-center justify-between text-white">
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