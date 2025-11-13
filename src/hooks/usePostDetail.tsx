import { useState, useEffect } from 'react';
import { fetchPostById, Post } from '@/api/postService';

interface UsePostDetailResult {
  post: Post | null;
  loading: boolean;
  error: Error | null;
}

export const usePostDetail = (postId: string): UsePostDetailResult => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPostById(postId);
        setPost(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      getPost();
    }
  }, [postId]);

  return { post, loading, error };
};
