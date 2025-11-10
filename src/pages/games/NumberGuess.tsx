import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { RotateCcw, Send, Trophy } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function NumberGuess() {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isWon, setIsWon] = useState(false);
  const [guessHistory, setGuessHistory] = useState<number[]>([]);
  const saveScore = useMutation(api.games.saveScore);

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      toast.error("Please enter a number between 1 and 100");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuessHistory([...guessHistory, guessNum]);

    if (guessNum === targetNumber) {
      setIsWon(true);
      setFeedback(`🎉 Correct! You won in ${newAttempts} attempts!`);
      saveScore({ game: "numberguess", score: 100 - newAttempts });
      toast.success(`You guessed it in ${newAttempts} attempts!`);
    } else if (guessNum < targetNumber) {
      setFeedback("📈 Too low! Try a higher number.");
    } else {
      setFeedback("📉 Too high! Try a lower number.");
    }

    setGuess("");
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setFeedback("");
    setIsWon(false);
    setGuessHistory([]);
  };

  return (
    <GameLayout title="Number Guessing Game" color="#C7CEEA">
      <div className="max-w-2xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black mb-2">Guess a number between 1 and 100</h2>
              <div className="text-xl font-bold">Attempts: {attempts}</div>
            </div>

            {isWon ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 p-6 border-4 border-black bg-yellow-300 text-center"
              >
                <Trophy className="h-16 w-16 mx-auto mb-4" />
                <div className="text-3xl font-black mb-2">YOU WON!</div>
                <div className="text-xl font-bold">{feedback}</div>
                <Button
                  onClick={resetGame}
                  className="mt-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  PLAY AGAIN
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="flex gap-2 mb-6">
                  <Input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                    placeholder="Enter your guess"
                    className="border-4 border-black text-xl font-bold text-center"
                    min="1"
                    max="100"
                  />
                  <Button
                    onClick={handleGuess}
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black px-8"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border-4 border-black bg-blue-200 text-center text-xl font-bold mb-6"
                  >
                    {feedback}
                  </motion.div>
                )}

                <div className="flex justify-between items-center">
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    NEW GAME
                  </Button>
                </div>
              </>
            )}

            {guessHistory.length > 0 && (
              <div className="mt-6 p-4 border-4 border-black bg-gray-100">
                <div className="font-black mb-2">Your Guesses:</div>
                <div className="flex flex-wrap gap-2">
                  {guessHistory.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 border-2 border-black bg-white font-bold"
                    >
                      {g}
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
