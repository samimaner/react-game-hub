import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type Grid = number[][];

const GRID_SIZE = 4;

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const saveScore = useMutation(api.games.saveScore);

  const initializeGrid = useCallback(() => {
    const newGrid: Grid = Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  }, []);

  const addRandomTile = (grid: Grid) => {
    const emptyCells: Array<[number, number]> = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    resetGame();
  }, [initializeGrid]);

  const canMove = (grid: Grid): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return true;
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
      }
    }
    return false;
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;

    let newGrid = grid.map((row) => [...row]);
    let moved = false;
    let newScore = score;

    const moveLeft = (grid: Grid) => {
      for (let i = 0; i < GRID_SIZE; i++) {
        const row = grid[i].filter((val) => val !== 0);
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            newScore += row[j];
            row.splice(j + 1, 1);
            moved = true;
          }
        }
        while (row.length < GRID_SIZE) row.push(0);
        if (JSON.stringify(grid[i]) !== JSON.stringify(row)) moved = true;
        grid[i] = row;
      }
    };

    const rotateGrid = (grid: Grid): Grid => {
      return grid[0].map((_, i) => grid.map((row) => row[i]).reverse());
    };

    if (direction === "left") {
      moveLeft(newGrid);
    } else if (direction === "right") {
      newGrid = newGrid.map((row) => row.reverse());
      moveLeft(newGrid);
      newGrid = newGrid.map((row) => row.reverse());
    } else if (direction === "up") {
      newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)));
      moveLeft(newGrid);
      newGrid = rotateGrid(newGrid);
    } else if (direction === "down") {
      newGrid = rotateGrid(newGrid);
      moveLeft(newGrid);
      newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)));
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        saveScore({ game: "2048", score: newScore });
      }

      if (!canMove(newGrid)) {
        setGameOver(true);
        toast.error(`Game Over! Final Score: ${newScore}`);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace("Arrow", "").toLowerCase() as
          | "up"
          | "down"
          | "left"
          | "right";
        move(direction);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [grid, gameOver, score]);

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: "#CDC1B4",
      2: "#EEE4DA",
      4: "#EDE0C8",
      8: "#F2B179",
      16: "#F59563",
      32: "#F67C5F",
      64: "#F65E3B",
      128: "#EDCF72",
      256: "#EDCC61",
      512: "#EDC850",
      1024: "#EDC53F",
      2048: "#EDC22E",
    };
    return colors[value] || "#3C3A32";
  };

  return (
    <GameLayout title="2048 Game" color="#FAF8EF">
      <div className="max-w-2xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="text-xl font-black">
                  Score: <span className="text-3xl">{score}</span>
                </div>
                <div className="text-lg font-bold">Best: {bestScore}</div>
              </div>
              <Button
                onClick={resetGame}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                NEW GAME
              </Button>
            </div>

            {gameOver && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 p-6 border-4 border-black bg-red-300 text-center"
              >
                <Trophy className="h-12 w-12 mx-auto mb-2" />
                <div className="text-2xl font-black">GAME OVER!</div>
                <div className="text-lg font-bold">Final Score: {score}</div>
              </motion.div>
            )}

            <div
              className="border-4 border-black bg-[#BBADA0] p-2 mx-auto"
              style={{ width: "fit-content" }}
            >
              <div className="grid grid-cols-4 gap-2">
                {grid.map((row, i) =>
                  row.map((cell, j) => (
                    <motion.div
                      key={`${i}-${j}`}
                      initial={{ scale: cell === 0 ? 1 : 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 border-2 border-black flex items-center justify-center font-black text-2xl"
                      style={{
                        backgroundColor: getTileColor(cell),
                        color: cell > 4 ? "#F9F6F2" : "#776E65",
                      }}
                    >
                      {cell !== 0 && cell}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-sm font-bold">
              Use arrow keys to play
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
