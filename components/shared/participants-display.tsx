//participants-display.tsx

'use client';
import Image from 'next/image';

interface Participant {
  id: number;
  name: string;
  avatar: string | null;
}

interface ParticipantsDisplayProps {
  totalSpots: number;
  participants: Participant[];
  remainingSpots: number;
  showNames?: boolean;
  openInvite?: boolean;
}

export function ParticipantsDisplay({
  totalSpots: _totalSpots,
  participants,
  remainingSpots,
  showNames = true,
  openInvite = false
}: ParticipantsDisplayProps) {
  if (openInvite) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm text-zinc-300">Participants</h4>
        <span className="text-sm text-zinc-400">
          {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} left
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex -space-x-2 mr-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="relative"
              title={participant.name}
            >
              {participant.avatar ? (
                <div className="w-8 h-8 relative">
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    fill
                    className="rounded-xl border-2 border-zinc-950 object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl border-2 border-zinc-950 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {participant.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: Math.min(remainingSpots, 3) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-8 h-8 rounded-xl border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center"
            >
              <span className="text-zinc-400 text-xs">+</span>
            </div>
          ))}
        </div>

        {showNames && participants.length > 0 && (
          <div className="text-sm text-zinc-300">
            <span className="font-medium">{participants[0].name}</span>
            {participants.length > 1 && (
              <span className="text-zinc-400"> and {participants.length - 1} other{participants.length > 2 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}