import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Game data configuration
const GAMES = [
  { id: "roblox", name: "Roblox", currency: "Robux" },
  { id: "brawl-stars", name: "Brawl Stars", currency: "Gems" },
  { id: "valorant", name: "Valorant", currency: "VP" },
  { id: "free-fire", name: "Free Fire", currency: "Diamonds" },
];

const AMOUNTS = [250, 500, 1000, 5900];

const COMMENTS = [
  {
    text: "What a great discovery! This page keeps me up to date with everything I need to know. I wish I had known about it sooner.",
    author: "Anonymous User",
  },
  {
    text: "The information here is super useful and up to date. It helps me a lot not to miss any important events.",
    author: "Gamer_X",
  },
  {
    text: "Excellent site to stay informed. Navigation is fast and the content is high quality.",
    author: "Player123",
  },
  {
    text: "I love how they cover news about my favorite games. Definitely my new source of information.",
    author: "Anon55",
  },
  {
    text: "Very good page, simple and direct. Thanks for keeping us informed with the latest news.",
    author: "User_Pro",
  },
];

type GeneratorStatus = "idle" | "loading" | "error";

const Generator = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(GAMES[0]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<GeneratorStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [api]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === "loading") {
      setProgress(0);
      const duration = 30000; // 30 seconds
      const intervalTime = 100;
      const steps = duration / intervalTime;
      const increment = 100 / steps;

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("error");
            return 100;
          }
          return prev + increment;
        });
      }, intervalTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const handleGenerate = () => {
    if (!selectedAmount || !userId.trim()) return;

    // 50% chance to open the ad link
    if (Math.random() < 0.5) {
      window.open("https://otieu.com/4/10232712", "_blank");
      return;
    }

    setStatus("loading");
  };

  const handleRetry = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4 font-sans">
      {/* Main Container */}
      <div className="w-full max-w-2xl bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent blur-sm"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-2 tracking-wider">GENERATOR</h1>
          <p className="text-slate-400 text-center mb-10 text-sm uppercase tracking-widest">
            Select your package
          </p>

          {/* Amount Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {AMOUNTS.map((amount) => (
              <div
                key={amount}
                onClick={() => status === "idle" && setSelectedAmount(amount)}
                className={`
                  relative group cursor-pointer transition-all duration-300 ease-out
                  h-32 rounded-xl border-2 flex flex-col items-center justify-center
                  ${
                    selectedAmount === amount
                      ? "border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                      : "border-slate-800 bg-slate-900/80 hover:border-slate-600 hover:bg-slate-800"
                  }
                  ${status !== "idle" ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {/* Selection Circle */}
                <div className={`
                  absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${selectedAmount === amount ? "border-green-500 bg-green-500" : "border-slate-600"}
                `}>
                  {selectedAmount === amount && <Check className="w-3 h-3 text-black font-bold" />}
                </div>

                <span className="text-4xl font-bold text-white mb-1">{amount}</span>
                <span className="text-sm text-green-400 font-medium uppercase tracking-wider">
                  {selectedGame.currency}
                </span>
              </div>
            ))}
          </div>

          {/* User ID Input */}
          <div className="mb-8">
            <label className="block text-slate-400 text-sm uppercase tracking-widest mb-2 ml-1">
              Player ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={`Enter your ${selectedGame.name} ID...`}
              className="w-full h-14 bg-slate-900 border-2 border-slate-800 rounded-xl px-4 text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-green-500 transition-colors"
              disabled={status !== "idle"}
            />
          </div>

          {/* Controls Area */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
            
            {/* Generate / Loading / Retry Button */}
            <div className="w-full md:w-1/2 order-2 md:order-1">
              {status === "idle" && (
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedAmount || !userId.trim()}
                  className={`
                    w-full h-14 text-lg font-bold tracking-wider uppercase rounded-xl transition-all
                    ${
                      selectedAmount && userId.trim()
                        ? "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_25px_rgba(22,163,74,0.6)]"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }
                  `}
                >
                  Generate
                </Button>
              )}

              {status === "loading" && (
                <div className="w-full h-14 bg-slate-800 rounded-xl border border-slate-700 p-1 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-xs font-bold text-green-400 uppercase tracking-widest animate-pulse">
                      Processing... {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-full w-full bg-slate-900 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full bg-green-600 transition-all duration-300 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === "error" && (
                <Button
                  onClick={handleRetry}
                  variant="destructive"
                  className="w-full h-14 text-lg font-bold tracking-wider uppercase rounded-xl bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-in fade-in zoom-in duration-300"
                >
                  Retry
                </Button>
              )}
            </div>

            {/* Game Selector */}
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={status !== "idle"}>
                  <Button
                    variant="outline"
                    className="w-full h-14 justify-between px-4 bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white text-lg rounded-xl"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm uppercase mr-2">Game:</span>
                      {selectedGame.name}
                    </span>
                    <ChevronDown className="h-5 w-5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-slate-900 border-slate-700 text-slate-200">
                  {GAMES.map((game) => (
                    <DropdownMenuItem
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="focus:bg-slate-800 focus:text-white cursor-pointer py-3 text-base"
                    >
                      {game.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Error Message Display */}
          {status === "error" && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in slide-in-from-bottom-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Error: Could not complete the transaction at this moment. Please try again later.
              </p>
            </div>
          )}

          {/* Comments Slider */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {COMMENTS.map((comment, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2 text-center">
                      <p className="text-sm text-slate-300 italic mb-3 leading-relaxed">"{comment.text}"</p>
                      <p className="text-xs text-green-400 font-bold uppercase tracking-wider">- {comment.author}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Generator;
