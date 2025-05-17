"use client"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'

export default function PositionsChart({ data, keywords = [] }) {
  // If no specific keywords are provided, display the top 5 keywords from the data
  const displayKeywords = keywords.length > 0 
    ? keywords 
    : Object.keys(data[0] || {})
        .filter(key => key !== 'date')
        .slice(0, 5)

  // Custom formatter for y-axis (invert the scale for SEO positions)
  const yAxisFormatter = (value) => {
    return Math.abs(value)
  }

  // Colors for lines
  const colors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444']

  // Custom tooltip that shows actual position (not inverted)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-xs text-gray-500">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              <span>position {Math.abs(entry.value)}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Transform data to invert the y-axis (for SEO positions, lower is better)
  const transformedData = data.map(item => {
    const newItem = { date: item.date }
    displayKeywords.forEach(keyword => {
      // Invert the value for the chart (so lower positions are higher on the chart)
      newItem[keyword] = item[keyword] ? -item[keyword] : null
    })
    return newItem
  })

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={transformedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280" 
          fontSize={12}
          tickMargin={10}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickFormatter={yAxisFormatter}
          tickMargin={10}
          domain={['dataMin', 'dataMax']}
          // Inverted domain makes lower values (higher positions) at the top
          reversed={false}
          // Displaying top 20 positions for better visualization
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {displayKeywords.map((keyword, index) => (
          <Line
            key={keyword}
            type="monotone"
            dataKey={keyword}
            name={keyword}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}