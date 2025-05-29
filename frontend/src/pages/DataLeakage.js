import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { useTheme } from "styled-components";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function DataLeakage() {
  const [leaks, setLeaks] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    // assume a 'leakageReports' collection
    getDocs(collection(db, "leakageReports"))
      .then((snap) => setLeaks(snap.docs.map((d) => d.data())))
      .catch(console.error);
  }, []);

  // stub: count leaks by severity
  const severityCounts = leaks.reduce((acc, l) => {
    acc[l.severity] = (acc[l.severity] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(severityCounts).map(([sev, cnt]) => ({
    severity: sev,
    count: cnt
  }));

  return (
    <>
      <Navbar />
      <Container>
        <h1>Data Leakage</h1>
        <p>Monitor and review data-leakage incidents by severity.</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="severity" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={theme.colors.danger} />
          </BarChart>
        </ResponsiveContainer>
      </Container>
    </>
  );
}
