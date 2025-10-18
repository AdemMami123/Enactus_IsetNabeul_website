"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Award,
  Newspaper,
  PartyPopper,
} from "lucide-react";
import { Post, PostType, CreatePostData } from "@/types/post";
import Image from "next/image";

export default function PostManager() {
  const { userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PostType>("achievement");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [links, setLinks] = useState<string[]>([""]);
  const [eventDate, setEventDate] = useState("");
  
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
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
      setMessage({ type: "error", text: "Failed to fetch posts" });
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "enactus_members");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxblaolor/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("achievement");
    setImageFile(null);
    setImagePreview("");
    setLinks([""]);
    setEventDate("");
    setEditingPost(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      setMessage({ type: "error", text: "Title and description are required" });
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editingPost?.imageUrl || "";
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      // Filter out empty links
      const validLinks = links.filter((link) => link.trim() !== "");

      const postData = {
        title,
        description,
        type,
        imageUrl: imageUrl || undefined,
        links: validLinks.length > 0 ? validLinks : undefined,
        eventDate: eventDate ? Timestamp.fromDate(new Date(eventDate)) : undefined,
        authorId: userProfile?.uid || "",
        authorName: userProfile?.displayName || userProfile?.email || "Unknown",
        authorEmail: userProfile?.email || "",
      };

      if (editingPost) {
        // Update existing post
        await updateDoc(doc(db, "posts", editingPost.id), {
          ...postData,
          updatedAt: Timestamp.now(),
        });
        setMessage({ type: "success", text: "Post updated successfully!" });
      } else {
        // Create new post
        await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: Timestamp.now(),
        });
        setMessage({ type: "success", text: "Post created successfully!" });
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      setMessage({ type: "error", text: error.message || "Failed to save post" });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
    setType(post.type);
    setImagePreview(post.imageUrl || "");
    setLinks(post.links && post.links.length > 0 ? post.links : [""]);
    setEventDate(post.eventDate ? post.eventDate.toISOString().split("T")[0] : "");
    setShowForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "posts", postId));
      setMessage({ type: "success", text: "Post deleted successfully!" });
      fetchPosts();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      setMessage({ type: "error", text: error.message || "Failed to delete post" });
    }
  };

  const getTypeIcon = (postType: PostType) => {
    switch (postType) {
      case "achievement":
        return <Award className="w-5 h-5" />;
      case "event":
        return <Calendar className="w-5 h-5" />;
      case "article":
        return <FileText className="w-5 h-5" />;
      case "news":
        return <Newspaper className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (postType: PostType) => {
    const colors = {
      achievement: "bg-yellow-500/20 text-yellow-400",
      event: "bg-blue-500/20 text-blue-400",
      article: "bg-purple-500/20 text-purple-400",
      news: "bg-green-500/20 text-green-400",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors[postType]}`}>
        {getTypeIcon(postType)}
        {postType.charAt(0).toUpperCase() + postType.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
          <p className="mt-4 text-white text-lg">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PartyPopper className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFD600]" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">News & Achievements</h2>
            <p className="text-sm sm:text-base text-gray-400">Share updates, events, and accomplishments</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/50 text-green-500"
                : "bg-red-500/10 border border-red-500/50 text-red-500"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-white">
                    Type *
                  </Label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as PostType)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 mt-1"
                    required
                  >
                    <option value="achievement">Achievement</option>
                    <option value="event">Event</option>
                    <option value="article">Article</option>
                    <option value="news">News</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Description *
                </Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a detailed description..."
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="eventDate" className="text-white">
                  Event Date (Optional)
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-white">
                  Image (Optional)
                </Label>
                <div className="mt-1">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {imageFile ? imageFile.name : "Choose Image"}
                  </label>
                  {imagePreview && (
                    <div className="mt-3 relative w-full h-48">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-white">Links (Optional)</Label>
                <div className="space-y-2 mt-1">
                  {links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      {links.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddLink}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
                >
                  {uploading ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 border border-[#FFD600]/20 rounded-lg">
            <PartyPopper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No posts yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Click "Create Post" to share your first update
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-4 sm:p-6 hover:border-[#FFD600]/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{post.title}</h3>
                    {getTypeBadge(post.type)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <span>By {post.authorName}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{post.createdAt.toLocaleDateString()}</span>
                    {post.eventDate && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.eventDate.toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {userProfile?.uid === post.authorId && (
                  <div className="flex gap-2 self-end sm:self-start">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {post.imageUrl && (
                <div className="relative w-full h-48 sm:h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <p className="text-sm sm:text-base text-gray-300 mb-4 whitespace-pre-wrap">{post.description}</p>

              {post.links && post.links.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-400 font-semibold">Links:</p>
                  {post.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#FFD600] hover:text-[#FFD600]/80 text-xs sm:text-sm break-all"
                    >
                      <LinkIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">{link}</span>
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
