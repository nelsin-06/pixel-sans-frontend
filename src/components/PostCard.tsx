import { Link } from "react-router-dom";
import { Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const PostCard = ({ id, title, excerpt, image, category, date, readTime }: PostCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-gaming transition-all duration-300 border-border hover:border-primary/30 bg-gradient-card">
      <Link to={`/post/${id}`} className="block">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Tag className="h-3 w-3" />
              {category}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {readTime}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            <time className="text-xs text-muted-foreground">{date}</time>
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