'use client';

import { useState, useEffect } from 'react';
import Scrollable from '../components/PostScroll';
import { IPost } from '@/types/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await fetch('/api/posts?page=1&limit=40');
      const data = await response.json();
      setPosts(data);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center h-screen max-w-[420px] mx-auto relative">
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen max-w-[420px] mx-auto relative">
      <Scrollable posts={posts} />
    </div>
  );
}
