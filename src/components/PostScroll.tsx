'use client';

import { useState, useEffect, useRef } from 'react';
import { Post } from './post/Post';
import { IPost } from '@/types/types';
import { ButtonOverlay } from './post/ButtonOverlay';

const gradients = [
  'bg-gradient-to-br from-purple-600 to-pink-500',
  'bg-gradient-to-br from-blue-600 to-emerald-500',
  'bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700',
  'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
  'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600',
  'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
  'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600',
  'bg-gradient-to-br from-green-500 via-teal-600 to-blue-700',
  'bg-gradient-to-br from-green-500 via-teal-600 to-blue-700',
  'bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700',
  'bg-gradient-to-br from-orange-500 via-red-600 to-rose-700',
  'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700',
  'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-800',
  'bg-gradient-to-br from-lime-500 via-green-600 to-emerald-800',
  'bg-gradient-to-br from-rose-500 via-pink-600 to-purple-800',
];

export default function Scrollable({ posts }: { posts: IPost[] }) {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const mainRef = useRef<HTMLElement>(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const currentScrollPosition = container.scrollTop;

      // Calculate post height (including margins)
      const postHeight = container.clientHeight;

      // Update current post index based on scroll position
      const newIndex = Math.round(currentScrollPosition / postHeight);

      if (newIndex >= 0 && newIndex < posts.length) {
        setCurrentPostIndex(newIndex);
      }

      lastScrollPosition.current = currentScrollPosition;
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [posts.length]);

  const post = posts[currentPostIndex];

  return (
    <>
      <section
        ref={mainRef}
        className="flex-1 z-10 border-4 border-blue-900 overflow-scroll snap-y snap-mandatory transition-all duration-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            isInViewPort={post.id === posts[currentPostIndex].id}
            isMuted={isMuted}
            gradient={gradients[post.id % gradients.length]}
          />
        ))}
      </section>
      <ButtonOverlay
        likes={post?.likes || 0}
        comments={post?.comments || 0}
        createdAt={post?.createdAt || ''}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </>
  );
}
