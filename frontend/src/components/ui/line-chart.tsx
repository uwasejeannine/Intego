import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  name: string | number;
  [key: string]: number | string;
}

interface LineChartProps {
  data: DataPoint[];
  colors: string[];
  className?: string;
  height: number;
  width: number;
}

const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  colors,
  className,
  height,
  width,
}) => {
  const keys = Object.keys(data[0]).filter((key) => key !== "name");

  return (
    <div className={className}>
      <LineChart width={width} height={height} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        {keys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default SimpleLineChart;
