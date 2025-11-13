import React, { createContext, useContext, ReactNode } from 'react';
import { usePosts as usePostsHook } from './index';
import type { UsePostsResult } from './index';
import { FetchPostsParams } from '@/api/postService';

// Crear el contexto
const PostsContext = createContext<UsePostsResult | undefined>(undefined);

// Proveedor del contexto
export const PostsProvider: React.FC<{ children: ReactNode, initialParams?: FetchPostsParams }> = ({ 
  children, 
  initialParams = { page: 1, pageSize: 9, category: 'all' } 
}) => {
  const postsData = usePostsHook(initialParams);
  
  return (
    <PostsContext.Provider value={postsData}>
      {children}
    </PostsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const usePosts = (): UsePostsResult => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts debe ser usado dentro de un PostsProvider');
  }
  return context;
};

// Re-exportar el hook para uso directo cuando no se usa el contexto
export { usePostsHook };
