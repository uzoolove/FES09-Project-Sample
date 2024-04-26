import { create } from 'zustand';

const useModalStore = create((set) => ({
  isOpen: false,
  title: '',
  content: '',
  callbackButton: {},
  openModal: (state) => set({ ...state, isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useModalStore;