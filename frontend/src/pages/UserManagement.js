import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Container = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
`;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    // assume you have a 'users' collection
    getDocs(collection(db, "users"))
      .then((snap) => setUsers(snap.docs.map((d) => d.data())))
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <h1>User Management</h1>
        <p>View and manage user roles and permissions.</p>
        <ul>
          {users.map((u, i) => (
            <li key={i}>
              {u.email} — Role: <strong>{u.role || "user"}</strong>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
