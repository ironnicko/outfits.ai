import {create} from 'zustand';

type NavigatorType = 'Main' | 'AiTools';

interface NavigationState {
  activeNavigator: NavigatorType;
  setActiveNavigator: (navigator: NavigatorType) => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  activeNavigator: 'Main',
  setActiveNavigator: (navigator) => set({ activeNavigator: navigator }),
}));

export default useNavigationStore;
