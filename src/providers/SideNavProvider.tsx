"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import useWindowWidth from "@/hooks/useWindowWidth";

type SideNavContextType = {
  sideNavOpen: boolean;
  toggleSideNav: () => void;
  toggleSearch: () => void;
  isSearchVisible: boolean;
  isNotificationVisible: boolean;
  toggleNotification: () => void;
  isNewPostVisible: boolean;
  toggleNewPost: () => void;
  displaySmallNav: boolean;
  isConversationPage: boolean;
};

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

type SideNavProviderProps = {
  children: React.ReactNode;
};

const SideNavProvider: React.FC<SideNavProviderProps> = ({ children }) => {
  const windowWidth = useWindowWidth();
  const [sideNavOpen, setSideNavOpen] = useState(windowWidth < 1264);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isNewPostVisible, setIsNewPostVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (windowWidth > 1264) {
      setSideNavOpen(true);
    } else setSideNavOpen(false);
  }, [windowWidth]);

  const toggleSideNav = useCallback(() => {
    setSideNavOpen((prevSideNavOpen) => !prevSideNavOpen);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchVisible((prevIsSearchVisible) => !prevIsSearchVisible);
  }, []);

  const toggleNotification = useCallback(() => {
    setIsNotificationVisible(
      (prevIsNotificationVisible) => !prevIsNotificationVisible,
    );
  }, []);

  const toggleNewPost = useCallback(() => {
    setIsNewPostVisible((prevIsNewPostVisible) => !prevIsNewPostVisible);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  const isConversationPage = pathname.startsWith("/direct");

  const displaySmallNav =
    !sideNavOpen ||
    isSearchVisible ||
    isNotificationVisible ||
    isConversationPage;

  const value = {
    sideNavOpen,
    toggleSideNav,
    toggleSearch,
    isSearchVisible,
    isNotificationVisible,
    toggleNotification,
    isNewPostVisible,
    toggleNewPost,
    displaySmallNav,
    isConversationPage,
  };

  return (
    <SideNavContext.Provider value={value}>{children}</SideNavContext.Provider>
  );
};

export const useSideNav = (): SideNavContextType => {
  const context = useContext(SideNavContext);
  if (!context) {
    throw new Error("useSideNav must be used within a SideNavProvider");
  }
  return context;
};

export default SideNavProvider;
