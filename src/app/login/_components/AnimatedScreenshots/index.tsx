"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import ImageClient from "@/components/ImageClient";

const screenshots = [
  "/screenshot1.png",
  "/screenshot2.png",
  "/screenshot3.png",
  "/screenshot4.png",
];

const AnimatedScreenshots = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[540px] w-[248px]">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <ImageClient
            fill
            priority
            alt={`screenshot ${currentIndex + 1}`}
            src={screenshots[currentIndex]}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedScreenshots;
