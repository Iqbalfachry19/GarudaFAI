import React from "react";
import { motion } from "framer-motion";

interface AnimatedGarudaProps {
  className?: string;
  direction: "left" | "right";
}

export const AnimatedGaruda: React.FC<AnimatedGarudaProps> = ({
  className,
  direction,
}) => {
  const bodyVariants = {
    hover: { y: [0, -10, 0], transition: { duration: 2, repeat: Infinity } },
  };

  const wingVariants = {
    flap: {
      rotateX: [0, 30, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const eyeVariants = {
    blink: {
      scaleY: [1, 0.1, 1],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 },
    },
  };

  const tailVariants = {
    wag: {
      rotateZ: [0, 5, -5, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      whileHover="hover"
    >
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF4500" />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF4500" />
        </linearGradient>
      </defs>

      {/* Body */}
      <motion.path
        d="M50 20 L80 50 L65 85 H35 L20 50 Z"
        fill="url(#bodyGradient)"
        stroke="#8B4513"
        strokeWidth="2"
        variants={bodyVariants}
      />

      {/* Wings */}
      <motion.g variants={wingVariants} animate="flap">
        <path
          d="M20 50 Q35 40 50 50"
          fill="none"
          stroke="url(#wingGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M50 50 Q65 40 80 50"
          fill="none"
          stroke="url(#wingGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Head */}
      <circle cx="50" cy="35" r="12" fill="#8B4513" />

      {/* Beak */}
      <path
        d="M45 38 L50 45 L55 38"
        fill="none"
        stroke="#FFD700"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Eyes */}
      <motion.circle
        cx="45"
        cy="32"
        r="3"
        fill="#FFF"
        variants={eyeVariants}
        animate="blink"
      />
      <motion.circle
        cx="55"
        cy="32"
        r="3"
        fill="#FFF"
        variants={eyeVariants}
        animate="blink"
      />

      {/* Crown */}
      <path
        d="M38 26 L50 15 L62 26"
        fill="none"
        stroke="#FFD700"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tail */}
      <motion.path
        d="M35 85 L50 95 L65 85"
        fill="none"
        stroke="#8B4513"
        strokeWidth="3"
        strokeLinecap="round"
        variants={tailVariants}
        animate="wag"
      />

      {/* AI Circuit Lines */}
      <path
        d="M25 60 L35 70 M75 60 L65 70"
        stroke="#00CED1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="35" cy="70" r="2" fill="#00CED1" />
      <circle cx="65" cy="70" r="2" fill="#00CED1" />
    </motion.svg>
  );
};
