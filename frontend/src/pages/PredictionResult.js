import { useLocation } from "react-router-dom";
import { useTheme } from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export default function PredictionResult() {
  const { state } = useLocation();
  const theme = useTheme();
  const data = state?.predictions?.map((p, i) => ({
    name: `#${i + 1}`,
    benign: p.label === "benign" ? p.probability : 0,
    malware: p.label === "malware" ? p.probability : 0
  })) || [];

  return (
    <>
      <Navbar />
      <Container>
        <h1>Prediction Results</h1>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20 }}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} tickFormatter={t => `${(t*100).toFixed(0)}%`} />
            <Tooltip formatter={v => `${(v*100).toFixed(2)}%`} />
            <Bar dataKey="benign"  stackId="a" fill={theme.colors.success} />
            <Bar dataKey="malware" stackId="a" fill={theme.colors.danger} />
          </BarChart>
        </ResponsiveContainer>
      </Container>
    </>
  );
}
