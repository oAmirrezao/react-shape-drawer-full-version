import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import Footer from './components/Footer';
import './App.css';

const MAX_HISTORY = 20;

function App() {
  const [title, setTitle] = useState(() => {
    return localStorage.getItem('paintingTitle') || '';
  });

  const [shapes, setShapes] = useState(() => {
    const saved = localStorage.getItem('shapes');
    return saved ? JSON.parse(saved) : [];
  });

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const [selectedTool, setSelectedTool] = useState('pointer');
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('paintingTitle', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  const pushToHistory = prevShapes => {
    setPast(p => {
      const next = [...p, prevShapes];
      if (next.length > MAX_HISTORY) {
        return next.slice(1);
      }
      return next;
    });
  };

  const handleAddShape = (shapeType, x = 50, y = 50) => {
    pushToHistory(shapes);
    setFuture([]);
    const newShape = { id: Date.now(), type: shapeType, x, y };
    setShapes(prev => [...prev, newShape]);
  };

  const handleRemoveShape = id => {
    pushToHistory(shapes);
    setFuture([]);
    setShapes(prev => prev.filter(s => s.id !== id));
  };

  const handleMoveStart = () => {
    pushToHistory(shapes);
    setFuture([]);
  };

  const handleMoveShape = (id, newX, newY) => {
    setShapes(prev =>
      prev.map(s => (s.id === id ? { ...s, x: newX, y: newY } : s))
    );
  };

  // Undo
  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(p => p.slice(0, p.length - 1));
    setFuture(f => [...f, shapes]);
    setShapes(previous);
  };

  // Redo
  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    setFuture(f => f.slice(0, f.length - 1));
    setPast(p => [...p, shapes]);
    setShapes(next);
  };

  // Export
  const handleExport = () => {
    const data = { title, shapes };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    let fileName = title.trim() === '' ? 'untitled' : title.trim();
    fileName = fileName
      .replace(/[\s\/\\:\*\?"<>\|]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (fileName === '') fileName = 'untitled';
    fileName += '.json';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (typeof data.title === 'string' && Array.isArray(data.shapes)) {
          setTitle(data.title);
          setPast([]);
          setFuture([]);
          setShapes(data.shapes);
        } else {
          alert('File format is incorrect.');
        }
      } catch {
        alert('File read was unsuccessful.');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="App">
      <header className="header">
        <input
          className="title-input"
          placeholder="Painting Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="header-buttons">
          <button
            className="btn"
            onClick={handleUndo}
            disabled={past.length === 0}
          >
            Undo
          </button>
          <button
            className="btn"
            onClick={handleRedo}
            disabled={future.length === 0}
          >
            Redo
          </button>
          <button className="btn" onClick={handleExport}>
            Export
          </button>
          <button className="btn" onClick={handleImportClick}>
            Import
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </header>

      <div className="main-content">
        <Sidebar
          selectedTool={selectedTool}
          onSelectTool={tool => setSelectedTool(tool)}
        />

        <CanvasArea
          shapes={shapes}
          selectedTool={selectedTool}
          onAddShape={handleAddShape}
          onRemoveShape={handleRemoveShape}
          onMoveStart={handleMoveStart}
          onMoveShape={handleMoveShape}
        />
      </div>

      <Footer shapes={shapes} />
    </div>
  );
}

export default App;
