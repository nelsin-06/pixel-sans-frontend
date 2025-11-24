import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { usePostDetail } from "@/hooks/usePostDetail";
import { usePosts } from "@/hooks/usePosts/context";

const PostDetail = () => {
  const { id = "" } = useParams();
  const { post, loading, error } = usePostDetail(id);
  
  // Get posts from context
  const { posts: allPosts, setCategory } = usePosts();

  // Update category filter when post is loaded
  useEffect(() => {
    if (post?.category) {
      const mainCategory = post.category.split(',')[0];
      setCategory(mainCategory);
    }
  }, [post, setCategory]);

  // Filter out the current post from related posts
  const relatedPosts = allPosts.filter(p => p._id !== id);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading post...</h1>
            <div className="animate-pulse w-16 h-16 rounded-full bg-primary/20 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !post) {
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

  // Format the date for display
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Parse categories
  const categories = post.category.split(',').map(cat => cat.trim());
  const mainCategory = categories[0] || 'General';

  // Estimate read time based on content length (if we have secciones)
  const readTime = `${Math.max(1, Math.ceil(post.title.length / 100))} min read`;

  // Format content from post.secciones if available
  const formattedContent = post.secciones ? 
    post.secciones.map((section: any) => `<h2>${section.title || ''}</h2><p>${section.content || ''}</p>`).join('') :
    '<p>No content available for this post.</p>';

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
                  {mainCategory}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {readTime}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-vibrant bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>By {post.youtubeChannelName || 'Unknown Author'}</span>
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
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Comments */}
            <CommentSection />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Sticky Sidebar Content */}
            <div className="sticky top-24 space-y-8">
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <PostCard key={relatedPost._id} post={relatedPost} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;