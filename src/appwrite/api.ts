import { appwriteConfig, databases, storage } from "./config";
import { ID } from "appwrite";

export interface UserUpdateData {
  name?: string;
  surname?: string;
  image_url?: string;
}

export async function updateUser(userData: UserUpdateData) {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      appwriteConfig.userDocumentId,
      userData
    );
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      appwriteConfig.userDocumentId
    );
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function uploadImage(file: File) {
  try {
    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    
    // Return the URL instead of just the response
    const imageUrl = storage.getFileView(appwriteConfig.storageId, response.$id);
    return {
      $id: response.$id,
      url: imageUrl.toString()
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteImageByUrl(imageUrl: string) {
  try {
    // Extract the file ID from the URL
    // Appwrite URLs typically end with the file ID
    const urlParts = imageUrl.split('/');
    const fileId = urlParts[urlParts.length - 1];
    
    await storage.deleteFile(appwriteConfig.storageId, fileId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export function getImageUrl(imageId: string) {
  return storage.getFileView(appwriteConfig.storageId, imageId);
}