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
import { auth, db } from "../firebaseConfig";

import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getDocs(collection(db, "predictions"))
      .then(snap => setLogs(snap.docs.map(d => d.data())))
      .catch(console.error);
  }, []);

  // Prepare data for a line chart of probability over time
  const sorted = [...logs].sort((a, b) => a.timestamp - b.timestamp);
  const data = sorted.map(l => ({
    time: new Date(l.timestamp * 1000).toLocaleTimeString(),
    probability: l.probability,
  }));

  return (
    <>
      <Navbar />
      <Container>
        <h1>Activity Log</h1>
        <p>Timeline of all predictions (by probability).</p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={[0, 1]} tickFormatter={t => `${(t*100).toFixed(0)}%`} />
            <Tooltip formatter={v => `${(v*100).toFixed(2)}%`} />
            <Line
              type="monotone"
              dataKey="probability"
              stroke={theme.colors.primary}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <h2 style={{ marginTop: 40 }}>Raw Log Entries</h2>
        <ul>
          {sorted.map((l, i) => (
            <li key={i}>
              [{new Date(l.timestamp * 1000).toLocaleString()}] &mdash;{" "}
              {l.label} @ {(l.probability * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
