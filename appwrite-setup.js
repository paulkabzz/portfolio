#!/usr/bin/env node

const { Client, Databases, Storage, Permission, Role, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class AppwriteSetup {
  constructor() {
    this.client = new Client();
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.config = {};
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(`${colors.cyan}${question}${colors.reset}`, resolve);
    });
  }

  async collectConfig() {
    this.log('\n🚀 Welcome to Appwrite Portfolio Setup Automation!', 'bold');
    this.log('This script will help you set up your Appwrite backend automatically.\n', 'blue');

    // Collect basic configuration
    this.config.endpoint = await this.prompt('Enter your Appwrite endpoint (default: https://cloud.appwrite.io/v1): ') || 'https://cloud.appwrite.io/v1';
    this.config.projectId = await this.prompt('Enter your Appwrite Project ID: ');
    this.config.apiKey = await this.prompt('Enter your Appwrite API Key (Server Key): ');
    
    // Validate required fields
    if (!this.config.projectId || !this.config.apiKey) {
      this.log('❌ Project ID and API Key are required!', 'red');
      process.exit(1);
    }

    // Initialise Appwrite client
    this.client
      .setEndpoint(this.config.endpoint)
      .setProject(this.config.projectId)
      .setKey(this.config.apiKey);

    this.log('\n✅ Appwrite client configured successfully!', 'green');
  }

  async createDatabase() {
    try {
      this.log('\n📊 Creating database...', 'yellow');
      
      const database = await this.databases.create(
        ID.unique(),
        'Portfolio Database',
        true
      );
      
      this.config.databaseId = database.$id;
      this.log(`✅ Database created with ID: ${database.$id}`, 'green');
      
      return database;
    } catch (error) {
      this.log(`❌ Error creating database: ${error.message}`, 'red');
      throw error;
    }
  }

  async createCollection(name, attributes, permissions = []) {
    try {
      this.log(`\n📋 Creating ${name} collection...`, 'yellow');
      
      const collection = await this.databases.createCollection(
        this.config.databaseId,
        ID.unique(),
        name,
        permissions.length > 0 ? permissions : [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        false, // documentSecurity
        true   // enabled
      );

      this.log(`✅ Collection '${name}' created with ID: ${collection.$id}`, 'green');

      // Create attributes
      for (const attr of attributes) {
        await this.createAttribute(collection.$id, attr);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return collection;
    } catch (error) {
      this.log(`❌ Error creating ${name} collection: ${error.message}`, 'red');
      throw error;
    }
  }

  async createAttribute(collectionId, attribute) {
    try {
      const { key, type, size, required = false, default: defaultValue, array = false, min, max } = attribute;
      
      let result;
      switch (type) {
        case 'string':
          result = await this.databases.createStringAttribute(
            this.config.databaseId,
            collectionId,
            key,
            size || 255,
            required,
            defaultValue,
            array
          );
          break;
        case 'integer':
          result = await this.databases.createIntegerAttribute(
            this.config.databaseId,
            collectionId,
            key,
            required,
            min,
            max,
            defaultValue,
            array
          );
          break;
        case 'float':
          result = await this.databases.createFloatAttribute(
            this.config.databaseId,
            collectionId,
            key,
            required,
            min,
            max,
            defaultValue,
            array
          );
          break;
        case 'boolean':
          result = await this.databases.createBooleanAttribute(
            this.config.databaseId,
            collectionId,
            key,
            required,
            defaultValue,
            array
          );
          break;
        case 'datetime':
          result = await this.databases.createDatetimeAttribute(
            this.config.databaseId,
            collectionId,
            key,
            required,
            defaultValue,
            array
          );
          break;
        case 'email':
          result = await this.databases.createEmailAttribute(
            this.config.databaseId,
            collectionId,
            key,
            required,
            defaultValue,
            array
          );
          break;
        case 'url':
          result = await this.databases.createUrlAttribute(
            this.config.databaseId,
            collectionId,
            key,
            required,
            defaultValue,
            array
          );
          break;
        case 'phone':
            result = await this.databases.createPhoneAttribute(
                this.config.databaseId,
                collectionId,
                key,
                required,
                defaultValue,
                array
            );
            break;
        default:
          throw new Error(`Unsupported attribute type: ${type}`);
      }
      
      this.log(`  ✅ Created ${type} attribute: ${key}`, 'green');
      return result;
    } catch (error) {
      this.log(`  ❌ Error creating attribute ${attribute.key}: ${error.message}`, 'red');
      throw error;
    }
  }

  async createStorageBucket(name, permissions = []) {
    try {
      this.log(`\n🗄️ Creating ${name} storage bucket...`, 'yellow');
      
      const bucket = await this.storage.createBucket(
        ID.unique(),
        name,
        permissions.length > 0 ? permissions : [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ],
        false, // fileSecurity
        true,  // enabled
        10 * 1024 * 1024, // maxFileSize (10MB - matches frontend validation)
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'], // allowedFileExtensions (simplified for common images/documents)
        'none', // compression
        false,  // encryption
        false   // antivirus
      );

      this.log(`✅ Storage bucket '${name}' created with ID: ${bucket.$id}`, 'green');
      return bucket;
    } catch (error) {
      this.log(`❌ Error creating ${name} storage bucket: ${error.message}`, 'red');
      throw error;
    }
  }

  getCollectionSchemas() {
    return {
      personal: [
        { key: 'name', type: 'string', size: 100, required: true },
        { key: 'surname', type: 'string', size: 100, required: false },
        { key: 'email', type: 'email', required: true },
        { key: 'about', type: 'string', size: 2000, required: false },
        { key: 'image_url', type: 'string', size: 500, required: false },
        { key: 'about_image_url', type: 'string', size: 500, required: false },
        { key: 'location', type: 'string', size: 100, required: false },
        { key: 'phone', type: 'string', size: 20, required: false },
        { key: 'linkedin', type: 'url', required: false },
        { key: 'github', type: 'url', required: false },
        { key: 'headline', type: 'string', size: 255, required: false },
        { key: 'role', type: 'string', size: 100, required: false },
      ],
      projects: [
        { key: 'name', type: 'string', size: 200, required: true },
        { key: 'description', type: 'string', size: 2000, required: true },
        { key: 'technologies', type: 'string', array: true, required: false },
        { key: 'github_url', type: 'url', required: false },
        { key: 'live_url', type: 'url', required: false },
        { key: 'image_url', type: 'string', size: 500, required: false },
        { key: 'completed', type: 'boolean', default: false, required: false }, 
      ],
      experience: [
        { key: 'company', type: 'string', size: 200, required: true },
        { key: 'title', type: 'string', size: 200, required: true },
        { key: 'description', type: 'string', size: 2000, required: false },
        { key: 'location', type: 'string', size: 200, required: false },
        { key: 'company_url', type: 'url', required: false },
        { key: 'startDate', type: 'datetime', required: true },
        { key: 'endDate', type: 'datetime', required: false },
        { key: 'current', type: 'boolean', default: false, required: false },
        { key: 'skills', type: 'string', array: true, required: false },
        { key: 'images', type: 'string', array: true, required: false },
      ],
      messages: [
        { key: 'full_name', type: 'string', size: 100, required: true },
        { key: 'email', type: 'email', required: true },
        { key: 'subject', type: 'string', size: 200, required: false },
        { key: 'message', type: 'string', size: 5000, required: true },
        { key: 'phone', type: 'string', size: 20, required: false },
        { key: 'read', type: 'boolean', default: false, required: false },
        { key: 'archived', type: 'boolean', default: false, required: false },
        { key: 'urgent', type: 'boolean', default: false, required: false },
      ]
    };
  }

  async setupCollections() {
    const schemas = this.getCollectionSchemas();
    const collections = {};

    for (const [name, attributes] of Object.entries(schemas)) {
      try {
        const collection = await this.createCollection(name, attributes);
        this.config[`${name}CollectionId`] = collection.$id;
      } catch (error) {
        this.log(`❌ Failed to create ${name} collection`, 'red');
        throw error;
      }
    }

    return collections;
  }

  async setupStorageBuckets() {
    const buckets = {};
    const bucketNames = [
      'user_img', // Corresponds to NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID
      'project_cover', // Corresponds to NEXT_PUBLIC_APPWRITE_PROJECT_COVER_STORAGE_ID
      'experience_images', // Corresponds to NEXT_PUBLIC_APPWRITE_EXPERIENCE_STORAGE_ID
    ];

    for (const name of bucketNames) {
      try {
        const bucket = await this.createStorageBucket(name);
        // Clean up name for config key to match lib/appwrite.ts pattern
        let configKey = name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        configKey = configKey.charAt(0).toLowerCase() + configKey.slice(1);
        this.config[`${configKey}StorageId`] = bucket.$id;
      } catch (error) {
        this.log(`❌ Failed to create ${name} storage bucket`, 'red');
        throw error;
      }
    }

    return buckets;
  }

  generateEnvFile() {
    const envContent = `# Appwrite Configuration - Generated automatically
NEXT_PUBLIC_APPWRITE_PROJECT_ID=${this.config.projectId}
NEXT_PUBLIC_APPWRITE_URL=${this.config.endpoint}
NEXT_PUBLIC_APPWRITE_DATBASE_ID=${this.config.databaseId}

# Collection IDs
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=${this.config.usersCollectionId}
NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID=${this.config.projectsCollectionId}
NEXT_PUBLIC_APPWRITE_EXPERINCE_COLLECTION_ID=${this.config.experiencesCollectionId}
NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=${this.config.messagesCollectionId}

# Storage Bucket IDs (matching lib/appwrite.ts names)
NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID=${this.config.userImgStorageId}
NEXT_PUBLIC_APPWRITE_PROJECT_COVER_STORAGE_ID=${this.config.projectCoverStorageId}
NEXT_PUBLIC_APPWRITE_EXPERIENCE_STORAGE_ID=${this.config.experienceImagesStorageId}

# User Document ID (you'll need to create a user document and update this)
NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID=your_user_document_id
`;

    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    this.log(`\n✅ Environment file created: ${envPath}`, 'green');
    this.log('⚠️  Don\'t forget to update NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID with your actual user document ID! This is usually found after creating your first user/profile via the dashboard.', 'yellow');
  }

  generateConfigFile() {
    const configContent = `// Appwrite Configuration - Generated automatically by setup script
// NOTE: Your Next.js application should typically use process.env variables
// as defined in lib/appwrite.ts, rather than direct values from this file.
// This file is for reference or if you prefer a non-env variable setup in some parts.

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_URL || '${this.config.endpoint}',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '${this.config.projectId}',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATBASE_ID || '${this.config.databaseId}',
  
  // Collection IDs
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || '${this.config.usersCollectionId}',
  projectCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID || '${this.config.projectsCollectionId}',
  experinceCollectionId: process.env.NEXT_PUBLIC_APPWRITE_EXPERINCE_COLLECTION_ID || '${this.config.experiencesCollectionId}',
  messagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || '${this.config.messagesCollectionId}',
  
  // Storage Bucket IDs
  userImageStorage: process.env.NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID || '${this.config.userImgStorageId}',
  projectCoverStorageId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COVER_STORAGE_ID || '${this.config.projectCoverStorageId}',
  experienceStorageId: process.env.NEXT_PUBLIC_APPWRITE_EXPERIENCE_STORAGE_ID || '${this.config.experienceImagesStorageId}',
  
  // User Document ID - still needs to be manually updated in .env.local
  userDocumentId: process.env.NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID || 'your_user_document_id_here',
};

export default appwriteConfig;
`;

    const configPath = path.join(process.cwd(), 'lib', 'appwrite-generated-config.js');
    
    // Create lib directory if it doesn't exist
    const libDir = path.dirname(configPath);
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, configContent);
    this.log(`✅ Reference configuration file created: ${configPath}`, 'green');
    this.log('   (This is a reference. Your main `lib/appwrite.ts` should use `process.env`.)', 'yellow');
  }

  async run() {
    try {
      await this.collectConfig();
      
      // Create database
      await this.createDatabase();
      
      // Create collections with attributes
      await this.setupCollections();
      
      // Create storage buckets
      await this.setupStorageBuckets();
      
      // Generate configuration files
      this.generateEnvFile();
      this.generateConfigFile();
      
      this.log('\n🎉 Appwrite setup completed successfully!', 'bold');
      this.log('\n📋 Summary:', 'cyan');
      this.log(`- Database ID: ${this.config.databaseId}`, 'blue');
      this.log(`- Collections created: users, projects, experiences, messages`, 'blue');
      this.log(`- Storage buckets created: user_img, project_cover, experience_images`, 'blue');
      this.log(`- Environment file: .env.local`, 'blue');
      this.log(`- Reference configuration file: lib/appwrite-generated-config.js`, 'blue');
      
      this.log('\n🚀 Next steps:', 'yellow');
      this.log('1. Review the generated .env.local file.', 'yellow');
      this.log('2. Run `npm install` or `yarn install` again to ensure new env variables are picked up.', 'yellow');
      this.log('3. Start your development server: `npm run dev` or `yarn dev`.', 'yellow');
      this.log('4. Access the admin dashboard at `http://localhost:3000/login` and create your first account.', 'yellow');
      this.log('5. Once logged in, go to the Profile page (`/dashboard/profile`) and save your personal information. This will create your user document.', 'yellow');
      this.log('6. **IMPORTANT**: Find the ID of your newly created user document in your Appwrite Console (under Database -> Your Database -> users collection -> Documents) and update `NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID` in your `.env.local` file with this ID.', 'yellow');
      this.log('7. Restart your development server after updating the .env.local file.', 'yellow');
      this.log('8. Start building your portfolio content!', 'yellow');
      
    } catch (error) {
      this.log(`\n❌ Setup failed: ${error.message}`, 'red');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

if (require.main === module) {
  const setup = new AppwriteSetup();
  setup.run().catch(console.error);
}

module.exports = AppwriteSetup;