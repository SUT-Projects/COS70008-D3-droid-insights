// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import styled from 'styled-components';

// const Bar = styled.nav`
//   background: #282c34;
//   padding: 1rem;
//   display: flex;
//   gap: 1rem;
// `;

// const StyledLink = styled(Link)`
//   color: white;
//   text-decoration: none;
//   font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
// `;

// export default function NavBar() {
//   const { pathname } = useLocation();

//   return (
//     <Bar>
//       <StyledLink to="/dashboard" active={pathname === '/dashboard'}>
//         Dashboard
//       </StyledLink>
//       <StyledLink to="/upload" active={pathname === '/upload'}>
//         Upload CSV
//       </StyledLink>
//       <StyledLink to="/results" active={pathname === '/results'}>
//         Results
//       </StyledLink>
//     </Bar>
//   );
// }

import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

// --- Styled components ---
const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
`;

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 0;
`;

const Section = styled.span`
  color: white;
  margin: 0 12px;
  font-weight: bold;
`;

const Li = styled.li``;

const SLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 4px 8px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  border-bottom: ${({ active, theme }) =>
    active ? `2px solid ${theme.colors.info}` : "2px solid transparent"};
  &:hover {
    text-decoration: underline;
  }
`;

// --- Component ---
export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/",            label: "Dashboard" },
    { to: "/upload",      label: "Upload CSV" },
    { to: "/result",      label: "Results" },
    { to: "/analysis",    label: "Analysis" },
    { to: "/totalscan",   label: "Total Scan" },
    { to: "/history",     label: "Activity Log" },
  ];

  const adminLinks = [
    { to: "/admin-login",         label: "Admin Login" },
    { to: "/hidden-behaviour",    label: "Hidden Behav." },
    { to: "/fast-classification", label: "Fast Classif." },
    { to: "/malware-evaluation",  label: "Eval." },
    { to: "/user-management",     label: "Users" },
    { to: "/data-leakage",        label: "Data Leak" },
  ];

  return (
    <Nav>
      <Ul>
        {links.map((l) => (
          <Li key={l.to}>
            <SLink to={l.to} active={pathname === l.to ? 1 : 0}>
              {l.label}
            </SLink>
          </Li>
        ))}

        <Section>| Admin:</Section>

        {adminLinks.map((l) => (
          <Li key={l.to}>
            <SLink to={l.to} active={pathname === l.to ? 1 : 0}>
              {l.label}
            </SLink>
          </Li>
        ))}
      </Ul>
    </Nav>
  );
}
