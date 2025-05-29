import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell, Legend } from "recharts";
import { db } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    getDocs(collection(db, "predictions"))
      .then(snap => setLogs(snap.docs.map(d => d.data())))
      .catch(console.error);
  }, []);

  // Build data for pie (benign vs malware)
  const counts = logs.reduce(
    (acc, l) => {
      acc[l.label] = (acc[l.label] || 0) + 1;
      return acc;
    },
    { benign: 0, malware: 0 }
  );
  const pieData = [
    { name: "Benign", value: counts.benign },
    { name: "Malware", value: counts.malware }
  ];

  // Build data for bar (by day)
  const byDay = logs.reduce((acc, l) => {
    const day = new Date(l.timestamp * 1000).toLocaleDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(byDay).map(([day, count]) => ({ day, count }));

  const COLORS = [theme.colors.success, theme.colors.danger];

  return (
    <>
      <Navbar />
      <Container>
        <h1>Dashboard</h1>

        <h3>Overall Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <h3 className="mt-4">Daily Predictions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={theme.colors.info} />
          </BarChart>
        </ResponsiveContainer>
      </Container>
    </>
  );
}
