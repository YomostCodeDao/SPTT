import { useCallback, useRef, useEffect, useState } from "react";

export function useAudio() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [segmentEnd, setSegmentEnd] = useState<number | null>(null);

    const onReady = useCallback((el: HTMLAudioElement | null) => {
        audioRef.current = el;
    }, []);

    const replay = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = 0;
        a.play().catch(() => { });
    }, []);

    const pauseReset = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.pause();
        a.currentTime = 0;
        setSegmentEnd(null);
    }, []);

    const togglePlay = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        if (a.paused) a.play().catch(() => { });
        else a.pause();
    }, []);

    const seekTo = useCallback((t: number, end?: number) => {
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = Math.max(0, t);
        if (end != null) setSegmentEnd(end);
        a.play().catch(() => { });
    }, []);

    // auto-stop khi vượt qua segmentEnd
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        const onTime = () => {
            if (segmentEnd != null && a.currentTime >= segmentEnd - 0.05) {
                a.pause();
                setSegmentEnd(null);
            }
        };
        a.addEventListener("timeupdate", onTime);
        return () => a.removeEventListener("timeupdate", onTime);
    }, [segmentEnd]);

    return { onReady, replay, pauseReset, togglePlay, seekTo, setSegmentEnd, audioRef };
}
