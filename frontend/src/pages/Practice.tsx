// src/pages/Practice.tsx
import * as React from "react";
import TopBar from "@/components/TopBar";
import AudioUploadForm from "@/components/AudioUploadForm";
import Player from "@/components/Player";
import Chapters from "@/components/Chapters";
import PracticeBox from "@/components/PracticeBox";
import { Button } from "@/components/ui/button";
import { uploadAudioToBackend, type TranscriptSegment } from "@/lib/api";
import { useAudio } from "@/hooks/useAudio";
import { isCorrect } from "@/lib/text";

export default function Practice() {
    const { onReady, seekTo, replay } = useAudio();

    const [picked, setPicked] = React.useState<{ file: File; url: string } | null>(null);
    const [segments, setSegments] = React.useState<TranscriptSegment[]>([]);
    const [idx, setIdx] = React.useState(0);
    const [userText, setUserText] = React.useState("");

    // số lần thử theo id câu
    const [attempts, setAttempts] = React.useState<Record<number, number>>({});
    // câu nào đã mở khóa reference
    const [revealed, setRevealed] = React.useState<Set<number>>(new Set());

    const audioSrc = picked?.url || "./sample.mp3";
    const current = segments[idx];
    const currentText = current?.text || "";
    const attemptsOfCurrent = current ? (attempts[current.id] || 0) : 0;
    const revealedCurrent = current ? revealed.has(current.id) : false;

    async function startPractice() {
        if (!picked?.file) return alert("Hãy chọn file audio trước.");
        setIdx(0);
        setUserText("");
        setAttempts({});
        setRevealed(new Set());

        const res = await uploadAudioToBackend(picked.file, { language: "en" });
        setSegments(res.segments || []);
        if (res.segments?.[0]) {
            const s0 = res.segments[0];
            seekTo(s0.start, s0.end);
        } else {
            alert("Không lấy được các câu từ transcript.");
        }
    }

    function next() {
        setUserText("");
        setIdx((i) => {
            const n = Math.min(i + 1, Math.max(0, segments.length - 1));
            const seg = segments[n];
            if (seg) seekTo(seg.start, seg.end);
            return n;
        });
    }

    function jumpToChapter(i: number) {
        setIdx(i);
        const seg = segments[i];
        if (seg) seekTo(seg.start, seg.end);
    }

    function handleCheck() {
        if (!current) return;
        const ok = isCorrect(userText, currentText);

        if (ok) {
            // Có thể tự next; đồng thời mở khóa để hiển thị đáp án chuẩn
            setRevealed((prev) => new Set(prev).add(current.id));
            next();
            return;
        }

        const cur = (attempts[current.id] || 0) + 1;
        setAttempts((a) => ({ ...a, [current.id]: cur }));

        if (cur >= 3) {
            // mở khóa đáp án sau 3 lần sai
            setRevealed((prev) => new Set(prev).add(current.id));
        }
    }

    return (
        <div className="min-h-screen bg-black text-neutral-100">
            <div className="max-w-4xl mx-auto p-6">
                <TopBar />

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <AudioUploadForm onPick={setPicked} />
                        <Button variant="inverted" onClick={startPractice}>Start practice</Button>
                        <div className="px-3 py-1 rounded-full border border-neutral-700 text-neutral-200 text-sm">
                            Sentence {Math.min(idx + 1, segments.length)}/{segments.length || 0}
                        </div>
                    </div>

                    <div className="mt-3">
                        <Player src={audioSrc} onReady={onReady} />
                    </div>
                </div>

                <Chapters
                    segments={segments}
                    currentIdx={idx}
                    onSelect={jumpToChapter}
                    revealed={revealed}
                />

                <PracticeBox
                    reference={currentText}
                    userText={userText}
                    onUserText={setUserText}
                    onCheck={handleCheck}
                    onNext={next}
                    onReplay={() => {
                        const seg = segments[idx];
                        if (seg) seekTo(seg.start, seg.end); else replay();
                    }}
                    attempts={attemptsOfCurrent}
                    revealed={revealedCurrent}
                    idx={idx}
                    total={segments.length}
                />
            </div>
        </div>
    );
}
