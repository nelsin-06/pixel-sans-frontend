import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, Code, MessageSquareWarning } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-gaming bg-clip-text text-transparent">Contact</h1>
          
          <div className="space-y-10">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/20">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Malicia</h2>
                <p className="text-muted-foreground">Admin & Developer</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Services Card */}
              <div className="p-6 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors">
                <Code className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Development & Work</h3>
                <p className="text-sm text-muted-foreground">
                  Interested in working together? I'm available for custom development projects and collaborations.
                </p>
              </div>

              {/* Support Card */}
              <div className="p-6 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors">
                <MessageSquareWarning className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Feedback & Support</h3>
                <p className="text-sm text-muted-foreground">
                  Have a complaint or found an issue? Let me know so I can improve the experience for everyone.
                </p>
              </div>
            </div>

            {/* Contact Action */}
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">Send me an email</h3>
                <p className="text-sm text-muted-foreground mb-4">I'll get back to you as soon as possible</p>
              </div>
              
              <a 
                href="mailto:contacto@pixel-sans.com" 
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
              >
                <Mail className="h-5 w-5" />
                contacto@pixel-sans.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
