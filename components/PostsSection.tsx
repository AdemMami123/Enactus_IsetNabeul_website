"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post, PostType } from "@/types/post";
import Image from "next/image";
import {
  Calendar,
  Link as LinkIcon,
  Award,
  FileText,
  Newspaper,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Helper function to ensure URL has protocol
const ensureHttps = (url: string): string => {
  if (!url) return "";
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
};

export default function PostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const fetchPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(6) // Show latest 6 posts on homepage
      );
      const postsSnapshot = await getDocs(postsQuery);
      
      const postsData: Post[] = postsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          imageUrl: data.imageUrl,
          links: data.links || [],
          eventDate: data.eventDate?.toDate(),
          authorId: data.authorId,
          authorName: data.authorName,
          authorEmail: data.authorEmail,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
      
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (postType: PostType) => {
    switch (postType) {
      case "achievement":
        return <Award className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      case "article":
        return <FileText className="w-4 h-4" />;
      case "news":
        return <Newspaper className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (postType: PostType) => {
    const colors = {
      achievement: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      event: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      article: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      news: "bg-green-500/20 text-green-400 border-green-500/30",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${colors[postType]}`}>
        {getTypeIcon(postType)}
        {postType.charAt(0).toUpperCase() + postType.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Latest <span className="text-[#FFD600]">Updates</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Stay informed about our achievements, events, and news
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-[#FFD600]/20 rounded-lg overflow-hidden hover:border-[#FFD600]/50 hover:shadow-lg hover:shadow-[#FFD600]/10 transition-all group"
            >
              {/* Image */}
              {post.imageUrl && (
                <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    {getTypeBadge(post.type)}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                {!post.imageUrl && (
                  <div className="mb-2 sm:mb-3">
                    {getTypeBadge(post.type)}
                  </div>
                )}

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#FFD600] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <div className="mb-3 sm:mb-4">
                  <p className={`text-gray-400 text-xs sm:text-sm ${
                    expandedPosts.has(post.id) ? '' : 'line-clamp-3'
                  }`}>
                    {post.description}
                  </p>
                  
                  {/* Show more/less button for long descriptions */}
                  {post.description.length > 150 && (
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="mt-1 text-[#FFD600] hover:text-[#FFD600]/80 text-xs flex items-center gap-1 transition-colors"
                    >
                      {expandedPosts.has(post.id) ? (
                        <>
                          Show less <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-gray-500">
                  <span className="truncate">{post.authorName}</span>
                  {post.eventDate ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.eventDate.toLocaleDateString()}
                    </span>
                  ) : (
                    <span>{post.createdAt.toLocaleDateString()}</span>
                  )}
                </div>

                {/* Links Preview */}
                {post.links && post.links.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <a
                      href={ensureHttps(post.links[0])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#FFD600] hover:text-[#FFD600]/80 text-xs sm:text-sm group"
                    >
                      <LinkIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate flex-1">View Link</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
