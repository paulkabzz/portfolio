"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Archive,
  ArrowLeft,
  ArchiveRestoreIcon as Unarchive,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessages, Message } from "@/app/context/messages-context";
import ArchivedMessagesSkeleton from "@/components/skeletons/archive-messages-skeleton";

export default function ArchivedMessagesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    archivedMessages,
    loading,
    error,
    fetchArchivedMessages,
    unarchiveMessage,
    deleteMessage,
  } = useMessages();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Only fetch on component mount
  useEffect(() => {
    fetchArchivedMessages();
  }, []); // Removed fetchArchivedMessages from dependency array

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleUnarchiveMessage = async (messageId: string) => {
    try {
      await unarchiveMessage(messageId);
      toast({
        title: "Message unarchived",
        description: "The message has been moved back to your inbox.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unarchive message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to permanently delete this message? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteMessage(messageId);
      toast({
        title: "Message deleted",
        description: "The message has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedMessages = archivedMessages
    .filter((message) => {
      const matchesSearch =
        message.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison = new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime();
      } else {
        comparison = a.full_name.localeCompare(b.full_name);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Messages</h3>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => fetchArchivedMessages()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-secondary/50 cursor-pointer flex items-center justify-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">Archived Messages</h1>
          <p className="text-primary/70 mt-2">View and manage archived contact form submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <Archive className="h-3 w-3 mr-1" />
            {archivedMessages.length} archived
          </Badge>
        </div>
      </div>

      {/* Search and Sort */}
      <Card className="border-secondary">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
              <Input
                placeholder="Search archived messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-secondary focus:border-green"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (sortBy === "date") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("date");
                    setSortOrder("desc");
                  }
                }}
                className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortBy === "date" ? "Date" : "Name"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <ArchivedMessagesSkeleton />
      )}

      {/* Archived Messages List */}
      {!loading && (
        <div className="space-y-4">
          {filteredAndSortedMessages.length === 0 ? (
            <Card className="border-secondary">
              <CardContent className="p-8 text-center">
                <Archive className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">No archived messages found</h3>
                <p className="text-primary/60">
                  {searchTerm ? "Try adjusting your search criteria" : "You haven't archived any messages yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedMessages.map((message) => (
              <Card key={message.$id} className="border-secondary bg-gray-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <Link 
                      href={`/dashboard/messages/${message.$id}`}
                      className="flex-1 min-w-0 cursor-pointer hover:bg-gray-100/50 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-primary truncate">{message.full_name}</h3>
                        <Badge className="bg-gray-100 text-gray-600 flex items-center gap-1">
                          <Archive className="h-3 w-3" />
                          Archived
                        </Badge>
                        {message.urgent && (
                          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium text-primary/80">{message.subject}</p>
                        <p className="text-primary/60 text-sm line-clamp-2">{message.message}</p>

                        <div className="flex items-center gap-4 text-xs text-primary/50 mt-2">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {message.email}
                          </span>
                          {message.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {message.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeDate(message.$createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/messages/${message.$id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link
                        href={`mailto:${message.email}`}
                        className="p-2 text-green hover:bg-green/10 rounded-lg transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnarchiveMessage(message.$id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Unarchive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.$id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}