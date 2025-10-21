import Navbar from "@/components/Navbar";
import CenterLogos from "@/components/CenterLogos";
import FloatingMembers from "@/components/FloatingMembers";
import PostsSection from "@/components/PostsSection";
import SocialMediaBar from "@/components/SocialMediaBar";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat animate-pulse" />
      </div>
      
      {/* Yellow Accent Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD600] rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD600] rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      {/* Social Media Bar */}
      <SocialMediaBar />

      {/* Floating Members */}
      <FloatingMembers />

      {/* Center Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <CenterLogos />
      </div>

      {/* Posts Section - Scrollable Below */}
      <div className="relative z-10 bg-gradient-to-b from-transparent via-black/50 to-black">
        <PostsSection />
      </div>
    </main>
  );
}
