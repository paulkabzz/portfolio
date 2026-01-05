import { ID, Query } from 'appwrite';
import { databases, storage, appwriteConfig } from './appwrite';

// Default fonts available without import
export const DEFAULT_FONTS = [
  { name: 'Default', value: 'inherit' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
];

// Content block types for rich blog editing
export interface BlogContentBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'code' | 'quote';
  content: string;
  props?: {
    level?: 1 | 2 | 3;  // For headings
    size?: 'small' | 'medium' | 'large' | 'full';  // For images
    alignment?: 'left' | 'center' | 'right';
    caption?: string;
    language?: string;  // For code blocks
    fontFamily?: string;  // Custom font for text blocks
  };
}

// Custom font import (e.g., from Google Fonts)
export interface CustomFont {
  name: string;      // Display name, e.g. "Playfair Display"
  importUrl: string; // Full URL, e.g. "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
  fontFamily: string; // CSS font-family value, e.g. "'Playfair Display', serif"
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContentBlock[];
  cover_image: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  custom_fonts: CustomFont[];  // Custom font imports for this blog
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContentBlock[];
  tags: string[];
  published: boolean;
  cover_image?: File;
  custom_fonts?: CustomFont[];
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to get blog image URL
export function getBlogImageUrl(fileId: string): string {
  return storage.getFileView(appwriteConfig.blogStorageId!, fileId);
}

// Upload a blog image and return URL
export async function uploadBlogImage(file: File): Promise<string> {
  const response = await storage.createFile(
    appwriteConfig.blogStorageId!,
    ID.unique(),
    file
  );
  return getBlogImageUrl(response.$id);
}

// Extract file ID from Appwrite storage URL
function extractFileIdFromUrl(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const fileIndex = urlParts.findIndex(part => part === 'files');
    if (fileIndex !== -1 && urlParts[fileIndex + 1]) {
      return urlParts[fileIndex + 1];
    }
    return null;
  } catch (error) {
    console.error('Error extracting file ID from URL:', error);
    return null;
  }
}

// Create a new blog
export async function createBlog(data: CreateBlogData): Promise<Blog> {
  try {
    let coverImageUrl = '';
    
    // Upload cover image if provided
    if (data.cover_image) {
      coverImageUrl = await uploadBlogImage(data.cover_image);
    }

    const blogData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: JSON.stringify(data.content),
      cover_image: coverImageUrl,
      tags: data.tags,
      published: data.published,
      publishedAt: data.published ? new Date().toISOString() : null,
      custom_fonts: JSON.stringify(data.custom_fonts || []),
    };

    const blog = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.blogCollectionId!,
      ID.unique(),
      blogData
    );

    return {
      id: blog.$id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: JSON.parse(blog.content || '[]'),
      cover_image: blog.cover_image,
      tags: blog.tags || [],
      published: blog.published,
      publishedAt: blog.publishedAt,
      custom_fonts: JSON.parse(blog.custom_fonts || '[]'),
      createdAt: blog.$createdAt,
      updatedAt: blog.$updatedAt,
    };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

// Get all blogs
export async function getBlogs(): Promise<Blog[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.blogCollectionId!,
      [Query.orderDesc('$createdAt')]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: JSON.parse(doc.content || '[]'),
      cover_image: doc.cover_image,
      tags: doc.tags || [],
      published: doc.published,
      publishedAt: doc.publishedAt,
      custom_fonts: JSON.parse(doc.custom_fonts || '[]'),
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    })) as Blog[];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

// Get a single blog by ID
export async function getBlog(id: string): Promise<Blog | null> {
  try {
    const blog = await databases.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.blogCollectionId!,
      id
    );

    return {
      id: blog.$id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: JSON.parse(blog.content || '[]'),
      cover_image: blog.cover_image,
      tags: blog.tags || [],
      published: blog.published,
      publishedAt: blog.publishedAt,
      custom_fonts: JSON.parse(blog.custom_fonts || '[]'),
      createdAt: blog.$createdAt,
      updatedAt: blog.$updatedAt,
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Get a blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.blogCollectionId!,
      [Query.equal('slug', slug), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return null;
    }

    const doc = response.documents[0];
    return {
      id: doc.$id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: JSON.parse(doc.content || '[]'),
      cover_image: doc.cover_image,
      tags: doc.tags || [],
      published: doc.published,
      publishedAt: doc.publishedAt,
      custom_fonts: JSON.parse(doc.custom_fonts || '[]'),
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
}

// Update a blog
export async function updateBlog(id: string, data: Partial<CreateBlogData>): Promise<Blog> {
  try {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) updateData.content = JSON.stringify(data.content);
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.custom_fonts !== undefined) updateData.custom_fonts = JSON.stringify(data.custom_fonts);
    if (data.published !== undefined) {
      updateData.published = data.published;
      if (data.published) {
        // Set publishedAt if publishing for the first time
        const existingBlog = await getBlog(id);
        if (existingBlog && !existingBlog.publishedAt) {
          updateData.publishedAt = new Date().toISOString();
        }
      }
    }

    // Handle cover image update
    if (data.cover_image) {
      const existingBlog = await getBlog(id);
      
      // Upload new image
      const newImageUrl = await uploadBlogImage(data.cover_image);
      updateData.cover_image = newImageUrl;
      
      // Delete old image if exists
      if (existingBlog?.cover_image) {
        try {
          const oldImageId = extractFileIdFromUrl(existingBlog.cover_image);
          if (oldImageId) {
            await storage.deleteFile(appwriteConfig.blogStorageId!, oldImageId);
          }
        } catch (error) {
          console.warn('Could not delete old cover image:', error);
        }
      }
    }

    const updatedBlog = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.blogCollectionId!,
      id,
      updateData
    );

    return {
      id: updatedBlog.$id,
      title: updatedBlog.title,
      slug: updatedBlog.slug,
      excerpt: updatedBlog.excerpt,
      content: JSON.parse(updatedBlog.content || '[]'),
      cover_image: updatedBlog.cover_image,
      tags: updatedBlog.tags || [],
      published: updatedBlog.published,
      publishedAt: updatedBlog.publishedAt,
      custom_fonts: JSON.parse(updatedBlog.custom_fonts || '[]'),
      createdAt: updatedBlog.$createdAt,
      updatedAt: updatedBlog.$updatedAt,
    };
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
}

// Delete a blog
export async function deleteBlog(id: string): Promise<void> {
  try {
    const blog = await getBlog(id);
    
    // Delete the blog document
    await databases.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.blogCollectionId!,
      id
    );
    
    // Delete cover image if exists
    if (blog?.cover_image) {
      try {
        const imageId = extractFileIdFromUrl(blog.cover_image);
        if (imageId) {
          await storage.deleteFile(appwriteConfig.blogStorageId!, imageId);
        }
      } catch (error) {
        console.warn('Could not delete blog cover image:', error);
      }
    }

    // Delete content images
    if (blog?.content) {
      for (const block of blog.content) {
        if (block.type === 'image' && block.content) {
          try {
            const imageId = extractFileIdFromUrl(block.content);
            if (imageId) {
              await storage.deleteFile(appwriteConfig.blogStorageId!, imageId);
            }
          } catch (error) {
            console.warn('Could not delete content image:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}
