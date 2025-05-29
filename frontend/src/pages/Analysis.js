import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { auth, db } from "../firebaseConfig";

import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function Analysis() {
  const [logs, setLogs] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getDocs(collection(db, "predictions"))
      .then(snap => setLogs(snap.docs.map(d => d.data())))
      .catch(console.error);
  }, []);

  // Build 10 bins of probability (0–10%, 10–20%, … 90–100%)
  const bins = Array(10).fill(0);
  logs.forEach(l => {
    const idx = Math.min(9, Math.floor(l.probability * 10));
    bins[idx]++;
  });
  const data = bins.map((count, i) => ({
    bin: `${i * 10}-${i * 10 + 10}%`,
    count,
  }));

  return (
    <>
      <Navbar />
      <Container>
        <h1>Probability Distribution</h1>
        <p>
          How many predictions fell into each probability‐range bin.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="bin" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={theme.colors.info} />
          </BarChart>
        </ResponsiveContainer>
      </Container>
    </>
  );
}

