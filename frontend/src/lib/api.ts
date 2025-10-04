// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export type TranscriptSegment = {
    id: number;
    start: number;
    end: number;
    text: string;
};

export type UploadResponse = {
    text: string;
    segments: TranscriptSegment[];
    language?: string | null;
    language_probability?: number | null;
    used_model?: string;
};

/** Upload audio file lên backend để transcribe */
export async function uploadAudioToBackend(
    file: File,
    meta: { language?: string } = {}
) {
    const form = new FormData();
    form.append("file", file);
    if (meta.language) form.append("language", meta.language);

    const res = await fetch(`${API_BASE}/api/upload/upload-audio`, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${await safeText(res)}`);
    }
    return (await res.json()) as UploadResponse;
}

/** Lấy random 1 audio theo level (A1..C2) */
export async function getRandomLevelAudio(level: string) {
    const res = await fetch(`${API_BASE}/api/levels/${level}/random`);
    if (!res.ok) {
        throw new Error(`Fetch level failed: ${res.status} ${await safeText(res)}`);
    }
    return (await res.json()) as {
        level: string;
        file: string;
        audio_url: string;
    };
}

/** Helper: tải audio về FE, tạo File + objectURL */
export async function pickLevelAudio(level: string) {
    const { audio_url } = await getRandomLevelAudio(level);
    const fullUrl = joinUrl(API_BASE, audio_url);

    const r = await fetch(fullUrl);
    if (!r.ok) throw new Error(`Download audio failed: ${r.status}`);

    const blob = await r.blob();
    const file = new File([blob], `${level}.mp3`, {
        type: blob.type || "audio/mpeg",
    });
    const url = URL.createObjectURL(blob);

    return { file, url };
}

/** Split transcript thành câu */
export function toSentences(text: string) {
    return (text || "")
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

/* helpers */
async function safeText(r: Response) {
    try {
        return await r.text();
    } catch {
        return "";
    }
}
function joinUrl(base: string, path: string) {
    if (path.startsWith("http")) return path;
    return `${base.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}
