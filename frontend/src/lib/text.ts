export function normalize(s: string) {
    return s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s']/gu, "") // bỏ dấu chấm câu, ký tự đặc biệt
        .replace(/\s+/g, " ")
        .trim();
}

export function isCorrect(user: string, ref: string) {
    return normalize(user) === normalize(ref);
}