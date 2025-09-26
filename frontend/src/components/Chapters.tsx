// src/components/Chapters.tsx
import type { TranscriptSegment } from "@/lib/api";

type Props = {
    segments: TranscriptSegment[];
    currentIdx: number;
    onSelect: (idx: number) => void;
    revealed: Set<number>; // <<— thêm
};

function fmt(t: number) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Chapters({ segments, currentIdx, onSelect, revealed }: Props) {
    if (!segments?.length) return null;

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 mt-4">
            <div className="text-sm text-neutral-400 mb-2">Chapters</div>
            <div className="max-h-64 overflow-y-auto pr-1 grid gap-2">
                {segments.map((seg, i) => {
                    const unlocked = revealed.has(seg.id);
                    return (
                        <button
                            key={seg.id}
                            onClick={() => onSelect(i)}
                            className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition
                border-neutral-800 hover:bg-neutral-900 ${i === currentIdx ? "bg-neutral-900/80" : "bg-neutral-950"}`}
                            title={`Jump to ${fmt(seg.start)} – ${fmt(seg.end)}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-neutral-300">#{i + 1} · {fmt(seg.start)}–{fmt(seg.end)}</span>
                            </div>
                            <div className="text-neutral-400 line-clamp-2">
                                {unlocked ? seg.text : `Chapter ${i + 1} …`}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
