// src/lib/api.ts

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type TranscriptSegment = {
    id: number;
    start: number; // seconds
    end: number;   // seconds
    text: string;
};

export type UploadResponse = {
    text: string;
    segments: TranscriptSegment[];
    language?: string | null;
    language_probability?: number | null;
    used_model?: string;
};

export async function uploadAudioToBackend(
    file: File,
    meta: { language: string } = { language: "en" }
) {
    const form = new FormData();
    form.append("file", file);
    form.append("language", meta.language);

    const res = await fetch(`${API_BASE}/api/upload-audio`, {
        method: "POST",
        body: form,
        // Nếu cần auth:
        // headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(`Upload failed: ${res.status} ${msg}`);
    }
    return (await res.json()) as UploadResponse;
}

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
