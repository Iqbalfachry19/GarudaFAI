import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GarudaLogo } from "../components/GarudaLogo";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GarudaLogo className="w-10 h-10" />
            <span className="text-2xl font-bold">GarudaFAI</span>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to GarudaFAI</h1>
          <p className="text-xl mb-8">
            Empower your AI interactions with the wisdom of Garuda
          </p>
          <Button
            size="lg"
            className="bg-garuda-gold text-red-900 hover:bg-garuda-gold/90"
            onClick={() => navigate("/chat")}
          >
            Get Started
          </Button>
        </section>

        <section id="features" className="bg-red-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Advanced AI Integration"
                description="Seamlessly connect with various AI models and providers."
              />
              <FeatureCard
                title="Intuitive Interface"
                description="User-friendly dashboard for effortless AI interactions."
              />
              <FeatureCard
                title="Customizable Workflows"
                description="Create and manage your own AI-powered workflows."
              />
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">About GarudaFAI</h2>
            <p className="text-xl max-w-2xl mx-auto">
              GarudaFAI combines the mythical power of Garuda with cutting-edge
              AI technology, providing a platform that elevates your AI
              interactions to new heights.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-red-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 GarudaFAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
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
    <div className="bg-red-700 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Button({
  children,
  onClick,
  className = "",
  variant = "solid",
  size = "md",
}) {
  const baseStyles =
    "px-6 py-3 font-semibold rounded focus:outline-none transition duration-300";

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const variantStyles = {
    solid: "bg-yellow-700 text-white hover:bg-yellow-800",
    outline:
      "bg-transparent border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white",
    ghost: "bg-transparent text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
