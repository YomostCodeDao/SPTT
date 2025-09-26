// src/components/PracticeBox.tsx
import { Button } from "@/components/ui/button";

type Props = {
    reference: string;
    userText: string;
    onUserText: (v: string) => void;
    onCheck: () => void;         // <<— gọi check từ cha
    onReplay: () => void;
    onNext: () => void;
    idx: number;
    total: number;
    attempts: number;            // <<— đã thử mấy lần
    revealed: boolean;           // <<— đã mở khóa chưa
};

export default function PracticeBox({
    reference,
    userText,
    onUserText,
    onCheck,
    onReplay,
    onNext,
    idx,
    total,
    attempts,
    revealed,
}: Props) {
    const left = Math.max(0, 3 - attempts);

    return (
        <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 mt-4">
            <div className="text-sm text-neutral-400 mb-2">Sentence {Math.min(idx + 1, total)}/{total}</div>

            <div className="mb-2 font-semibold">Reference</div>
            <div className="mb-4 text-neutral-200">
                {revealed ? (
                    reference || <em className="text-neutral-500">No text</em>
                ) : (
                    <span className="italic text-neutral-400">
                        {`Chapter ${idx + 1} … (ẩn đáp án — còn ${left} lần thử)`}
                    </span>
                )}
            </div>

            <div className="mb-2 font-semibold">Your text</div>
            <textarea
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 p-3 min-h-[120px] outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Type what you hear…"
                value={userText}
                onChange={(e) => onUserText(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="inverted" onClick={onCheck}>Check</Button>
                <Button variant="inverted" onClick={onReplay}>Replay</Button>
                <Button variant="inverted" onClick={onNext}>Skip</Button>
            </div>
        </section>
    );
}
