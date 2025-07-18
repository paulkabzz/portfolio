# Portfolio Website Template

This project is a personal portfolio website built with Next.js, designed to showcase your projects and work experience with an integrated admin dashboard for easy content management. It's bootstrapped with `create-next-app` and uses Appwrite as a backend for data storage and authentication.

## Features

  * **Responsive Design**: The website is built to be responsive and work seamlessly across various devices.
  * **Admin Dashboard**: A secure, protected route `/dashboard` allows you to:
      * Manage your personal information (name, contact, about, images).
      * Add, edit, and delete portfolio projects, including project images, descriptions, and technologies.
      * Add, edit, and delete work experiences, including company details, dates, skills, and images.
      * Search and filter through your projects and experiences.
  * **Public-Facing Portfolio**: Displays your curated content dynamically:
      * **Hero Section**: Customizable headline, name, occupation, and social links (LinkedIn, GitHub).
      * **About Me Section**: Detailed information about yourself with a dedicated image.
      * **Projects Section**: Showcases your projects with images, descriptions, technologies, and links to live demos or GitHub repositories. Includes a loading skeleton for better UX.
      * **Experience Section**: Highlights your work history with company details, job titles, duration, and associated skills. Features an image carousel for multiple visuals per experience.
  * **Authentication**: Secure login system for the admin dashboard.
  * **Dynamic Content Formatting**: Supports basic text formatting (bold, green, italic) and internal/external links within descriptions using custom markdown-like syntax (`**text**`, `{{text}}`, `~text~`, `[["url": text]]`).
  * **Image Management**: Upload and display profile pictures, project cover images, and multiple images for experiences, with validation for size and type.
  * **Toast Notifications**: Provides user feedback for successful operations or errors.
  * **UI Components**: Utilizes Shadcn UI components (Card, Button, Input, Textarea, Badge, Switch, AlertDialog, Tooltip, Toast, Separator, Sheet, Skeleton) for a consistent and modern look.
  * **Theming**: Supports light and dark modes.

## Technologies Used

  * **Framework**: Next.js (App Router)
  * **Styling**: Tailwind CSS
  * **UI Components**: Radix UI, integrated via Shadcn UI
  * **Icons**: Lucide React
  * **Backend**: Appwrite (for database, storage, and authentication)
  * **State Management**: React Context API for managing authentication, projects, and experiences
  * **Utilities**: `clsx` and `tailwind-merge` for utility classes

## Getting Started

Follow these steps to get your portfolio website up and running:

### 1\. Clone the repository

```bash
git clone <repository-url>
cd paulkabzz/portfolio/paulkabzz-portfolio-51ca16c2d80da4a42169aa489cb5d522b8c60cb3
```

### 2\. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3\. Set up Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. These are crucial for connecting to your Appwrite backend.

```
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
NEXT_PUBLIC_APPWRITE_URL=https://cloud.appwrite.io/v1 # or your custom Appwrite endpoint
NEXT_PUBLIC_APPWRITE_DATBASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_USER_IMG_STORAGE_ID=your_user_image_storage_id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID=your_user_document_id # usually '60d0fe2c000000000000' for a single user profile
NEXT_PUBLIC_APPWRITE_PROJECT_COVER_STORAGE_ID=your_project_cover_storage_id
NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID=your_project_collection_id
NEXT_PUBLIC_APPWRITE_EXPERIENCE_STORAGE_ID=your_experience_storage_id
NEXT_PUBLIC_APPWRITE_EXPERINCE_COLLECTION_ID=your_experience_collection_id
```

**Note**: You will need to set up your Appwrite project, create a database, and define collections and storage buckets as per the variables above. Ensure you configure appropriate read/write permissions for your collections and buckets.

### 4\. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the public-facing portfolio.
To access the admin dashboard, navigate to [http://localhost:3000/login](https://www.google.com/search?q=http://localhost:3000/login) and log in with your Appwrite user credentials.

### 5\. Build for production

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### 6\. Start the production server

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

## How to Use as a Template

This repository can be easily adapted to create your own personal portfolio website:

1.  **Set up Appwrite**: Create an Appwrite project and configure the database collections and storage buckets as specified in the "Environment Variables" section.
2.  **Create an Admin User**: Register a user in your Appwrite project. This user will be used to log in to the admin dashboard.
3.  **Update `NEXT_PUBLIC_APPWRITE_USER_DOCUMENT_ID`**: After creating a document in your `userCollectionId` (e.g., named `personal_info`) for your personal profile data, replace `your_user_document_id` in `.env.local` with its actual ID from Appwrite. This allows the site to fetch your unique profile information.
4.  **Populate Content via Dashboard**: Log in to the `/dashboard` to add your personal information, projects, and work experiences. The public site will automatically reflect these updates.
5.  **Customize Styling**: Modify `tailwind.config.js` and `app/globals.css` to adjust colors, fonts, and other styles to match your personal branding.
6.  **Extend Functionality**: Explore the `app/` and `components/` directories to add new sections, features, or integrate with other services.

## Project Structure Highlights

  * `app/`: Contains the main application routes and pages, including public (`page.tsx`) and authenticated dashboard routes (`dashboard/`).
  * `components/`: Reusable UI components, including the custom Shadcn UI components (`ui/`) and public-facing sections (`public-components/`).
  * `lib/`: Utility functions and Appwrite configurations (`appwrite.ts`, `project.ts`).
  * `contexts/`: React Context API for global state management (e.g., `auth-context.tsx`, `project-context.tsx`, `experience-context.tsx`).
  * `hooks/`: Custom React hooks (`use-mobile.ts`, `use-toast.tsx`).
  * `public/`: Static assets like images.

## Learn More

To learn more about Next.js, take a look at the following resources:

  * [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
  * [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome\!

Email: pkbalu05@gmail.com