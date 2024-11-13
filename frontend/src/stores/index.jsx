import {create} from "zustand";
// const isMobile = /Mobile|Android|webOS|iPhone|iPad|Phone/i.test(
//   navigator.userAgent
// );

// const isMobile = document.body.clientWidth < 992
const isMobile = false;

export const useAppStore = create((set) => ({
    device: isMobile ? "mobile" : "pc",
    isLogin: false,
    toggleDevice: () => set((state) => ({device: document.body.clientWidth < 992 ? 'mobile' : 'pc'})),
    toggleLoginState: () => set((state) => ({isLogin: state.isLogin})),
}));
