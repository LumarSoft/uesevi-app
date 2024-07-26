import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAuthState } from "../types/IAuthState";

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => {
        set({ token: null, user: null });
        console.log(
          "Token y usuario después de logout:",
          get().token,
          get().user
        );
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
