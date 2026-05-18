import { create } from 'zustand';

export type DrawerContentType = 'spell' | 'monster' | 'condition' | 'power' | 'divinity' | 'item' | 'none';

interface UIState {
    // Drawer State
    isDrawerOpen: boolean;
    drawerContentType: DrawerContentType;
    drawerContentData: any; // Can be a Spell, Monster, etc.

    // Actions
    openDrawer: (type: DrawerContentType, data: any) => void;
    closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isDrawerOpen: false,
    drawerContentType: 'none',
    drawerContentData: null,

    openDrawer: (type, data) => set({ isDrawerOpen: true, drawerContentType: type, drawerContentData: data }),
    closeDrawer: () => set({ isDrawerOpen: false }),
}));
