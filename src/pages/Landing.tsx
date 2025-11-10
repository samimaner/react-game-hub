import { motion } from "framer-motion";
import { Gamepad2, Grid3x3, Brain, Worm, Hash, Trophy, User } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const games = [
    {
      title: "Tic-Tac-Toe",
      description: "Classic strategy game for two players",
      icon: Grid3x3,
      path: "/games/tictactoe",
      color: "#FFE66D",
    },
    {
      title: "Memory Match",
      description: "Test your memory with emoji cards",
      icon: Brain,
      path: "/games/memory",
      color: "#A8E6CF",
    },
    {
      title: "Snake",
      description: "Guide the snake to eat and grow",
      icon: Worm,
      path: "/games/snake",
      color: "#FF6B9D",
    },
    {
      title: "Number Guess",
      description: "Guess the secret number in fewer tries",
      icon: Hash,
      path: "/games/numberguess",
      color: "#C7CEEA",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b-4 border-black bg-white"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="p-2 bg-yellow-300 border-4 border-black rounded-lg">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black">GAME HUB</h1>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/profile")}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                <User className="mr-2 h-4 w-4" />
                {user?.name || "PROFILE"}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                SIGN IN
              </Button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            PLAY & WIN
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-8">
            Four awesome games to test your skills!
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black text-xl"
          >
            <Trophy className="h-6 w-6" />
            COMPETE FOR HIGH SCORES
          </motion.div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {games.map((game, index) => (
            <GameCard key={game.path} {...game} index={index} />
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "FREE TO PLAY", desc: "All games completely free" },
              { title: "NO ADS", desc: "Pure gaming experience" },
              { title: "TRACK SCORES", desc: "Save your high scores" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
              >
                <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                <p className="font-bold">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t-4 border-black bg-white mt-16"
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-bold text-lg">
            Built with React, TypeScript & Convex | Portfolio Project
          </p>
          <p className="text-sm mt-2">
            Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-purple-600"
            >
              vly.ai
            </a>
          </p>
        </div>
      </motion.footer>
    </div>
  );
}