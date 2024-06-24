"use client";

import { useLayoutEffect, useState } from "react";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useLayoutEffect(() => {
    const handleResize = () => {
      return setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => {
      return window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth;
};

export default useWindowWidth;
