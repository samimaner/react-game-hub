import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { LogOut, Home, Trophy, Gamepad2 } from "lucide-react";
import { useEffect } from "react";

export default function Profile() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const userStats = useQuery(api.games.getUserStats);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
        <div className="text-2xl font-black">Loading...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const gameNames: Record<string, string> = {
    tictactoe: "Tic-Tac-Toe",
    memory: "Memory Match",
    snake: "Snake",
    numberguess: "Number Guess",
  };

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
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
            >
              <Home className="mr-2 h-4 w-4" />
              HOME
            </Button>
            <Button
              onClick={handleSignOut}
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
            >
              <LogOut className="mr-2 h-4 w-4" />
              SIGN OUT
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-8">
            <CardHeader className="border-b-4 border-black bg-yellow-300">
              <CardTitle className="text-3xl font-black flex items-center gap-3">
                <Trophy className="h-8 w-8" />
                PLAYER PROFILE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-xl font-bold text-gray-600">Player Name</div>
                <div className="text-3xl font-black">{user?.name || "Anonymous Player"}</div>
              </div>
              {user?.email && (
                <div>
                  <div className="text-xl font-bold text-gray-600">Email</div>
                  <div className="text-2xl font-black">{user.email}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            <CardHeader className="border-b-4 border-black bg-blue-300">
              <CardTitle className="text-3xl font-black">GAME STATISTICS</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {userStats && Object.keys(userStats).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(userStats).map(([game, stats]) => (
                    <motion.div
                      key={game}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 border-4 border-black bg-gradient-to-br from-green-200 to-blue-200"
                    >
                      <h3 className="text-xl font-black mb-3">{gameNames[game] || game}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-bold">Games Played:</span>
                          <span className="font-black text-xl">{stats.plays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Best Score:</span>
                          <span className="font-black text-xl">{stats.bestScore}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xl font-bold text-gray-600 mb-4">
                    No games played yet!
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
                  >
                    START PLAYING
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
