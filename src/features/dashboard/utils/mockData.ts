import { RevenueResponse, RevenueTimeframe } from '../types/revenue';
import { TodayStatistics, TrendType } from '../types/statistics';
import { MerchandiseResponse, MerchandiseTimeframe, MerchandiseMetric } from '../types/merchandise';

// Revenue mock data
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Mock data cho daily revenue
const generateDailyData = (month: string): RevenueResponse => {
  const [year, monthStr] = month.split('-');
  const daysInMonth = new Date(+year, +monthStr, 0).getDate();
  
  return {
    type: 'daily',
    data: Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${month}-${String(i + 1).padStart(2, '0')}`,
      value: randomNumber(3000000, 15000000) // 3tr - 15tr VND
    }))
  };
};

// Mock data cho hourly revenue
const generateHourlyData = (): RevenueResponse => {
  return {
    type: 'hourly',
    data: Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}`,
      value: randomNumber(500000, 5000000) // 500k - 5tr VND
    }))
  };
};

// Mock data cho weekday revenue
const generateWeekdayData = (): RevenueResponse => {
  const weekdays = [
    'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 
    'Thứ 6', 'Thứ 7', 'Chủ nhật'
  ];
  
  return {
    type: 'weekday',
    data: weekdays.map(day => ({
      weekday: day,
      value: randomNumber(20000000, 45000000) // 20tr - 45tr VND
    }))
  };
};

// Mock API response cho revenue
export const mockRevenueDetails = (
  month: string,
  type: RevenueTimeframe
): Promise<RevenueResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (type) {
        case 'daily':
          resolve(generateDailyData(month));
          break;
        case 'hourly':
          resolve(generateHourlyData());
          break;
        case 'weekday':
          resolve(generateWeekdayData());
          break;
      }
    }, 500); // 500ms delay
  });
};

// Mock data cho statistics
const generateRandomTrend = (): TrendType => {
  const random = Math.random();
  if (random < 0.4) return 'up';
  if (random < 0.8) return 'down';
  return 'stable';
};

export const mockTodayStatistics = (): Promise<TodayStatistics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const value = randomNumber(500000, 2000000); // 500k - 2tr VND
      const yesterdayTrend = generateRandomTrend();
      const lastMonthTrend = generateRandomTrend();

      resolve({
        value,
        count: randomNumber(0, 10), // 0-10 đơn hàng
        compareYesterday: {
          percentage: yesterdayTrend === 'up' ? 
            randomNumber(1, 100) : 
            -randomNumber(1, 100),
          trend: yesterdayTrend
        },
        compareLastMonth: {
          percentage: lastMonthTrend === 'up' ? 
            randomNumber(1, 100) : 
            -randomNumber(1, 100),
          trend: lastMonthTrend
        }
      });
    }, 500); // 500ms delay
  });
};

// Mock data cho merchandise
const generateMerchandiseItems = (metric: MerchandiseMetric) => {
  const items = [
    { id: '1', name: 'Son dưỡng Sheer gam' },
    { id: '2', name: 'Sữa tắm Palmolive xanh lá' },
    { id: '3', name: 'Dầu gội Clear bạc hà' },
    { id: '4', name: 'Kem đánh răng P/S' },
    { id: '5', name: 'Nước rửa chén Sunlight' },
    { id: '6', name: 'Dầu ăn Neptune' },
    { id: '7', name: 'Mì gói Hảo Hảo' },
    { id: '8', name: 'Nước mắm Nam Ngư' },
    { id: '9', name: 'Sữa Vinamilk' },
    { id: '10', name: 'Bánh Oreo' },
  ];

  return items.map(item => ({
    ...item,
    value: metric === 'revenue' 
      ? Math.floor(Math.random() * 30000000) // 0-30tr VND
      : Math.floor(Math.random() * 100) // 0-100 sản phẩm
  })).sort((a, b) => b.value - a.value); // Sắp xếp giảm dần theo value
};

export const mockMerchandiseData = (
  timeframe: MerchandiseTimeframe,
  metric: MerchandiseMetric
): Promise<MerchandiseResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: generateMerchandiseItems(metric),
        timeframe,
        metric
      });
    }, 500); // 500ms delay
  });
};