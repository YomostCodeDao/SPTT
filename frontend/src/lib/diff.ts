export type DiffResult = { acc: number; html: string };

export function diffWords(ref: string, hyp: string): DiffResult {
    const r = ref.trim().split(/\s+/).filter(Boolean);
    const h = hyp.trim().split(/\s+/).filter(Boolean);
    const dp = Array(r.length + 1)
        .fill(null)
        .map(() => Array(h.length + 1).fill(0));

    for (let i = 1; i <= r.length; i++) dp[i][0] = i;
    for (let j = 1; j <= h.length; j++) dp[0][j] = j;

    for (let i = 1; i <= r.length; i++) {
        for (let j = 1; j <= h.length; j++) {
            const cost = r[i - 1].toLowerCase() === h[j - 1].toLowerCase() ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }

    let i = r.length, j = h.length;
    const ops: Array<{ op: "eq" | "sub" | "ins" | "del"; ref?: string; hyp?: string }> = [];
    while (i > 0 || j > 0) {
        if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
            ops.push({ op: "del", ref: r[i - 1] }); i--;
        } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
            ops.push({ op: "ins", hyp: h[j - 1] }); j--;
        } else {
            const eq = r[i - 1]?.toLowerCase() === h[j - 1]?.toLowerCase();
            ops.push({ op: eq ? "eq" : "sub", ref: r[i - 1], hyp: h[j - 1] });
            i--; j--;
        }
    }
    ops.reverse();

    const correct = ops.filter((o) => o.op === "eq").length;
    const acc = r.length ? Math.round((correct / r.length) * 100) : 0;
    const html = ops
        .map((o) => {
            if (o.op === "eq") return `<span class="hl eq">${o.hyp || o.ref}</span>`;
            if (o.op === "sub") return `<span class="hl sub">${o.hyp}↔${o.ref}</span>`;
            if (o.op === "ins") return `<span class="hl ins">+${o.hyp}</span>`;
            return `<span class="hl del">-${o.ref}</span>`;
        })
        .join(" ");
    return { acc, html };
}
