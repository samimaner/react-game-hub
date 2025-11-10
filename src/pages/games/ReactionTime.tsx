import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { RotateCcw, Trophy, Zap } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type GameState = "waiting" | "ready" | "click" | "result" | "tooEarly";

export default function ReactionTime() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveScore = useMutation(api.games.saveScore);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameState("ready");
    setReactionTime(null);

    const delay = Math.random() * 3000 + 2000;
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState("click");
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "ready") {
      setGameState("tooEarly");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      toast.error("Too early! Wait for green.");
      return;
    }

    if (gameState === "click") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState("result");

      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);

      if (!bestTime || time < bestTime) {
        setBestTime(time);
        saveScore({ game: "reactiontime", score: Math.round(1000 - time) });
        toast.success(`New best time: ${time}ms!`);
      }
    }
  };

  const resetGame = () => {
    setGameState("waiting");
    setReactionTime(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetAll = () => {
    resetGame();
    setAttempts([]);
    setBestTime(null);
  };

  const averageTime =
    attempts.length > 0
      ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
      : null;

  return (
    <GameLayout title="Reaction Time Test" color="#E0BBE4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="p-4 border-4 border-black bg-yellow-300">
                <div className="text-lg font-black">ATTEMPTS</div>
                <div className="text-4xl font-black">{attempts.length}</div>
              </div>
              <div className="p-4 border-4 border-black bg-green-300">
                <div className="text-lg font-black">BEST</div>
                <div className="text-4xl font-black">
                  {bestTime ? `${bestTime}ms` : "-"}
                </div>
              </div>
              <div className="p-4 border-4 border-black bg-blue-300">
                <div className="text-lg font-black">AVERAGE</div>
                <div className="text-4xl font-black">
                  {averageTime ? `${averageTime}ms` : "-"}
                </div>
              </div>
            </div>

            <motion.div
              className={`mb-6 p-12 border-4 border-black cursor-pointer flex flex-col items-center justify-center min-h-[300px] ${
                gameState === "waiting"
                  ? "bg-blue-300"
                  : gameState === "ready"
                  ? "bg-red-300"
                  : gameState === "click"
                  ? "bg-green-300"
                  : gameState === "tooEarly"
                  ? "bg-orange-300"
                  : "bg-yellow-300"
              }`}
              onClick={
                gameState === "waiting"
                  ? startGame
                  : gameState === "tooEarly"
                  ? resetGame
                  : gameState === "result"
                  ? resetGame
                  : handleClick
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {gameState === "waiting" && (
                <>
                  <Zap className="h-16 w-16 mb-4" />
                  <div className="text-3xl font-black text-center">
                    CLICK TO START
                  </div>
                  <div className="text-lg font-bold mt-2 text-center">
                    Test your reaction time!
                  </div>
                </>
              )}

              {gameState === "ready" && (
                <>
                  <div className="text-3xl font-black text-center">WAIT...</div>
                  <div className="text-lg font-bold mt-2 text-center">
                    Wait for green
                  </div>
                </>
              )}

              {gameState === "click" && (
                <>
                  <div className="text-4xl font-black text-center">CLICK NOW!</div>
                </>
              )}

              {gameState === "tooEarly" && (
                <>
                  <div className="text-3xl font-black text-center mb-2">
                    TOO EARLY!
                  </div>
                  <div className="text-lg font-bold text-center">
                    Click to try again
                  </div>
                </>
              )}

              {gameState === "result" && reactionTime && (
                <>
                  <Trophy className="h-16 w-16 mb-4" />
                  <div className="text-5xl font-black mb-2">{reactionTime}ms</div>
                  <div className="text-xl font-bold">
                    {reactionTime < 200
                      ? "INCREDIBLE!"
                      : reactionTime < 300
                      ? "EXCELLENT!"
                      : reactionTime < 400
                      ? "GOOD!"
                      : "KEEP TRYING!"}
                  </div>
                  <div className="text-sm font-bold mt-4">Click to try again</div>
                </>
              )}
            </motion.div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={resetAll}
                variant="outline"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                RESET ALL
              </Button>
            </div>

            {attempts.length > 0 && (
              <div className="mt-6 p-4 border-4 border-black bg-gray-100">
                <div className="font-black mb-2">Recent Attempts:</div>
                <div className="flex flex-wrap gap-2">
                  {attempts.slice(-10).reverse().map((time, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 border-2 border-black bg-white font-bold"
                    >
                      {time}ms
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
