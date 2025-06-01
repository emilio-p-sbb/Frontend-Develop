
import { create } from 'zustand';

interface AdminState {
  activeSection: string;
  setActiveSection: (section: string) => void;
  unreadMessages: number;
  setUnreadMessages: (count: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  activeSection: 'dashboard',
  setActiveSection: (section: string) => set({ activeSection: section }),
  unreadMessages: 3,
  setUnreadMessages: (count: number) => set({ unreadMessages: count }),
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));