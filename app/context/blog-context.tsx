'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blog, CreateBlogData, getBlogs, createBlog, updateBlog, deleteBlog } from '@/lib/blog';

interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  addBlog: (data: CreateBlogData) => Promise<Blog>;
  editBlog: (id: string, data: Partial<CreateBlogData>) => Promise<Blog>;
  removeBlog: (id: string) => Promise<void>;
  getBlogById: (id: string) => Blog | undefined;
  refreshBlogs: () => Promise<void>;
  clearError: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBlogs = await getBlogs();
      setBlogs(fetchedBlogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new blog
  const addBlog = async (data: CreateBlogData): Promise<Blog> => {
    try {
      setError(null);
      const newBlog = await createBlog(data);
      setBlogs(prev => [newBlog, ...prev]);
      return newBlog;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create blog';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update an existing blog
  const editBlog = async (id: string, data: Partial<CreateBlogData>): Promise<Blog> => {
    try {
      setError(null);
      const updatedBlog = await updateBlog(id, data);
      setBlogs(prev =>
        prev.map(blog =>
          blog.id === id ? updatedBlog : blog
        )
      );
      return updatedBlog;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update blog';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a blog
  const removeBlog = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteBlog(id);
      setBlogs(prev => prev.filter(blog => blog.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete blog';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get a single blog by ID
  const getBlogById = (id: string): Blog | undefined => {
    return blogs.find(blog => blog.id === id);
  };

  // Refresh blogs
  const refreshBlogs = async (): Promise<void> => {
    await fetchBlogs();
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const contextValue: BlogContextType = {
    blogs,
    loading,
    error,
    fetchBlogs,
    addBlog,
    editBlog,
    removeBlog,
    getBlogById,
    refreshBlogs,
    clearError,
  };

  return (
    <BlogContext.Provider value={contextValue}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
};

export { BlogContext };
