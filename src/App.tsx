import React, { useState } from 'react';
import { Play, Settings, ChevronRight, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type DataRow, handleMissingValues, minMaxNormalize, discretizeEqualWidth } from './utils/preprocessing';
import { buildID3Tree, type TreeNode } from './utils/id3-core';
import { weatherData, titanicSample } from './utils/sample-data';
import TreeVisualizer from './components/TreeVisualizer';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>(weatherData);
  const [targetAttr, setTargetAttr] = useState('Play');
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [activeTab, setActiveTab] = useState<'data' | 'tree'>('data');
  const [preprocessingLog, setPreprocessingLog] = useState<string[]>([]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const categoricalAttrs = columns.filter(col => col !== targetAttr);

  const handlePreprocessing = (type: string) => {
    let newData = [...data];
    let logMsg = "";

    switch (type) {
      case 'missing':
        newData = handleMissingValues(newData, 'mode');
        logMsg = "Filled missing values using Mode imputation.";
        break;
      case 'minmax':
        const numericCols = columns.filter(col => typeof data[0][col] === 'number');
        newData = minMaxNormalize(newData, numericCols);
        logMsg = `Normalized numeric columns using Min-Max.`;
        break;
      case 'binning':
        if (columns.includes('Age')) {
           newData = discretizeEqualWidth(newData, 'Age', 3);
           logMsg = "Discretized 'Age' into 3 equal-width bins.";
        }
        break;
    }
    setData(newData);
    setPreprocessingLog(prev => [...prev, logMsg]);
  };

  const trainModel = () => {
    const newTree = buildID3Tree(data, targetAttr, categoricalAttrs);
    setTree(newTree);
    setActiveTab('tree');
  };

  return (
    <div className="app-container">
      <header>
        <div className="brand">
          <div className="logo-box">
            <Activity color="white" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>ID3 Visual Explorer</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Iterative Dichotomiser 3 • Data Mining</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => { setData(weatherData); setTargetAttr('Play'); setTree(null); }} className={`btn-tab ${data === weatherData ? 'active' : ''}`}>Weather</button>
          <button onClick={() => { setData(titanicSample); setTargetAttr('Survived'); setTree(null); }} className={`btn-tab ${data === titanicSample ? 'active' : ''}`}>Titanic</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside>
          <div className="glass-card">
            <h3 className="section-title" style={{ color: 'var(--primary)' }}>
              <Settings size={18} /> Configuration
            </h3>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>TARGET ATTRIBUTE</label>
            <select value={targetAttr} onChange={(e) => setTargetAttr(e.target.value)} className="input-field">
              {columns.map(col => <option key={col}>{col}</option>)}
            </select>
            <button onClick={trainModel} className="btn-primary">
              <Play size={18} /> Build Model
            </button>
          </div>

          <div className="glass-card">
            <h3 className="section-title" style={{ color: 'var(--emerald)' }}>
              <Cpu size={18} /> Preprocessing
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button disabled={tree !== null} onClick={() => handlePreprocessing('missing')} className="btn-tab" style={{ width: '100%', textAlign: 'left' }}>Clean Missing Data</button>
              <button disabled={tree !== null} onClick={() => handlePreprocessing('minmax')} className="btn-tab" style={{ width: '100%', textAlign: 'left' }}>Normalization</button>
              <button disabled={tree !== null} onClick={() => handlePreprocessing('binning')} className="btn-tab" style={{ width: '100%', textAlign: 'left' }}>Discretization</button>
            </div>
          </div>

          <div className="glass-card" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem' }}>ACTIVITY LOG</h3>
            <ul className="log-list">
              {preprocessingLog.map((log, i) => (
                <li key={i} className="log-item">
                  <ChevronRight size={12} style={{ color: 'var(--primary)', marginTop: '2px' }} /> {log}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '1rem', width: 'fit-content' }}>
            <button onClick={() => setActiveTab('data')} className={`btn-tab ${activeTab === 'data' ? 'active' : ''}`}>Raw Data</button>
            <button onClick={() => setActiveTab('tree')} className={`btn-tab ${activeTab === 'tree' ? 'active' : ''}`}>Decision Tree</button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'data' ? (
              <motion.div key="data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card" style={{ padding: 0 }}>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i}>
                          {columns.map(col => (
                            <td key={col}>
                              {row[col] === null || row[col] === undefined ? <span style={{ color: '#f87171' }}>null</span> : 
                                col === targetAttr ? <span className={`badge ${row[col] === 'Yes' || row[col] === 1 ? 'badge-yes' : 'badge-no'}`}>{row[col]}</span> : 
                                typeof row[col] === 'number' ? row[col].toFixed(1) : String(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div key="tree" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                {tree ? <TreeVisualizer tree={tree} targetAttr={targetAttr} key={targetAttr} /> : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Play size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>Build the model to visualize the decision tree</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
