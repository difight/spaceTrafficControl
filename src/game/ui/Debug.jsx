import React from 'react';
import PropTypes from 'prop-types';
import { useDebug } from './DebugProvider';

const Debug = () => {
  const { debugInfo } = useDebug();

  // Если нет данных для отображения, ничего не рендерим
  if (debugInfo.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Debug Information</h3>
      {debugInfo.map(({ id, label, data, timestamp }) => (
        <div key={id} style={styles.entry}>
          <strong style={styles.label}>{label}:</strong>
          <pre style={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
          <small style={styles.timestamp}>{timestamp}</small>
        </div>
      ))}
    </div>
  );
};

// Стили для компонента
const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    margin: '10px 0',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#333',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  entry: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#007bff',
  },
  pre: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    margin: 0,
  },
  timestamp: {
    display: 'block',
    marginTop: '5px',
    color: '#6c757d',
    fontSize: '12px',
  },
};

export default Debug;