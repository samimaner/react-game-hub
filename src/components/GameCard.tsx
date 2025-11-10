import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  index: number;
}

export function GameCard({ title, description, icon: Icon, path, color, index }: GameCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => navigate(path)}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white border-4 border-black rounded-lg">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black">{title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-black text-base font-semibold mb-4">
            {description}
          </CardDescription>
          <Button 
            className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black text-lg"
            onClick={(e) => {
              e.stopPropagation();
              navigate(path);
            }}
          >
            PLAY NOW
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
