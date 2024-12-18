import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define a more specific User type
export interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  // Add other user properties as needed
}

export interface UserStoreState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  getUser: () => User | null;
}

export const userStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null });
      },
      getUser: () => get().user,
    }),
    {
      name: "auth-storage",
    }
  )
);