export interface MonthlyPoint {
    inc: number;
    exp: number;
}

interface BarChartProps {
    monthly: MonthlyPoint[];
    labels: string[];
}

const W = 520;
const H = 220;
const PAD_T = 12;
const PAD_B = 28;
const PAD_L = 8;
const PAD_R = 8;

/** Grouped income vs. expense bars per month. */
export function BarChart({ monthly, labels }: BarChartProps) {
    const n = Math.max(1, labels.length);
    const max = Math.max(1, ...monthly.map((m) => Math.max(m.inc, m.exp)));
    const pw = W - PAD_L - PAD_R;
    const ph = H - PAD_T - PAD_B;
    const gw = pw / n;
    const bw = Math.min(18, gw * 0.32);
    const gap = Math.max(3, bw * 0.3);
    const y0 = PAD_T + ph;
    const fontSize = labels.length > 8 ? 10 : 12;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            className="mt-2 block"
        >
            {[0, 1, 2, 3].map((i) => {
                const gy = PAD_T + ph * (i / 3);
                return (
                    <line
                        key={`grid-${i}`}
                        x1={PAD_L}
                        x2={W - PAD_R}
                        y1={gy}
                        y2={gy}
                        stroke="#f4f4f5"
                        strokeWidth={1}
                    />
                );
            })}
            {monthly.map((m, i) => {
                const cx = PAD_L + gw * i + gw / 2;
                const hi = ph * (m.inc / max);
                const he = ph * (m.exp / max);
                return (
                    <g key={`bar-${i}`}>
                        <rect
                            x={cx - bw - gap / 2}
                            y={y0 - hi}
                            width={bw}
                            height={Math.max(0, hi)}
                            rx={3}
                            fill="#16a34a"
                        />
                        <rect
                            x={cx + gap / 2}
                            y={y0 - he}
                            width={bw}
                            height={Math.max(0, he)}
                            rx={3}
                            fill="#dc2626"
                        />
                        <text
                            x={cx}
                            y={H - 8}
                            textAnchor="middle"
                            fontSize={fontSize}
                            fill="#71717a"
                        >
                            {labels[i]}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
