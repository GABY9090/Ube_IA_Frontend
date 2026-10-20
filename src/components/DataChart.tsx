import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';
import type { ResultRow } from '@/types';

interface DataChartProps {
  columns: string[];
  rows: ResultRow[];
  chartType: 'bar' | 'line' | 'pie';
}

const COLORS = [
  '#8B1A2B', '#c9374b', '#e06a7c', '#059669',
  '#d97706', '#2563eb', '#7c3aed', '#06b6d4',
];

function formatValue(val: unknown): number {
  if (typeof val === 'number') return val;
  const n = parseFloat(String(val));
  return isNaN(n) ? 0 : n;
}

function getNumericColumns(columns: string[], rows: ResultRow[]): string[] {
  return columns.filter((col) => rows.some((r) => typeof r[col] === 'number'));
}

function getLabelColumn(columns: string[], rows: ResultRow[]): string {
  const nonNumeric = columns.filter(
    (col) => !rows.some((r) => typeof r[col] === 'number'),
  );
  return nonNumeric[0] || columns[0];
}

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: 'none',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '12px',
  padding: '8px 12px',
};

export function DataChart({ columns, rows, chartType }: DataChartProps) {
  const labelCol = getLabelColumn(columns, rows);
  const numericCols = getNumericColumns(columns, rows);

  if (numericCols.length === 0) return null;

  const data = rows.map((row) => {
    const entry: Record<string, string | number> = {
      [labelCol]: String(row[labelCol] ?? ''),
    };
    numericCols.forEach((col) => {
      entry[col] = formatValue(row[col]);
    });
    return entry;
  });

  const typeMeta = {
    bar: { icon: BarChart3, label: 'Diagramme en barres' },
    line: { icon: LineIcon, label: 'Courbe' },
    pie: { icon: PieIcon, label: 'Camembert' },
  }[chartType];
  const TypeIcon = typeMeta.icon;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 dq-shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <TypeIcon className="w-4 h-4 text-bordeaux-500" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{typeMeta.label}</h4>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey={labelCol} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139, 26, 43, 0.05)' }} />
            {numericCols.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
            {numericCols.map((col, idx) => (
              <Bar key={col} dataKey={col} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} maxBarSize={50} />
            ))}
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey={labelCol} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
            <Tooltip contentStyle={tooltipStyle} />
            {numericCols.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
            {numericCols.map((col, idx) => (
              <Line key={col} type="monotone" dataKey={col} stroke={COLORS[idx % COLORS.length]} strokeWidth={2.5} dot={{ r: 3, fill: COLORS[idx % COLORS.length] }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey={numericCols[0]} nameKey={labelCol} cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
