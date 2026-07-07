import type { MonthlyPoint } from './bar-chart';

interface NetChartProps {
    monthly: MonthlyPoint[];
    labels: string[];
}

const W = 520;
const H = 210;
const PAD_T = 14;
const PAD_B = 28;
const PAD_L = 8;
const PAD_R = 8;

/** Net profit line chart with a subtle filled area. */
export function NetChart({ monthly, labels }: NetChartProps) {
    const nets = monthly.map((m) => m.inc - m.exp);
    const min = Math.min(0, ...nets);
    const max = Math.max(...nets, 1);
    const pw = W - PAD_L - PAD_R;
    const ph = H - PAD_T - PAD_B;
    const n = labels.length;
    const fontSize = labels.length > 8 ? 10 : 12;

    const x = (i: number) =>
        n <= 1 ? PAD_L + pw / 2 : PAD_L + pw * (i / (n - 1));
    const y = (v: number) => PAD_T + ph * (1 - (v - min) / (max - min || 1));

    const points = nets.map((v, i) => [x(i), y(v)] as const);
    const line = points
        .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
        .join(' ');
    const area = `${line} L ${x(n - 1).toFixed(1)} ${(PAD_T + ph).toFixed(1)} L ${x(0).toFixed(1)} ${(PAD_T + ph).toFixed(1)} Z`;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            className="mt-2 block"
        >
            <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y(0)}
                y2={y(0)}
                stroke="#e4e4e7"
                strokeWidth={1}
                strokeDasharray="4 4"
            />
            <path d={area} fill="#18181b" opacity={0.06} />
            <path
                d={line}
                fill="none"
                stroke="#18181b"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {points.map((p, i) => (
                <circle
                    key={`pt-${i}`}
                    cx={p[0]}
                    cy={p[1]}
                    r={3.5}
                    fill="#fff"
                    stroke="#18181b"
                    strokeWidth={2}
                />
            ))}
            {labels.map((label, i) => (
                <text
                    key={`lbl-${i}`}
                    x={x(i)}
                    y={H - 8}
                    textAnchor="middle"
                    fontSize={fontSize}
                    fill="#71717a"
                >
                    {label}
                </text>
            ))}
        </svg>
    );
}
