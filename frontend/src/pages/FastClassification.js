import React, { useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function FastClassification() {
  const [loading, setLoading] = useState(false);

  const handleQuickClassify = async () => {
    setLoading(true);
    // call your quick‐classify endpoint here
    // await API.get("/quick-classify");
    setTimeout(() => setLoading(false), 1000); // stub
  };

  return (
    <>
      <Navbar />
      <Container>
        <h1>Fast Classification</h1>
        <p>
          Quickly classify a sample without full CSV upload—ideal for
          spot-checks.
        </p>
        <button onClick={handleQuickClassify} disabled={loading}>
          {loading ? "Classifying…" : "Run Quick Classification"}
        </button>
      </Container>
    </>
  );
}
