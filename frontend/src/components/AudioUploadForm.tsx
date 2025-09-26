import * as React from "react";

type Props = {
    onPick: (picked: { file: File; url: string } | null) => void;
};

export default function AudioUploadForm({ onPick }: Props) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return onPick(null);
        const url = URL.createObjectURL(file);
        onPick({ file, url });
    };

    return (
        <div className="flex items-center gap-3">
            <input
                type="file"
                accept="audio/*"
                onChange={onChange}
                className="text-sm file:mr-3 file:rounded-md file:border file:border-neutral-700 file:bg-neutral-900 file:px-3 file:py-2 file:text-neutral-200"
            />
        </div>
    );
}
