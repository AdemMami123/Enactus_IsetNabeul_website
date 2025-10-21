"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Member {
  id: string;
  name: string;
  photoURL: string;
  position: string;
  positionCoords: { x: number; y: number };
}

// Predefined positions for floating members
const POSITIONS = [
  { x: 10, y: 15 },
  { x: 75, y: 20 },
  { x: 15, y: 70 },
  { x: 80, y: 65 },
  { x: 85, y: 40 },
  { x: 20, y: 45 },
  { x: 60, y: 30 },
  { x: 40, y: 80 },
  { x: 5, y: 50 },
  { x: 90, y: 75 },
];

export default function FloatingMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const membersRef = collection(db, "members");
      const querySnapshot = await getDocs(membersRef);
      
      const fetchedMembers: Member[] = [];
      let index = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only show members with photos
        if (data.photoURL && data.name) {
          fetchedMembers.push({
            id: doc.id,
            name: data.name,
            photoURL: data.photoURL,
            position: data.position || "Member",
            positionCoords: POSITIONS[index % POSITIONS.length],
          });
          index++;
        }
      });
      
      setMembers(fetchedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (members.length === 0) {
    return null; // Don't show if no members
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            className="absolute pointer-events-auto"
            initial={{
              x: `${member.positionCoords.x}vw`,
              y: `${member.positionCoords.y}vh`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: `${member.positionCoords.x}vw`,
              y: `${member.positionCoords.y}vh`,
              opacity: 1,
              scale: 1,
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            onMouseEnter={() => setHoveredMember(member.id)}
            onMouseLeave={() => setHoveredMember(null)}
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              whileHover={{
                scale: 1.2,
                zIndex: 50,
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative group cursor-pointer"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-2xl border-4 border-[#FFD600] group-hover:border-white transition-all duration-300">
                <Image
                  src={member.photoURL}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              </div>
              
              {/* Tooltip with member name and position */}
              <AnimatePresence>
                {hoveredMember === member.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2.5 bg-black/95 backdrop-blur-md rounded-lg border-2 border-[#FFD600] shadow-lg shadow-[#FFD600]/20 whitespace-nowrap z-[100] pointer-events-none"
                  >
                    <p className="text-white font-bold text-sm mb-0.5">{member.name}</p>
                    <p className="text-[#FFD600] text-xs font-medium">{member.position}</p>
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#FFD600]"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
