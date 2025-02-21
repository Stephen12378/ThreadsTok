import { Heart, MessageCircle, Volume2, VolumeX, Clock1, LucideIcon } from 'lucide-react';
import { getTimeAgo } from '@/utils/time';

const Button = ({ Icon, text, onClick }: { Icon: LucideIcon; text?: string; onClick?: () => void }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="cursor-pointer rounded-full text-gray-100 backdrop-blur-sm hover:bg-gray-700/20 
        active:bg-gray-700/30 transition-colors p-3 bg-gray-800/40"
        onClick={onClick}
      >
        <Icon className="w-5 h-5 drop-shadow-lg" />
      </div>
      {text && <span className="text-xs text-gray-200 font-semibold">{text}</span>}
    </div>
  );
};

export function ButtonOverlay({
  likes,
  comments,
  createdAt,
  isMuted,
  setIsMuted,
}: {
  likes: number;
  comments: number;
  createdAt: Date;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
}) {
  return (
    <div className="absolute right-2 bottom-2 flex flex-col gap-4 items-center pb-4 rounded-lg p-2 z-10">
      <Button
        Icon={isMuted ? VolumeX : Volume2}
        text={isMuted ? 'Unmute' : 'Mute'}
        onClick={() => setIsMuted(!isMuted)}
      />

      <Button Icon={Heart} text={likes.toLocaleString()} />
      <Button Icon={MessageCircle} text={comments.toLocaleString()} />
      <Button Icon={Clock1} text={getTimeAgo(createdAt)} />
    </div>
  );
}
