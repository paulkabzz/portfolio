import { Client, Account, Databases, Storage } from 'appwrite';

export const appwriteConfig = {
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    url: process.env.NEXT_PUBLIC_APPWRITE_URL,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATBASE_ID,
    userImageStorage: process.env.NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    userDocumentId: process.env.NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID,
    projectCoverStorageId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COVER_STORAGE_ID,
    projectCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID,
    experienceStorageId: process.env.NEXT_PUBLIC_APPWRITE_EXPERIENCE_STORAGE_ID,
    experinceCollectionId: process.env.NEXT_PUBLIC_APPWRITE_EXPERINCE_COLLECTION_ID,
    messagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID,
    jobApplicationsCollecionId: process.env.NEXT_PUBLIC_APPWRITE_JOB_APPLICATIONS_COLLECTION_ID,
    cvStorageId: process.env.NEXT_PUBLIC_APPWRITE_CV_STORAGE_ID,
    cvCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CV_COLLECTION_ID
} as const;

export const client = new Client();

if (!appwriteConfig.projectId)
    throw new Error("Project ID not set");

if (!appwriteConfig.url)
    throw new Error("Appwrite endpoint not set");

if (!appwriteConfig.databaseId)
    throw new Error("Database ID not set");

if (!appwriteConfig.projectCollectionId)
    throw new Error("Project Collection ID not set");

if (!appwriteConfig.projectCoverStorageId)
    throw new Error("Project Cover Storage ID not set");

if (!appwriteConfig.jobApplicationsCollecionId)
    throw new Error("Job Applications Collectin ID not set");

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account: Account = new Account(client);
export const databases: Databases = new Databases(client);
export const storage: Storage = new Storage(client);