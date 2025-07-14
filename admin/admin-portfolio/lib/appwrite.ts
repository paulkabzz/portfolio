import { Client, Account, Databases, Storage } from 'appwrite';

export const appwriteConfig = {
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    url: process.env.NEXT_PUBLIC_APPWRITE_URL,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATBASE_ID,
    userImageStorage: process.env.NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    userDocumentId: process.env.NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID
} as const;

export const client = new Client();

if (!appwriteConfig.projectId)
    throw new Error("Project ID not set");

if (!appwriteConfig.url)
    throw new Error("Appwrite endpoint not set");

if (!appwriteConfig.databaseId)
    throw new Error("")

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account: Account = new Account(client);
export const databases: Databases = new Databases(client);
export const storage: Storage = new Storage(client);
// export const userCollectionId = new
