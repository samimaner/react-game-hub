import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { X, Circle, RotateCcw } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type Player = "X" | "O" | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const saveScore = useMutation(api.games.saveScore);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (newBoard: Player[]) => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    if (newBoard.every(cell => cell !== null)) {
      return "draw";
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      const newScores = { ...scores };
      if (gameWinner === "draw") {
        newScores.draws++;
        toast.success("It's a draw!");
      } else {
        newScores[gameWinner]++;
        toast.success(`Player ${gameWinner} wins!`);
        saveScore({ game: "tictactoe", score: newScores[gameWinner], playerName: `Player ${gameWinner}` });
      }
      setScores(newScores);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  return (
    <GameLayout title="Tic-Tac-Toe" color="#FFE66D">
      <div className="max-w-2xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-black">
                Current Player: <span className="text-3xl">{currentPlayer}</span>
              </div>
              <Button
                onClick={resetGame}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                RESET
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {board.map((cell, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: cell ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick(index)}
                  className="aspect-square border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-5xl font-black disabled:cursor-not-allowed"
                  disabled={!!cell || !!winner}
                >
                  {cell === "X" && <X className="h-16 w-16" />}
                  {cell === "O" && <Circle className="h-16 w-16" />}
                </motion.button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 border-4 border-black bg-blue-300">
                <div className="font-black text-lg">Player X</div>
                <div className="text-3xl font-black">{scores.X}</div>
              </div>
              <div className="p-3 border-4 border-black bg-gray-300">
                <div className="font-black text-lg">Draws</div>
                <div className="text-3xl font-black">{scores.draws}</div>
              </div>
              <div className="p-3 border-4 border-black bg-red-300">
                <div className="font-black text-lg">Player O</div>
                <div className="text-3xl font-black">{scores.O}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
