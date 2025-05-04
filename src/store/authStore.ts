import { create } from "zustand";

import { User } from "@/types/auth.type";

// Helper function để đọc dữ liệu từ localStorage
const getUserFromLocalStorage = (): User | undefined => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return undefined;
    }
  }
  return undefined;
};

interface StoreState {
  currentUser?: User;
  setCurrentUser: (data: User) => void;
  clearCurrentUser: () => void;
}

const useAuthStore = create<StoreState>((set) => ({
  // Khởi tạo currentUser từ localStorage (nếu có)
  currentUser: getUserFromLocalStorage(),
  
  setCurrentUser: (currentUser) => {
    // Lưu currentUser vào localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    set(() => ({ currentUser }));
  },
  
  clearCurrentUser: () => {
    // Xóa currentUser khỏi localStorage
    localStorage.removeItem('currentUser');
    set(() => ({ currentUser: undefined }));
  }
}));

export default useAuthStore;
