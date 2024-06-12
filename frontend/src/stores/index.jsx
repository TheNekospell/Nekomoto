import { create } from "zustand";
const isMobile = /Mobile|Android|webOS|iPhone|iPad|Phone/i.test(
  navigator.userAgent
);

export const useAppStore = create((set) => ({
  device: isMobile ? "mobile" : "pc",
  isLogin: false,
  toggleDevice: () => set((state) => ({ device: state.device })),
  toggleLoginState: () => set((state) => ({ isLogin: state.isLogin })),
}));
