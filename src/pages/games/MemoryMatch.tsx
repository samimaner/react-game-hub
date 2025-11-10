import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const emojis = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

export default function MemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const saveScore = useMutation(api.games.saveScore);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setIsChecking(true);
      const [first, second] = flipped;
      
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setIsChecking(false);
        
        if (matched.length + 2 === cards.length) {
          toast.success(`You won in ${moves + 1} moves!`);
          saveScore({ game: "memory", score: moves + 1 });
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  const handleCardClick = (index: number) => {
    if (isChecking || flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const isWon = matched.length === cards.length && cards.length > 0;

  return (
    <GameLayout title="Memory Match" color="#A8E6CF">
      <div className="max-w-3xl mx-auto">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-black">
                Moves: <span className="text-4xl">{moves}</span>
              </div>
              <Button
                onClick={initializeGame}
                className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                NEW GAME
              </Button>
            </div>
            
            {isWon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 p-4 border-4 border-black bg-yellow-300 text-center"
              >
                <Trophy className="h-12 w-12 mx-auto mb-2" />
                <div className="text-2xl font-black">YOU WON!</div>
                <div className="text-lg font-bold">Completed in {moves} moves</div>
              </motion.div>
            )}

            <div className="grid grid-cols-4 gap-3">
              {cards.map((emoji, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(index)}
                  className="aspect-square border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-5xl font-black"
                  style={{
                    backgroundColor: flipped.includes(index) || matched.includes(index) ? "#FFD93D" : "#6BCB77"
                  }}
                >
                  {(flipped.includes(index) || matched.includes(index)) ? emoji : "?"}
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
