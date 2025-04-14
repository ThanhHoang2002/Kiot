import { create } from "zustand";

import { User } from "@/types/auth.type";


interface StoreState {
  currentUser?: User;
  setCurrentUser: (data: User) => void;
}

const useAuthStore = create<StoreState>((set) => ({
  setCurrentUser: (currentUser) => set(() => ({ currentUser })),
}));

export default useAuthStore;
