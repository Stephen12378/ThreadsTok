'use client';

import { useState, useEffect } from 'react';
import Scrollable from '../components/PostScroll';
import { IPost } from '@/types/types';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts?page=1&limit=40');
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen max-w-[420px] mx-auto relative">
      <Scrollable posts={posts} />
    </div>
  );
}
