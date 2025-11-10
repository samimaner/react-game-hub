import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  color: string;
}

export function GameLayout({ children, title, color }: GameLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: color }}>
      <div className="border-b-4 border-black bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-black">{title}</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
