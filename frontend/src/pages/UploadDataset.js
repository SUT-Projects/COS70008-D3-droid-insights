// src/pages/UploadDataset.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import axios from 'axios';
import NavBar from '../components/Navbar';

// send all axios calls to FastAPI on port 8000 by default
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const Container = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  flex: 1;
`;

const Button = styled.button`
  background: #007acc;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.progress`
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.6rem;
    text-align: left;
  }

  th {
    background: #f0f0f0;
  }
`;

export default function UploadDataset() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');       // '', 'uploading', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');   // server or network error

  const handleFileChange = e => {
    const selected = e.target.files[0];
    setFile(selected);
    setStatus('');
    setErrorMsg('');
    setProgress(0);
    if (selected) {
      Papa.parse(selected, {
        header: true,
        skipEmptyLines: true,
        complete: results => setData(results.data)
      });
    } else {
      setData([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');
    const form = new FormData();
    form.append('file', file);

    try {
      await axios.post('/predict/csv', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: evt => {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        }
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setErrorMsg(detail || err.message);
      setStatus('error');
    }
  };

  return (
    <>
      <NavBar />

      <Container>
        <Title>Upload CSV Dataset</Title>

        <FormRow>
          <FileInput
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
          >
            {status === 'uploading' ? 'Uploading…' : 'Upload'}
          </Button>
        </FormRow>

        {status === 'uploading' && <ProgressBar value={progress} max="100" />}

        {status === 'success' && (
          <p style={{ color: 'green' }}>✅ File uploaded successfully!</p>
        )}

        {status === 'error' && (
          <p style={{ color: 'red' }}>
            ❌ Upload failed{errorMsg ? `: ${errorMsg}` : '.'}
          </p>
        )}
      </Container>

      {data.length > 0 && (
        <div style={{
          overflowX: "hidden",
          margin: "2rem",
          padding: "1rem",
          background: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h4>Preview (first 5 rows)</h4>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <Table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
