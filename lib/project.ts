import { ID, Query } from 'appwrite';
import { databases, storage, appwriteConfig } from './appwrite';

export interface Project {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  image_url: string;
  github_url: string;
  live_url: string;
  technologies: string[];
  createdAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  completed: boolean;
  github_url: string;
  live_url: string;
  technologies: string[];
  image_url?: File;
}

// Helper function to get image URL
export function getImageUrl(fileId: string): string {
  return storage.getFileView(appwriteConfig.projectCoverStorageId!, fileId);
}

// Helper function to get image preview URL (with dimensions)
export function getImagePreview(fileId: string, width: number = 400, height: number = 300): string {
  return storage.getFilePreview(appwriteConfig.projectCoverStorageId!, fileId, width, height);
}

// Create a new project
export async function createProject(data: CreateProjectData): Promise<Project> {
  try {
    let imageUrl = '';
    let imageId = '';
    
    // Upload image if provided
    if (data.image_url) {
      const imageUpload = await storage.createFile(
        appwriteConfig.projectCoverStorageId!,
        ID.unique(),
        data.image_url
      );
      imageId = imageUpload.$id;
      imageUrl = getImageUrl(imageId); // Get the URL to store in database
    }

    // Create project document
    const projectData = {
      name: data.name,
      description: data.description,
      completed: data.completed,
      image_url: imageUrl, // Store the actual URL, not the file ID
      github_url: data.github_url,
      live_url: data.live_url,
      technologies: data.technologies,
      createdAt: new Date().toISOString(),
    };

    const project = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.projectCollectionId!,
      ID.unique(),
      projectData
    );

    return {
      id: project.$id,
      name: project.name,
      completed: project.completed,
      description: project.description,
      image_url: project.image_url,
      github_url: project.github_url,
      live_url: project.live_url,
      technologies: project.technologies,
      createdAt: project.$createdAt,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.projectCollectionId!,
      [Query.orderDesc('createdAt')]
    );

    const projects = response.documents.map((doc) => ({
      id: doc.$id,
      name: doc.name,
      description: doc.description,
      completed: doc.completed,
      image_url: doc.image_url,
      github_url: doc.github_url,
      live_url: doc.live_url,
      technologies: doc.technologies,
      createdAt: doc.$createdAt,
    })) as Project[];

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Get a single project by ID
export async function getProject(id: string): Promise<Project | null> {
  try {
    const project = await databases.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.projectCollectionId!,
      id
    );

    return {
      id: project.$id,
      name: project.name,
      description: project.description,
      completed: project.completed,
      image_url: project.image_url,
      github_url: project.github_url,
      live_url: project.live_url,
      technologies: project.technologies,
      createdAt: project.$createdAt,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Update a project
export async function updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project> {
  try {
    const updateData: any = { ...data };
    
    // Handle image update if new file is provided
    if (data.image_url) {
      // Get existing project to get old image URL for cleanup
      const existingProject = await getProject(id);
      
      // Upload new image
      const imageUpload = await storage.createFile(
        appwriteConfig.projectCoverStorageId!,
        ID.unique(),
        data.image_url
      );
      
      const newImageId = imageUpload.$id;
      updateData.image_url = getImageUrl(newImageId); // Store the new URL
      
      // Extract file ID from old URL to delete the old image
      if (existingProject?.image_url) {
        try {
          // Extract file ID from URL
          const oldImageId = extractFileIdFromUrl(existingProject.image_url);
          if (oldImageId) {
            await storage.deleteFile(appwriteConfig.projectCoverStorageId!, oldImageId);
          }
        } catch (error) {
          console.warn('Could not delete old image:', error);
        }
      }
    }

    const updatedProject = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.projectCollectionId!,
      id,
      updateData
    );

    return {
      id: updatedProject.$id,
      name: updatedProject.name,
      description: updatedProject.description,
      completed: updatedProject.completed,
      image_url: updatedProject.image_url,
      github_url: updatedProject.github_url,
      live_url: updatedProject.live_url,
      technologies: updatedProject.technologies,
      createdAt: updatedProject.$createdAt,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  try {
    // Get project to delete associated image
    const project = await getProject(id);
    
    // Delete the project document
    await databases.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.projectCollectionId!,
      id
    );
    
    // Delete associated image if it exists
    if (project?.image_url) {
      try {
        // Extract file ID from URL to delete the file
        const imageId = extractFileIdFromUrl(project.image_url);
        if (imageId) {
          await storage.deleteFile(appwriteConfig.projectCoverStorageId!, imageId);
        }
      } catch (error) {
        console.warn('Could not delete project image:', error);
      }
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Helper function to extract file ID from Appwrite storage URL
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