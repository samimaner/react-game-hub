import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function Snake() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const saveScore = useMutation(api.games.saveScore);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setScore(0);
    setIsPlaying(false);
    generateFood();
  };

  const gameOver = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      saveScore({ game: "snake", score });
      toast.success(`New high score: ${score}!`);
    } else {
      toast.error(`Game Over! Score: ${score}`);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (direction) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          gameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [isPlaying, direction, food, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isPlaying]);

  return (
    <GameLayout title="Snake Game" color="#FF6B9D">
      <div className="max-w-3xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="text-xl font-black">Score: <span className="text-3xl">{score}</span></div>
                <div className="text-lg font-bold">High Score: {highScore}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
                  disabled={snake.length === 1 && score === 0 && !isPlaying ? false : false}
                >
                  {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isPlaying ? "PAUSE" : "PLAY"}
                </Button>
                <Button
                  onClick={resetGame}
                  className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  RESET
                </Button>
              </div>
            </div>

            <div
              className="border-4 border-black bg-green-200 mx-auto"
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
                position: "relative",
              }}
            >
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className="absolute bg-green-600 border border-green-800"
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                  }}
                />
              ))}
              <div
                className="absolute bg-red-500 border-2 border-red-700 rounded-full"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                }}
              />
            </div>

            <div className="mt-4 text-center text-sm font-bold">
              Use arrow keys to control the snake
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
