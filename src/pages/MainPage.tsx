import { useState } from "react";
import { mockPosts } from "@/data/mockPosts";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import AdPlaceholder from "@/components/AdPlaceholder";

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(mockPosts.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = mockPosts.slice(indexOfFirstPost, indexOfLastPost);

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
          
          {/* Top Ad Placement */}
          <AdPlaceholder type="leaderboard" className="mb-8" />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentPosts.map((post, index) => (
            <div key={post.id}>
              <PostCard {...post} />
              {/* Ad after every 3 posts on mobile, hidden on larger screens */}
              {(index + 1) % 3 === 0 && index !== currentPosts.length - 1 && (
                <div className="mt-6 md:hidden">
                  <AdPlaceholder type="square" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Middle Ad Placement */}
        <AdPlaceholder type="banner" className="mb-8" />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Bottom Ad Placement */}
        <div className="mt-8">
          <AdPlaceholder type="leaderboard" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;