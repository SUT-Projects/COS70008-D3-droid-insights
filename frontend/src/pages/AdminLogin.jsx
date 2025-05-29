import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Navbar from "../components/Navbar";
import styled from "styled-components";



const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      navigate("/hidden-behaviour");
    } catch (err) {
      alert("Admin login failed: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: 10 }}>
            Sign In
          </button>
        </form>
      </Container>
    </>
  );
}
