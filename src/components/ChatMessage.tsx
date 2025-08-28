import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/lib/ai';

interface ChatMessageProps {
  message: ChatMessageType;
  persona?: string;
}

export function ChatMessage({ message, persona }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      'flex gap-3 p-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[80%] rounded-sm px-4 py-2',
        isUser
          ? 'bg-[color:var(--brand-primary)] text-[color:var(--text-on-primary)]'
          : 'bg-[color:var(--bg-surface)] text-[color:var(--text-base)] border border-[color:var(--border-default)]'
      )}>
        {!isUser && persona && (
          <div className="text-xs text-[color:var(--text-muted)] mb-1 font-medium">
            {persona}
          </div>
        )}
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}