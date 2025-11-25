import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PostsListView from "@/components/posts/PostsListView";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section with Ad */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-vibrant bg-clip-text text-transparent">
              Gaming News & Free Rewards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the latest gaming news, free diamonds, gems, and exclusive codes for your favorite games
            </p>
          </div>

          {/* Generator Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate("/generator")}
              className="w-full max-w-md py-6 text-2xl font-bold text-white shadow-xl transform transition-all hover:scale-105 rounded-2xl bg-gradient-to-r from-black via-purple-600 to-yellow-500 animate-gradient-x border border-white/10"
            >
              GENERADOR ROBUX
            </button>
          </div>
          
        </div>

        {/* Posts List View with API Integration */}
        <PostsListView />

      </main>

      <Footer />
    </div>
  );
};

export default MainPage;