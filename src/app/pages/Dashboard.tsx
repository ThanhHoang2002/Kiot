import { MerchandiseSection } from "@/features/dashboard/components/merchandise/MerchandiseSection"
import { RevenueSection } from "@/features/dashboard/components/revenue/RevenueSection"
import { TodayStatistics } from "@/features/dashboard/components/today/TodayStatistics"

const Dashboard = () => {
  return (
    <div className="flex w-full flex-col gap-1">
      <TodayStatistics/>
      <RevenueSection/>
      <MerchandiseSection/>
    </div>
  )
}

export default Dashboard