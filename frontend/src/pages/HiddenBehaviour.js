import React from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function HiddenBehaviour() {
  return (
    <>
      <Navbar />
      <Container>
        <h1>Hidden Behaviour</h1>
        <p>
          Tools for analyzing stealthy or hidden malware behaviours.  
          Here you can run deep-dive checks on anomalies, explore
          obfuscated patterns, and flag suspicious sequences.
        </p>
      </Container>
    </>
  );
}
