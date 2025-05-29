import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { db } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function TotalScan() {
  const [logs, setLogs] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getDocs(collection(db, "predictions"))
      .then(snap => setLogs(snap.docs.map(d => d.data())))
      .catch(console.error);
  }, []);

  // Count scans per day
  const byDay = logs.reduce((acc, l) => {
    const day = new Date(l.timestamp * 1000).toLocaleDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(byDay)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([day, count]) => ({ day, count }));

  return (
    <>
      <Navbar />
      <Container>
        <h1>Total Scans Over Time</h1>
        <p>Trend of total CSV scans per day.</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke={theme.colors.info}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    </>
  );
}
