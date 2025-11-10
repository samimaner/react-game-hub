import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type Choice = "rock" | "paper" | "scissors" | null;
type Result = "win" | "lose" | "draw" | null;

const choices: Array<{ value: Choice; emoji: string; label: string }> = [
  { value: "rock", emoji: "🪨", label: "Rock" },
  { value: "paper", emoji: "📄", label: "Paper" },
  { value: "scissors", emoji: "✂️", label: "Scissors" },
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const saveScore = useMutation(api.games.saveScore);

  const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex].value;
  };

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return "draw";
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }
    return "lose";
  };

  const handleChoice = (choice: Choice) => {
    const computer = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computer);

    const gameResult = determineWinner(choice, computer);
    setResult(gameResult);

    const newScore = { ...score };
    if (gameResult === "win") {
      newScore.wins++;
      toast.success("You win!");
      saveScore({ game: "rockpaperscissors", score: newScore.wins });
    } else if (gameResult === "lose") {
      newScore.losses++;
      toast.error("You lose!");
    } else {
      newScore.draws++;
      toast("It's a draw!");
    }
    setScore(newScore);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetScore = () => {
    setScore({ wins: 0, losses: 0, draws: 0 });
    resetGame();
  };

  return (
    <GameLayout title="Rock Paper Scissors" color="#FFB6C1">
      <div className="max-w-3xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="p-4 border-4 border-black bg-green-300">
                <div className="text-lg font-black">WINS</div>
                <div className="text-4xl font-black">{score.wins}</div>
              </div>
              <div className="p-4 border-4 border-black bg-gray-300">
                <div className="text-lg font-black">DRAWS</div>
                <div className="text-4xl font-black">{score.draws}</div>
              </div>
              <div className="p-4 border-4 border-black bg-red-300">
                <div className="text-lg font-black">LOSSES</div>
                <div className="text-4xl font-black">{score.losses}</div>
              </div>
            </div>

            {result && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`mb-6 p-6 border-4 border-black text-center ${
                  result === "win"
                    ? "bg-green-300"
                    : result === "lose"
                    ? "bg-red-300"
                    : "bg-yellow-300"
                }`}
              >
                <div className="text-6xl mb-4">
                  {choices.find((c) => c.value === playerChoice)?.emoji} vs{" "}
                  {choices.find((c) => c.value === computerChoice)?.emoji}
                </div>
                <div className="text-3xl font-black mb-2">
                  {result === "win" ? "YOU WIN!" : result === "lose" ? "YOU LOSE!" : "DRAW!"}
                </div>
                <Button
                  onClick={resetGame}
                  className="mt-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
                >
                  PLAY AGAIN
                </Button>
              </motion.div>
            )}

            {!result && (
              <div className="mb-6">
                <h2 className="text-2xl font-black text-center mb-4">Choose your weapon!</h2>
                <div className="grid grid-cols-3 gap-4">
                  {choices.map((choice) => (
                    <motion.button
                      key={choice.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChoice(choice.value)}
                      className="aspect-square border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center"
                    >
                      <div className="text-6xl mb-2">{choice.emoji}</div>
                      <div className="text-xl font-black">{choice.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={resetScore}
                variant="outline"
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                RESET SCORE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
