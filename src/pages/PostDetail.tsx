import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { mockPosts } from "@/data/mockPosts";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import AdPlaceholder from "@/components/AdPlaceholder";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";

const PostDetail = () => {
  const { id } = useParams();
  const post = mockPosts.find((p) => p.id === id);
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <Link to="/">
              <Button className="bg-gradient-gaming text-primary-foreground">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = mockPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Post Header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-gaming text-primary-foreground text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-vibrant bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>By {post.author}</span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ad Placement */}
            <AdPlaceholder type="banner" className="mb-8" />

            {/* Post Content */}
            <div 
              className="prose prose-lg max-w-none mb-8 
                prose-headings:text-foreground 
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:mb-4
                prose-ul:text-muted-foreground prose-ul:mb-4
                prose-ol:text-muted-foreground prose-ol:mb-4
                prose-li:mb-2
                prose-strong:text-primary prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Ad Placement */}
            <AdPlaceholder type="leaderboard" className="mb-8" />

            {/* Comments */}
            <CommentSection />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Sticky Sidebar Content */}
            <div className="sticky top-24 space-y-8">
              {/* Ad Placement */}
              <AdPlaceholder type="sidebar" />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <PostCard key={relatedPost.id} {...relatedPost} />
                    ))}
                  </div>
                </div>
              )}

              {/* Another Ad */}
              <AdPlaceholder type="square" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;