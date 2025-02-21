'use client';

import { useState, useEffect, useRef } from 'react';
import { IPost } from '@/types/types';
import { Loader2 } from 'lucide-react';
import { Post } from '@/components/post/Post';
import { ButtonOverlay } from '@/components/post/ButtonOverlay';
import useSWRInfinite from 'swr/infinite';

const GRADIENTS = [
  'from-purple-600 to-pink-500',
  'from-blue-600 to-emerald-500',
  'from-cyan-500 via-blue-600 to-indigo-700',
  'from-emerald-500 via-green-600 to-teal-700',
  'from-pink-500 via-purple-600 to-indigo-600',
  'from-blue-600 via-purple-600 to-pink-600',
  'from-pink-400 via-purple-500 to-indigo-600',
  'from-green-500 via-teal-600 to-blue-700',
  'from-green-500 via-teal-600 to-blue-700',
  'from-emerald-500 via-teal-600 to-blue-700',
  'from-orange-500 via-red-600 to-rose-700',
  'from-violet-500 via-purple-600 to-indigo-700',
  'from-sky-500 via-blue-600 to-indigo-800',
  'from-lime-500 via-green-600 to-emerald-800',
  'from-rose-500 via-pink-600 to-purple-800',
];

const PAGE_SIZE = 20;

export default function Home() {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const mainRef = useRef<HTMLElement>(null);
  const lastScrollPosition = useRef(0);

  const getKey = (pageIndex: number, previousPageData: IPost[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/posts?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const {
    data: postsPages,
    size,
    setSize,
    isLoading,
    isValidating,
  } = useSWRInfinite<IPost[]>(getKey, (url) => fetch(url).then((res) => res.json()));

  const posts = postsPages ? postsPages.flat() : [];
  const isEmpty = postsPages?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (postsPages && postsPages[postsPages.length - 1]?.length < PAGE_SIZE);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement || posts.length === 0) return;

    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const currentScrollPosition = container.scrollTop;
      const postHeight = container.clientHeight;
      const newIndex = Math.round(currentScrollPosition / postHeight);

      // Infinite scroll logic
      if (!isReachingEnd && !isValidating && posts.length - newIndex <= 5) {
        setSize(size + 1);
      }

      if (newIndex >= 0 && newIndex < posts.length) {
        setCurrentPostIndex(newIndex);
      }

      lastScrollPosition.current = currentScrollPosition;
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, [posts.length, isReachingEnd, isValidating, size, setSize]);

  const post = posts[currentPostIndex];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen max-w-[420px] mx-auto relative">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen max-w-[420px] mx-auto relative">
      <section
        ref={mainRef}
        className="flex-1 z-10 overflow-scroll snap-y snap-mandatory transition-all duration-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            isInViewPort={post.id === posts[currentPostIndex].id}
            isMuted={isMuted}
            gradient={GRADIENTS[post.id % GRADIENTS.length]}
          />
        ))}
      </section>
      <ButtonOverlay
        likes={post?.likes || 0}
        comments={post?.comments || 0}
        createdAt={new Date(post?.createdAt) || new Date()}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </div>
  );
}
