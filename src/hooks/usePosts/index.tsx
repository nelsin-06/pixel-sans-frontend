import { useState, useEffect, useCallback } from 'react';
import { fetchPosts, Post, FetchPostsParams } from '@/api/postService';
import { useDebounce } from '@/lib/utils';

export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentCategory: string;
  currentSearchTerm: string;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  refreshPosts: () => Promise<void>;
}

export const usePosts = (initialParams: FetchPostsParams = {}): UsePostsResult => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(initialParams.page || 1);
  const [pageSize, setPageSize] = useState<number>(initialParams.pageSize || 10);
  const [category, setCategory] = useState<string>(initialParams.category || 'all');
  const [searchTerm, setSearchTermRaw] = useState<string>(initialParams.title || '');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  
  // Implement debounce for search with 1 second delay
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 1000);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPosts({
        page,
        pageSize,
        category: category !== 'all' ? category : undefined,
        title: debouncedSearchTerm || undefined,
      });

      setPosts(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setHasNextPage(response.data.hasNextPage);
      setHasPrevPage(response.data.hasPrevPage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, category, debouncedSearchTerm]);

  // Function to handle search term changes with debounce
  const setSearchTerm = (term: string) => {
    setSearchTermRaw(term);
    // Reset to page 1 when search term changes
    setPage(1);
  };

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handler for page size changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  // Handler for category changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1); // Reset to first page when changing category
  };

  return {
    posts,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    currentCategory: category,
    currentSearchTerm: searchTerm,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setCategory: handleCategoryChange,
    setSearchTerm,
    refreshPosts: fetchData,
  };
};
