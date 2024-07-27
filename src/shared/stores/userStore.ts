import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "@/shared/types/IUser";

export const userStore = create<IUser>()(
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
