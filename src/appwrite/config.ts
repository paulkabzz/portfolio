import { Client, Account, Databases, Storage } from 'appwrite';

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATBASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
};

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account: Account = new Account(client);
export const databases: Databases = new Databases(client);
export const storage: Storage = new Storage(client);
