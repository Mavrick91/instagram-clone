"use client";

import { useLayoutEffect, useState } from "react";

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useLayoutEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}

export default useWindowWidth;
