"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GarudaLogo } from "../components/GarudaLogo";
import { AnimatedGaruda } from "../components/AnimatedGaruda";
import { cn } from "../lib/utils";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [garudaPosition, setGarudaPosition] = useState({ left: 0, right: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const windowWidth = window.innerWidth;
    const mouseX = e.clientX;
    const leftPosition = Math.max(-40, (mouseX / windowWidth) * 80 - 40);
    const rightPosition = Math.min(
      40,
      ((windowWidth - mouseX) / windowWidth) * 80 - 40
    );
    setGarudaPosition({ left: leftPosition, right: rightPosition });
  };
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 text-white relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GarudaLogo className="size-10" />
              <span className="text-2xl font-bold">GarudaFAI</span>
            </motion.div>
          </nav>
        </header>
      </motion.div>

      <main>
        <section className="container mx-auto px-4 py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6">Welcome to GarudaFAI</h1>
            <p className="text-xl mb-8">
              Empower your AI interactions with the wisdom of Garuda
            </p>
            <Button
              size="lg"
              className="bg-yellow-500 text-red-900 hover:bg-yellow-400"
              onClick={() => navigate("/chat")}
            >
              Get Started
            </Button>
          </motion.div>

          <motion.div
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
            animate={{ x: garudaPosition.left }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <AnimatedGaruda className="size-64 opacity-50" direction="left" />
          </motion.div>

          <motion.div
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            animate={{ x: garudaPosition.right }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <AnimatedGaruda className="size-64 opacity-50" direction="right" />
          </motion.div>
        </section>

        <motion.section
          id="features"
          className="bg-red-800 py-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Features of GarudaFAI
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Decentralized Finance (DeFi) Integration"
                description="GarudaFAI leverages the power of decentralized finance (DeFi) to provide secure, transparent, and efficient financial solutions built on the Sonic platform."
              />
              <FeatureCard
                title="Zerepy AI Agents Framework"
                description="Utilizing the Zerepy AI Agents Framework, GarudaFAI brings together cutting-edge artificial intelligence to automate and optimize financial operations across various sectors."
              />
              <FeatureCard
                title="Financial AI (FAI) Innovation"
                description="GarudaFAI combines the strength of Financial AI to provide intelligent solutions for predictive analytics, risk management, and automated financial decision-making."
              />
              <FeatureCard
                title="Agile and Scalable Architecture"
                description="Built for agility and scalability, GarudaFAI supports growing businesses and evolving financial landscapes, ensuring seamless performance and expansion."
              />
              <FeatureCard
                title="Security and Transparency"
                description="With blockchain integration, GarudaFAI ensures that all transactions and operations are secure, transparent, and verifiable, empowering trust in decentralized finance."
              />
              <FeatureCard
                title="Allora AI Integration"
                description="GarudaFAI incorporates Allora AI for adaptive learning, enabling real-time data analysis and continuous improvements in financial decision-making."
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          id="about"
          className="py-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">About GarudaFAI</h2>
            <p className="text-xl max-w-2xl mx-auto">
              GarudaFAI is an innovative project built on the Zerepy AI Agents
              Framework that leverages decentralized finance (DeFi) on the Sonic
              platform. The name "GarudaFAI" fuses the Indonesian national
              symbol "Garuda" with "FAI" (Financial AI), evoking strength,
              agility, and visionary technology while maintaining an
              international identity. It merges the mythical power of Garuda
              with cutting-edge AI, creating a platform that elevates AI-driven
              financial interactions to new heights.
            </p>
          </div>
        </motion.section>
      </main>

      <motion.footer
        className="bg-red-900 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 GarudaFAI. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-500 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-500 transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-700 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-red-700 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

function Button({
  children,
  onClick,
  className = "",
  variant = "solid",
  size = "md",
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 font-semibold rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition duration-300";

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const variantStyles = {
    solid: "bg-yellow-500 text-red-900 hover:bg-yellow-400",
    outline:
      "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
    ghost: "bg-transparent text-white hover:bg-red-700/20",
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
