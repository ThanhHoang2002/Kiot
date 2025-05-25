import { ClockIcon, Factory, FileChartColumn, List, PackageOpenIcon, UserIcon } from "lucide-react"
import { useState, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import HeaderItem, { HeaderItemProps } from "./HeaderItem"
import UserProfile from "./UserProfile"


import { eyeIcon, boxIcon, customerIcon, sellIcon } from "@/assets/icon"
import { logoProject } from "@/assets/images"
import { paths } from "@/config/paths"
import { ROLES } from "@/constant/role"
import { ShiftDialogs } from "@/features/shift/components/ShiftDialogs"
import { useCurrentShift } from "@/features/shift/hooks/useCurrent"
import useAuthStore from "@/store/authStore"

const headerItems: HeaderItemProps[] = [
  {
    title: "Tổng quan",
    link: paths.home,
    icon: eyeIcon,
    adminOnly: true,
  },
  {
    title: "Hàng hóa",
    link: paths.products,
    icon: boxIcon,
  },
  {
    title: "Bán hàng",
    link: paths.transaction,
    icon: sellIcon,
  },
  {
    title: "Hóa đơn",
    link: paths.invoice,
    icon: <FileChartColumn className="mr-2 h-5 w-5" />,
  },
  {
    title: "Nhập hàng",
    link: paths.import,
    icon: <PackageOpenIcon className="mr-2 h-5 w-5" />,
  },
  {
    title: "Ca làm việc",
    link: paths.shift,
    icon: <ClockIcon className="mr-2 h-5 w-5" />,
  },
  {
    title: "Khách hàng",
    link: paths.customer,
    icon: customerIcon,
  },
  {
    title: "Danh mục",
    link: paths.category,
    icon: <List className="mr-2 h-5 w-5" />,
  },
  {
    title: "Nhà cung cấp",
    link: paths.supplier,
    icon: <Factory className="mr-2 h-5 w-5" />,
  },
  {
    title: "Người dùng",
    link: paths.users,
    icon: <UserIcon className="mr-2 h-5 w-5" />,
    adminOnly: true,
  },
]

const HomeHeader = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const navigate = useNavigate()
  const { hasOpenShift } = useCurrentShift()
  const { currentUser } = useAuthStore()
  
  // Dialog states
  const [openShiftDialog, setOpenShiftDialog] = useState(false)
  const [closeShiftDialog, setCloseShiftDialog] = useState(false)

  const handleShiftButtonClick = () => {
    if (hasOpenShift) {
      setCloseShiftDialog(true)
    } else {
      setOpenShiftDialog(true)
    }
  }

  // Filter header items based on user role
  const filteredHeaderItems = useMemo(() => {
    // Check if user is admin
    const isAdmin = currentUser?.role?.name?.toLowerCase() === ROLES.ADMIN.toLowerCase()
    // If admin, show all items; otherwise filter out admin-only items
    return isAdmin
      ? headerItems 
      : headerItems.filter(item => !item.adminOnly)
  }, [currentUser])

  return (
    <div className="flex w-full flex-col bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg">
      {/* Main header bar with logo and user profile */}
      <div className="flex h-14 w-full items-center justify-between px-4 text-white">
        <div className="flex items-center gap-2">
          <img
            src={logoProject}
            alt="logo"
            className="h-10 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleShiftButtonClick}
            className={`rounded-md px-4 py-1.5 font-medium shadow-sm transition-colors ${
              hasOpenShift 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {hasOpenShift ? "Đóng ca" : "Mở ca"}
          </button>
          <UserProfile />
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="scrollbar-none relative w-full overflow-x-auto bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="mx-auto flex h-12 min-w-max items-center justify-center space-x-1 text-white">
          {filteredHeaderItems.map((item, index) => (
            <HeaderItem key={index} {...item} isActive={item.link === currentPath} />
          ))}
        </div>
      </div>
      
      {/* Shift Dialogs */}
      <ShiftDialogs
        openDialog={openShiftDialog}
        closeDialog={closeShiftDialog}
        onOpenDialogChange={setOpenShiftDialog}
        onCloseDialogChange={setCloseShiftDialog}
      />
    </div>
  )
}

export default HomeHeader