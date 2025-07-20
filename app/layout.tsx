import { Inter, Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";
import { ProjectProvider } from "./context/project-context";
import { ExperienceProvider } from "./context/experience-context";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";
import { MessagesProvider } from "./context/messages-context";
import { AppProviders } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paul Kabulu | Portfolio",
  description: "Computer Science & Engineering student at UCT. Showcasing my projects, skills, and experience in tech and innovation.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.variable}  ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <AppProviders>
            {children}
          </AppProviders>
      </body>
    </html>
  );
}
