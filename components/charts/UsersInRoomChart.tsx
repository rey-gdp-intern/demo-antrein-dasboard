import {
    CartesianGrid,
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
  } from "recharts";
  
  interface ChartData {
    time: string;
    value: number;
  }
  
  interface UsersInRoomChartProps {
    data: ChartData[];
  }
  
  export function UsersInRoomChart({ data }: UsersInRoomChartProps) {
    return (
      <div className="card flex w-full mt-8 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Users in Room</h2>
  
          <ResponsiveContainer width="100%" minHeight={250}>
            <LineChart width={400} height={400} data={data}>
              <CartesianGrid stroke="hsl(var(--muted))" />
              <XAxis dataKey="time" interval={0} />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
  
          <div className="card-actions justify-end"></div>
        </div>
      </div>
    );
  }
  