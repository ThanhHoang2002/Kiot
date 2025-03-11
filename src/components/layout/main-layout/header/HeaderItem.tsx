
import { useNavigate } from "react-router-dom";

import { cn } from "@/utils/cn";

export interface HeaderItemProps {
    title?: string;
    link?: string;
    icon?: string;
    isActive?: boolean;
}
const HeaderItem = (props : HeaderItemProps) => {
    const {title, icon, link, isActive} = props;
    const navigate = useNavigate();
    const handleNavigate = () => {
        if(link) navigate(link);
    }
  return (
    <div className={cn(
        isActive ? "bg-black/25" : "bg-transparent",
        "flex h-full w-[135px] cursor-pointer items-center",
        "transition-all duration-300",
        "justify-center rounded-custom hover:bg-black/25"
    )}
        onClick={handleNavigate}
    >  
        <img src={icon} alt="" className="mr-3 h-4" />
        <p className="text-white">{title}</p>
    </div>
  )
}

export default HeaderItem