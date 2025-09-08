import { useState } from "react";
import { MessageCircle, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "GamerPro123",
      content: "Great guide! The codes worked perfectly for me.",
      date: "2 hours ago",
    },
    {
      id: "2",
      author: "DiamondHunter",
      content: "Thanks for sharing! Can't wait for more Free Fire codes.",
      date: "5 hours ago",
    },
  ]);

  const [newComment, setNewComment] = useState({
    name: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Connect to backend API
    // await postComment({ author: newComment.name, content: newComment.comment });
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: newComment.name || "Anonymous",
      content: newComment.comment,
      date: "Just now",
    };
    
    setComments([comment, ...comments]);
    setNewComment({ name: "", comment: "" });
    
    console.log("Comment ready to be sent to backend:", comment);
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <Card className="p-6 mb-8 bg-gradient-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your name (optional)"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            className="bg-background/50"
          />
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            required
            className="min-h-24 bg-background/50"
          />
          <Button
            type="submit"
            className="bg-gradient-gaming text-primary-foreground shadow-gaming hover:shadow-glow"
          >
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </form>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4 hover:bg-card-hover transition-colors">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-gaming flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;