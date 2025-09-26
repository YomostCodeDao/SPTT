import * as React from "react";

type Props = {
    src: string;
    onReady?: (audio: HTMLAudioElement | null) => void;
};

export default function Player({ src, onReady }: Props) {
    const ref = React.useRef<HTMLAudioElement | null>(null);
    React.useEffect(() => {
        onReady?.(ref.current);
    }, [onReady]);
    return <audio ref={ref} src={src} controls className="w-full mt-3" />;
}
