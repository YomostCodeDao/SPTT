import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fileFromUrl(url: string, filename = "sample.mp3", type = "audio/mpeg") {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const blob = await res.blob();
  const file = new File([blob], filename, { type });
  const objUrl = URL.createObjectURL(blob);
  return { file, url: objUrl };
}