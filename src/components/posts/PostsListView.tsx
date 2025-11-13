import PostGrid from "./PostGrid";
import PostsPagination from "./PostsPagination";
import { usePosts } from "@/hooks/usePosts/context";

const PostsListView = () => {
  const {
    posts,
    loading,
    error,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage
  } = usePosts();

  return (
    <div>
      {error && (
        <div className="text-center py-10 text-red-500">
          <h3 className="text-lg font-medium">Error loading posts</h3>
          <p>{error.message}</p>
        </div>
      )}

      <PostGrid posts={posts} loading={loading} />
      
      <PostsPagination
        currentPage={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default PostsListView;
