import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import MainPage from "./pages/MainPage";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";
import { PostsProvider } from "@/hooks/usePosts/context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <PostsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/category/:category" element={<MainPage />} />
              {/* Legal Pages - Can be implemented later */}
              <Route path="/privacy-policy" element={<NotFound />} />
              <Route path="/legal-notice" element={<NotFound />} />
              <Route path="/terms" element={<NotFound />} />
              <Route path="/contact" element={<NotFound />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PostsProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
