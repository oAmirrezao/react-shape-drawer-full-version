import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import './App.css';

function App() {
  const [title, setTitle] = useState(() => {
    return localStorage.getItem('paintingTitle') || '';
  });

  const [shapes, setShapes] = useState(() => {
    const saved = localStorage.getItem('shapes');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTool, setSelectedTool] = useState('pointer');

  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('paintingTitle', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  const handleAddShape = (shapeType, x = 50, y = 50) => {
    const newShape = {
      id: Date.now(),
      type: shapeType,
      x,
      y
    };
    setShapes(prev => [...prev, newShape]);
  };

  const handleRemoveShape = id => {
    setShapes(prev => prev.filter(s => s.id !== id));
  };

  const handleExport = () => {
    const data = { title, shapes };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    let fileName = title.trim() === '' ? 'untitled' : title.trim();

    fileName = fileName
      .replace(/[\s\/\\:\*\?"<>\|]+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (fileName === '') {
      fileName = 'untitled';
    }
    fileName += '.json';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (
          typeof data.title === 'string' &&
          Array.isArray(data.shapes)
        ) {
          setTitle(data.title);
          setShapes(data.shapes);
        } else {
          alert('File format is incorrect.');
        }
      } catch (err) {
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
        />
      </div>

      <footer className="footer">
        <div className="footer-item">
          <span className="shape-icon circle" />
          <span className="count">
            {shapes.filter(s => s.type === 'circle').length}
          </span>
        </div>
        <div className="footer-item">
          <span className="shape-icon square" />
          <span className="count">
            {shapes.filter(s => s.type === 'square').length}
          </span>
        </div>
        <div className="footer-item">
          <span className="shape-icon triangle" />
          <span className="count">
            {shapes.filter(s => s.type === 'triangle').length}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
