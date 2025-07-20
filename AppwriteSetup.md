# Appwrite Portfolio Setup Automation

This automation script will help you set up your entire Appwrite backend infrastructure programmatically, including databases, collections with proper attributes, and storage buckets.

## Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Node.js**: Version 16 or higher
3. **Appwrite Project**: Create a new project in your Appwrite console

## Quick Setup

### 1. Install Dependencies

First, install the required dependencies:

```bash
npm install node-appwrite
# or
yarn add node-appwrite
````

### 2\. Get Your Appwrite API Key

1.  Go to your Appwrite Console
2.  Navigate to your project
3.  Go to **Settings** → **API Keys**
4.  Create a new **Server Key** with the following scopes:
      - `databases.read`
      - `databases.write`
      - `collections.read`
      - `collections.write`
      - `attributes.read`
      - `attributes.write`
      - `buckets.read`
      - `buckets.write`

### 3\. Run the Setup Script

Save the automation script as `setup-appwrite.js` in your project root and run:

```bash
node setup-appwrite.js
```

The script will prompt you for:

  - **Appwrite endpoint** (default: https://cloud.appwrite.io/v1)
  - **Project ID** (found in your Appwrite project overview)
  - **API Key** (the server key you just created)

## What the Script Does

### 🗄️ Database Creation

  - Creates a new database called "Portfolio Database"

### 📋 Collection Creation with Attributes

#### **Personal Collection**

  - `name` (string, required) - User's first name
  - `surname` (string) - User's last name
  - `email` (email, required) - User's email address
  - `about` (string) - User biography/description
  - `image_url` (string) - Profile image URL
  - `about_image_url` (string) - Image URL for the 'About Me' section
  - `location` (string) - Geographic location
  - `phone` (string) - Contact phone number
  - `linkedin` (url) - LinkedIn profile URL
  - `github` (url) - GitHub profile URL
  - `headline` (string) - Professional headline (e.g., "Hello, I'm John")
  - `role` (string) - Professional role or title

#### **Projects Collection**

  - `name` (string, required) - Project name
  - `description` (string, required) - Detailed description of the project
  - `technologies` (string array) - Technologies and tools used in the project
  - `github_url` (url) - GitHub repository URL
  - `live_url` (url) - Live demo URL of the project
  - `image_url` (string) - Main project image URL
  - `completed` (boolean) - Indicates if the project is complete

#### **Experience Collection**

  - `company` (string, required) - Company name
  - `title` (string, required) - Job title or position
  - `description` (string) - Detailed role description
  - `location` (string) - Work location
  - `company_url` (url) - Company's official website URL
  - `startDate` (datetime, required) - Start date of employment
  - `endDate` (datetime) - End date of employment (optional if `current` is true)
  - `current` (boolean) - Flag if this is a current position
  - `skills` (string array) - Skills gained or used in this role
  - `images` (string array) - URLs of images related to the experience (e.g., company photos, work samples)

#### **Messages Collection**

  - `full_name` (string, required) - Sender's full name
  - `email` (email, required) - Sender's email address
  - `subject` (string) - Subject of the message
  - `message` (string, required) - Content of the message
  - `phone` (string) - Sender's contact phone number (optional)
  - `read` (boolean) - Status indicating if the message has been read
  - `archived` (boolean) - Status indicating if the message has been archived
  - `urgent` (boolean) - Flag indicating if the message is urgent

### 🗄️ Storage Buckets Creation

  - **user\_img** - Stores profile pictures and avatars (e.g., `image_url`, `about_image_url`)
  - **project\_cover** - Stores main project cover images (`image_url` for projects)
  - **experience\_images** - Stores images related to experiences (`images` array for experiences)

### 📁 Generated Files

#### `.env.local`

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_URL=[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)
NEXT_PUBLIC_APPWRITE_DATBASE_ID=generated_database_id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=generated_collection_id
NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID=generated_collection_id
NEXT_PUBLIC_APPWRITE_EXPERINCE_COLLECTION_ID=generated_collection_id
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=generated_collection_id
NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID=generated_bucket_id
NEXT_PUBLIC_APPWRITE_PROJECT_COVER_STORAGE_ID=generated_bucket_id
NEXT_PUBLIC_APPWRITE_EXPERIENCE_STORAGE_ID=generated_bucket_id
NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID=your_user_document_id # IMPORTANT: Update this manually!
```

