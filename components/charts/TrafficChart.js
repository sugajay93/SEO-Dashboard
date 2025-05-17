"use client"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine 
} from 'recharts'

export default function TrafficChart({ data }) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-xs text-gray-500">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              <span>{entry.value.toLocaleString()} {entry.name === 'Conversions' ? '' : 'visites'}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280" 
          fontSize={12}
          tickMargin={10}
        />
        <YAxis 
          yAxisId="left"
          stroke="#6b7280" 
          fontSize={12}
          tickMargin={10}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          stroke="#6b7280" 
          fontSize={12}
          tickMargin={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          yAxisId="left"
          dataKey="Sessions" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
        <Bar 
          yAxisId="left"
          dataKey="Utilisateurs" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
        <Bar 
          yAxisId="right"
          dataKey="Conversions" 
          fill="#f59e0b" 
          radius={[4, 4, 0, 0]}
          barSize={10}
        />
        <ReferenceLine y={0} stroke="#000" />
      </BarChart>
    </ResponsiveContainer>
  )
}