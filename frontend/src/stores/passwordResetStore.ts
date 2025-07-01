import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PasswordResetState {
  resetUserId: string | null;
  setResetUserId: (userId: string | null) => void;
  clearResetUserId: () => void;
}

export const usePasswordResetStore = create<PasswordResetState>()(
  persist(
    (set) => ({
      resetUserId: null,
      setResetUserId: (userId: string | null) => {
        set({ resetUserId: userId });
      },
      clearResetUserId: () => {
        set({ resetUserId: null });
      },
    }),
    {
      name: "password-reset-storage",
    },
  ),
);