#### `lib/appwrite-generated-config.js`

This file is generated for reference or advanced use cases. Your Next.js application's `lib/appwrite.ts` primarily relies on `process.env` variables.

```javascript
// Example content (actual values will be generated)
export const appwriteConfig = {
  endpoint: '[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)',
  projectId: 'your_project_id',
  databaseId: 'generated_database_id',
  collections: {
    users: 'users_collection_id',
    projects: 'projects_collection_id',
    experiences: 'experiences_collection_id',
    messages: 'messages_collection_id',
  },
  storage: {
    userImages: 'user_img_bucket_id',
    projectCovers: 'project_cover_bucket_id',
    experienceImages: 'experience_images_bucket_id',
  }
};
```

## Advanced Usage

### Custom Collection Schema

You can modify the `getCollectionSchemas()` method in the script to customize your collections. For example, to add a `salary` attribute to experiences:

```javascript
// In getCollectionSchemas() method, for 'experiences':
experiences: [
  // ... existing attributes
  { key: 'salary', type: 'integer', required: false },
  { key: 'remote', type: 'boolean', default: false },
  { key: 'tags', type: 'string', array: true },
]
```

### Additional Storage Buckets

Add more storage buckets by modifying the `bucketNames` array in `setupStorageBuckets()`:

```javascript
const bucketNames = [
  'user_img',
  'project_cover',
  'experience_images',
  'certificates',    // New bucket example
  'testimonials',    // New bucket example
];
```

### Permission Customization

Modify permissions for specific collections by passing a custom array to `createCollection`:

```javascript
// Example: Make messages collection admin-only for update/delete, public for create/read
const messagesPermissions = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.update(Role.user('ADMIN_USER_ID')), // Replace with actual admin user ID if needed
  Permission.delete(Role.user('ADMIN_USER_ID')), // Replace with actual admin user ID if needed
];
// Then, in setupCollections():
// await this.createCollection('messages', attributes, messagesPermissions);
```

## Troubleshooting

### Common Issues

1.  **API Key Permissions**: Ensure your API key has all required scopes.
2.  **Rate Limiting**: The script includes delays between attribute creation to avoid rate limits.
3.  **Existing Resources**: If collections/buckets with the same names already exist, the script might throw errors.

### Manual Cleanup

If you need to start over:

1.  Go to your Appwrite Console
2.  Delete the database (this removes all collections)
3.  Delete storage buckets individually
4.  Run the script again

## Next Steps

After running the script:

1.  **Create Your User Account**: Start your Next.js development server (`npm run dev`), navigate to `http://localhost:3000/login`, and create your first admin user account.
2.  **Populate User Profile**: Log in to the dashboard, go to the "Personal Info" page (`/dashboard/profile`), and save your details. This action creates the initial user document in your 'users' collection.
3.  **Update Environment**: Go to your Appwrite Console -\> Databases -\> Your Database -\> `users` collection -\> Documents. Find the ID of the user document you just created and update the `NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID` variable in your `.env.local` file with this ID.
4.  **Restart Server**: Restart your Next.js development server for the new `NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID` to take effect.
5.  **Test Your Setup**: You can now start adding projects, experiences, and messages via the dashboard, and see them reflected on your public portfolio.

## GitHub Student Developer Pack

Don't forget to apply for the GitHub Student Developer Pack to get enhanced Appwrite credits and features\! Visit the GitHub Student Developer Pack website for more information.

## Support

If you encounter issues:

  - Check the Appwrite Console for detailed error messages.
  - Ensure your API key has the correct permissions.
  - Verify your project ID and database ID are correct.
  - Review the generated environment variables in `.env.local`.

The script includes comprehensive error handling and colored output to help diagnose any issues during setup.