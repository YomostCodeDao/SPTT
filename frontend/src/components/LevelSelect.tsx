// src/components/LevelSelect.tsx
import * as React from "react";
export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type Props = {
    value: CEFR | "";
    onChange: (lv: CEFR) => void;
    onPick: () => void; // tải audio theo level đã chọn
    loading?: boolean;
};

const LEVELS: CEFR[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function LevelSelect({ value, onChange, onPick, loading }: Props) {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-300">Level</label>
            <select
                className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                value={value}
                onChange={(e) => onChange(e.target.value as CEFR)}
            >
                <option value="">Choose…</option>
                {LEVELS.map((lv) => (
                    <option key={lv} value={lv}>{lv}</option>
                ))}
            </select>
            <button
                className="rounded-full border border-neutral-700 bg-white text-black px-3 py-2 hover:bg-black hover:text-white transition"
                onClick={onPick}
                disabled={!value || loading}
                title="Tải bài ngẫu nhiên theo level"
            >
                {loading ? "Loading…" : "Load"}
            </button>
        </div>
    );
}
