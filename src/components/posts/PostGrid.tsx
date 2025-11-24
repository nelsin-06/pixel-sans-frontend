import PostCard from "./PostCard";
import { Post } from "@/api/postService";

interface PostGridProps {
  posts: Post[];
  loading?: boolean;
}

const PostGrid = ({ posts, loading = false }: PostGridProps) => {
  if (loading) {
    // Show skeleton loading UI
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={`skeleton-${index}`}
            className="rounded-lg border border-border bg-gradient-card p-4 animate-pulse"
          >
            <div className="aspect-video bg-muted rounded-md mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
            <div className="h-3 bg-muted rounded mb-2 w-full"></div>
            <div className="h-3 bg-muted rounded mb-2 w-full"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No posts found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <div key={post._id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
