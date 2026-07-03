import { formatEuros } from '../utils';

export interface DonutSlice {
    label: string;
    value: number;
    color: string;
}

interface DonutChartProps {
    slices: DonutSlice[];
}

const CX = 82;
const CY = 82;
const R = 72;
const R_IN = 46;

/** Donut chart of expenses by category, with the total in the center. */
export function DonutChart({ slices }: DonutChartProps) {
    const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
    let angle = -Math.PI / 2;

    const polar = (a: number, radius: number) =>
        [CX + radius * Math.cos(a), CY + radius * Math.sin(a)] as const;

    return (
        <svg
            viewBox="0 0 164 164"
            width={150}
            height={150}
            className="shrink-0"
        >
            {slices.length === 0 && (
                <circle
                    cx={CX}
                    cy={CY}
                    r={(R + R_IN) / 2}
                    fill="none"
                    stroke="#f4f4f5"
                    strokeWidth={R - R_IN}
                />
            )}
            {slices.map((slice, i) => {
                const fraction = slice.value / total;
                const a0 = angle;
                const a1 = a0 + fraction * Math.PI * 2;
                angle = a1;
                const large = a1 - a0 > Math.PI ? 1 : 0;
                const [x0, y0] = polar(a0, R);
                const [x1, y1] = polar(a1, R);
                const [x2, y2] = polar(a1, R_IN);
                const [x3, y3] = polar(a0, R_IN);
                const d = `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${R_IN} ${R_IN} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
                return (
                    <path
                        key={`${slice.label}-${i}`}
                        d={d}
                        fill={slice.color}
                    />
                );
            })}
            <text
                x={CX}
                y={CY - 4}
                textAnchor="middle"
                fontSize={11}
                fill="#a1a1aa"
            >
                Total
            </text>
            <text
                x={CX}
                y={CY + 15}
                textAnchor="middle"
                fontSize={17}
                fontWeight={700}
                fill="#18181b"
            >
                {formatEuros(total)}
            </text>
        </svg>
    );
}
