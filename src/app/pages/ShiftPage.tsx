import { Users, BarChart, Clock } from "lucide-react"
import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShiftDetail } from "@/features/shift/components/ShiftDetail"
import { ShiftList } from "@/features/shift/components/ShiftList"
import { useShiftDetail } from "@/features/shift/hooks/useShiftDetail"
import { useShifts } from "@/features/shift/hooks/useShifts"

const ShiftPage = () => {
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null)
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop")
  
  const { 
    shifts, 
    totalItems,
    isLoading: isLoadingShifts, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useShifts()
  
  const { 
    shiftDetail, 
    isLoading: isLoadingDetail 
  } = useShiftDetail(selectedShiftId)

  useEffect(() => {
    if (shifts.length > 0 && selectedShiftId === null) {
      setSelectedShiftId(shifts[0].id)
    }
  }, [shifts, selectedShiftId])

  useEffect(() => {
    const handleResize = () => {
      setActiveView(window.innerWidth >= 768 ? "desktop" : "mobile")
    }

    // Set initial view
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSelectShift = (shiftId: number) => {
    setSelectedShiftId(shiftId)
  }

  // Mobile view using Tabs
  const renderMobileView = () => (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list" className="flex items-center gap-2">
          <Users size={16} />
          <span>Danh sách</span>
        </TabsTrigger>
        <TabsTrigger value="detail" className="flex items-center gap-2">
          <BarChart size={16} />
          <span>Chi tiết</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="list" className="mt-4">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ShiftList
                shifts={shifts}
                isLoading={isLoadingShifts}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                selectedShiftId={selectedShiftId}
                onSelectShift={handleSelectShift}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="detail" className="mt-4">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ShiftDetail
                shiftDetail={shiftDetail}
                isLoading={isLoadingDetail}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )

  // Desktop view with split layout
  const renderDesktopView = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <ShiftList
                shifts={shifts}
                isLoading={isLoadingShifts}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                selectedShiftId={selectedShiftId}
                onSelectShift={handleSelectShift}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <Card className="h-full">
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <ShiftDetail
                shiftDetail={shiftDetail}
                isLoading={isLoadingDetail}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 md:px-6 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Quản lý ca bán hàng</h1>
          </div>
          <p className="text-muted-foreground">
            Tổng cộng {totalItems || 0} ca làm việc
          </p>
        </div>
      </div>

      {/* Content - Responsive based on screen size */}
      {activeView === "mobile" ? renderMobileView() : renderDesktopView()}
    </div>
  )
}

export default ShiftPage