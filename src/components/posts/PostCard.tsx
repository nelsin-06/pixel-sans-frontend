import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Post } from "@/api/postService";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  // Format the date for display
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Extract categories from the category string
  const categories = post.category?.split(',').map(cat => cat.trim());
  const mainCategory = categories?.[0] || 'General';
  
  return (
    <Card className="group overflow-hidden hover:shadow-gaming transition-all duration-300 border-border hover:border-primary/30 bg-gradient-card">
      <Link to={`/post/${post._id}`} className="block">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Tag className="h-3 w-3" />
              {mainCategory}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {/* Assume average reading time */}
              {`${Math.max(1, Math.ceil(post.title.length / 100))} min read`}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {/* Use a truncated excerpt or part of title as the excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {post.title}
          </p>
          <div className="flex items-center justify-between">
            <time className="text-xs text-muted-foreground">{formattedDate}</time>
            <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PostCard;
