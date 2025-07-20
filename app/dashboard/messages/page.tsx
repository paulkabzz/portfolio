"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  AlertCircle,
  Clock,
  User,
  ArrowUpDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessages, Message } from "@/app/context/messages-context";
import { useRouter } from "next/navigation";
import MessagesLoadingSkeleton from "@/components/skeletons/message-skeleton";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (seconds <= 1) {
    return "Just now";
  } else if (seconds <= 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes <= 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours <= 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (days <= 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
};


export default function MessagesPage() {
  const { toast } = useToast();
  const {
    messages,
    loading,
    error,
    fetchAllMessages,
    markAsRead,
  } = useMessages();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Use ref to track the interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Change to 5 minutes (5 * 60 * 1000 = 300,000 ms)
  const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  const LAST_FETCH_KEY = 'messages_last_fetch';

  // Stable function using useCallback
  const loadMessages = useCallback(async (force = false) => {
    if (!isMountedRef.current) return;
    
    const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
    const now = Date.now();
    
    // Only fetch if forced or if more than 5 minutes have passed
    if (!force && lastFetch && (now - parseInt(lastFetch)) < FETCH_INTERVAL) {
      return;
    }

    try {
      await fetchAllMessages();
      if (isMountedRef.current) {
        localStorage.setItem(LAST_FETCH_KEY, now.toString());
        setLastFetchTime(now);
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [fetchAllMessages, toast, FETCH_INTERVAL, LAST_FETCH_KEY]);

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    try {
      await fetchAllMessages();
      const now = Date.now();
      localStorage.setItem(LAST_FETCH_KEY, now.toString());
      setLastFetchTime(now);
      toast({
        title: "Success",
        description: "Messages refreshed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh messages.",
        variant: "destructive",
      });
    }
  }, [fetchAllMessages, toast, LAST_FETCH_KEY]);

  // Initialize and set up periodic fetching
  useEffect(() => {
    // Initialize lastFetchTime from localStorage
    const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
    if (lastFetch) {
      setLastFetchTime(parseInt(lastFetch));
    }

    // Initial load (force fetch on first mount)
    loadMessages(true);

    // Set up interval for periodic fetching
    intervalRef.current = setInterval(() => {
      loadMessages(false);
    }, FETCH_INTERVAL);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - this effect should only run once

  // Separate effect for error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark message as read.",
        variant: "destructive",
      });
    }
  };

  const router = useRouter();

  const handleMessageClicked = async (messageId: string) => {
        try {
            handleMarkAsRead(messageId)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark message as read.",
                variant: "destructive",
            });
        } finally {
            router.push(`/dashboard/messages/${messageId}`);
        }
  }

  const filteredAndSortedMessages = messages
    .filter((message) => {
      const matchesSearch =
        message.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUnreadFilter = !filterUnread || !message.read;
      const matchesUrgentFilter = !filterUrgent || message.urgent;

      return matchesSearch && matchesUnreadFilter && matchesUrgentFilter;
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

  const unreadCount = messages.filter((msg) => !msg.read).length;
  const urgentCount = messages.filter((msg) => msg.urgent && !msg.read).length;

  if (loading && messages.length === 0) {
    return (
      <MessagesLoadingSkeleton />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">Messages</h1>
          <p className="text-primary/70 mt-2">Contact form submissions from your portfolio</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-green/10 text-green border-green/20">
              {unreadCount} unread
            </Badge>
          )}
          {urgentCount > 0 && (
            <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
              {urgentCount} urgent
            </Badge>
          )}
          {/* {lastFetchTime && !loading && (
            <div className="text-xs text-primary/50">
              Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
            </div>
          )} */}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-secondary">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-secondary focus:border-green"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-green hover:bg-green/90" onClick={() => router.push('/dashboard/messages/archived')}>
                Archived
              </Button>
              <Button
                variant={filterUnread ? "default" : "outline"}
                onClick={() => setFilterUnread(!filterUnread)}
                className={
                  filterUnread
                    ? "bg-green hover:bg-green/90 text-white"
                    : "border-[#bbb] text-primary hover:bg-secondary/50 bg-transparent"
                }
              >
                <Filter className="h-4 w-4 mr-2" />
                Unread
              </Button>
              <Button
                variant={filterUrgent ? "default" : "outline"}
                onClick={() => setFilterUrgent(!filterUrgent)}
                className={
                  filterUrgent
                    ? "bg-red-500 hover:bg-red-500/90 text-white"
                    : "border-[#bbb] text-primary hover:bg-secondary/50 bg-transparent"
                }
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Urgent
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (sortBy === "date") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("date");
                    setSortOrder("desc");
                  }
                }}
                className="border-[#bbb] text-primary hover:bg-secondary/50 bg-transparent"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortBy === "date" ? "Date" : "Name"}
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="border-[#bbb] text-primary hover:bg-secondary/50 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredAndSortedMessages.length === 0 ? (
          <Card className="border-secondary">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">No messages found</h3>
                <p className="text-primary/60">
                  {searchTerm || filterUnread || filterUrgent
                    ? "Try adjusting your search or filters"
                    : "You haven't received any messages yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedMessages.map((message) => (
            <Card
              key={message.$id}
              className={`border-secondary transition-all hover:bg-green/5 cursor-pointer ${
                !message.read ? "bg-green/8 border-green/20" : ""
              }`}
              onClick={() => handleMessageClicked(message.$id)}
            >
              <CardHeader >
                <div className="flex items-start justify-between gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-primary/60 flex-shrink-0" />
                      <span className="font-semibold text-primary truncate">{message.full_name}</span>
                      {!message.read && (
                        <Badge variant="secondary" className="bg-green text-white text-xs">
                          New
                        </Badge>
                      )}
                      {message.urgent && (
                        <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-primary mb-2 line-clamp-1">{message.subject}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary/60 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                    {formatDate(message.$createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <p className="text-primary/80 leading-relaxed line-clamp-3 text-[12px]">{message.message}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-secondary">
                    <div className="flex items-center gap-2 text-sm text-primary/60">
                      <Mail className="h-4 w-4 text-green" />
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-green transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {message.email}
                      </a>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2 text-sm text-primary/60">
                        <Phone className="h-4 w-4 text-green" />
                        <a
                          href={`tel:${message.phone}`}
                          className="hover:text-green transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {message.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-primary/60">
                      <Calendar className="h-4 w-4 text-green" />
                      {new Date(message.$createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {messages.length > 0 && (
        <Card className="border-secondary">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{messages.length}</div>
                <div className="text-sm text-primary/60">Total Messages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green">{unreadCount}</div>
                <div className="text-sm text-primary/60">Unread</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{urgentCount}</div>
                <div className="text-sm text-primary/60">Urgent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{messages.filter((msg) => msg.read).length}</div>
                <div className="text-sm text-primary/60">Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}