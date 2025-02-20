import { IPost } from '@/types/types';
import { useEffect, useState } from 'react';
import { VoiceOver } from './VoiceOver';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const Author = ({ author, title }: { author: string; title: string }) => {
  return (
    <div className="p-2 text-white pr-12 z-10 pt-16">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-2xl font-bold drop-shadow-md">@{author}</h2>
      </div>
      <p className="text-lg font-medium mb-2 drop-shadow-md">{title}</p>
    </div>
  );
};

const Slide = ({ post, currentSlide }: { post: IPost; currentSlide: number }) => {
  const text = post.slides[currentSlide];
  return (
    <>
      <div className="transition-all duration-500 ease-in-out absolute w-full px-2 translate-y-0 opacity-100">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">{text}</h3>
          <Link href={`https://news.ycombinator.com/item?id=${post.postId}`} target="_blank">
            <ExternalLink className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </>
  );
};

export function Post({
  post,
  isInViewPort,
  isMuted,
  gradient,
}: {
  post: IPost;
  isInViewPort: boolean;
  isMuted: boolean;
  gradient: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleAudioEnded = () => {
    setCurrentSlide((prev) => (prev + 1) % post.slides.length);
  };

  useEffect(() => {
    if (!isMuted || !isInViewPort) return;

    const wordsInSlide = post.slides[currentSlide].split(' ').length;
    const timeout = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % post.slides.length);
    }, (wordsInSlide / 3.8) * 1000);

    return () => clearTimeout(timeout);
  }, [isMuted, post.slides, currentSlide, isInViewPort]);

  const voiceOverSrc = `https://pub-4bb212bfbf654d618e2d56a7a84b9457.r2.dev/${post.voiceOver}/${currentSlide}.mp3`;

  return (
    <div className={`snap-start h-full w-full relative pb-8 ${gradient}`}>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex justify-center items-center">
          {isInViewPort && !isMuted && <VoiceOver src={voiceOverSrc} isMuted={isMuted} onEnded={handleAudioEnded} />}
          <Slide post={post} currentSlide={currentSlide} />
        </div>
        <Author author={post.author} title={post.title} />
      </div>
    </div>
  );
}
