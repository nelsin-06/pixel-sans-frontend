import api from '@/config/api';

export interface PostAPIResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    items: Post[];
  };
}

export interface Post {
  _id: string;
  title: string;
  secciones?: any[]; // Define a more specific type if the structure is known
  active: boolean;
  category: string;
  image: string;
  youtubeChannelName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostDetailResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface FetchPostsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  title?: string;
}

/**
 * Fetch posts with optional filtering and pagination
 */
export const fetchPosts = async (params: FetchPostsParams = {}): Promise<PostAPIResponse> => {
  const { page = 1, pageSize = 9, category, title } = params;
  
  try {
    const response = await api.get<PostAPIResponse>('/post', {
      params: {
        page,
        pageSize,
        category: category !== 'all' ? category : undefined,
        title: title || undefined,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Fetch a single post by its ID
 */
export const fetchPostById = async (id: string): Promise<PostDetailResponse> => {
  try {
    const response = await api.get<PostDetailResponse>(`/post/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    throw error;
  }
};
