interface SparklineProps {
    values: number[];
    color: string;
}

const WIDTH = 220;
const HEIGHT = 60;

/** A soft, absolutely-positioned background sparkline for stat cards. */
export function Sparkline({ values, color }: SparklineProps) {
    const count = values.length;
    if (!count) {
        return null;
    }

    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const x = (i: number) =>
        count <= 1 ? WIDTH / 2 : (i / (count - 1)) * WIDTH;
    const y = (v: number) =>
        HEIGHT - ((v - min) / (max - min || 1)) * HEIGHT * 0.82 - 4;

    const points = values.map((v, i) => [x(i), y(v)] as const);
    let line = points.length
        ? `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
        : '';
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        line += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    const area = `${line} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;

    return (
        <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[62px] w-full"
        >
            <path d={area} fill={color} opacity={0.09} />
            <path
                d={line}
                fill="none"
                stroke={color}
                strokeWidth={2}
                opacity={0.3}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}
