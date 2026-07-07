import { type KeyboardEvent, useEffect, useRef } from 'react';
import { CHAT_SUGGESTIONS } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';

export function ChatView() {
    const { state, actions } = useRentalContext();
    const { chatMessages, chatInput } = state;
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = scrollRef.current;
        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    }, [chatMessages]);

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            actions.sendChat(chatInput);
        }
    };

    return (
        <div className="mx-auto flex h-full max-w-[760px] flex-col">
            <div
                ref={scrollRef}
                className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4"
            >
                {chatMessages.map((message, i) => {
                    const isUser = message.role === 'user';
                    return (
                        <div
                            key={i}
                            className={`flex items-end gap-2.5 ${
                                isUser ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            {!isUser && (
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                                    <Icon
                                        name="sparkles"
                                        width={16}
                                        height={16}
                                        className="text-indigo-600"
                                    />
                                </span>
                            )}
                            <div
                                className={`max-w-[78%] rounded-2xl px-3.5 py-[11px] text-sm leading-relaxed ${
                                    isUser
                                        ? 'rounded-br-[4px] bg-zinc-900 text-zinc-50'
                                        : 'rounded-bl-[4px] bg-zinc-100 text-zinc-950'
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-zinc-200 pt-3">
                <div className="mb-2.5 flex flex-wrap gap-2">
                    {CHAT_SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => actions.sendChat(suggestion)}
                            className="h-[30px] cursor-pointer rounded-full border border-zinc-200 bg-white px-3 text-xs text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
                <div className="flex items-end gap-2.5">
                    <input
                        value={chatInput}
                        onChange={(e) => actions.setChatInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Escribe un mensaje a Guaschnet…"
                        className="h-11 flex-1 rounded-[10px] border border-zinc-200 px-3.5 text-sm transition outline-none focus:border-zinc-900 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
                    />
                    <button
                        onClick={() => actions.sendChat(chatInput)}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-zinc-900 text-zinc-50 transition hover:bg-black"
                    >
                        <Icon name="arrow-up" width={18} height={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
