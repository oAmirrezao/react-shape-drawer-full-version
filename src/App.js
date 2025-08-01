// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import Footer from './components/Footer';
import './App.css';

const API_URL    = 'http://localhost:5000';
const MAX_HISTORY = 20;

function App() {
  //── وضعیت نقاشی (محلی) ─────────────────────────
  const [title, setTitle] = useState(() => {
    return localStorage.getItem('paintingTitle') || '';
  });

  const [shapes, setShapes] = useState(() => {
    const saved = localStorage.getItem('shapes');
    return saved ? JSON.parse(saved) : [];
  });

  const [past, setPast]     = useState([]);
  const [future, setFuture] = useState([]);

  //── ابزار انتخابی و مرجع فایل ایمپورت ───────────
  const [selectedTool, setSelectedTool] = useState('pointer');
  const fileInputRef = useRef(null);

  //── وضعیت کاربر (برای Save/Load سرور) ─────────
  const [userId,   setUserId]   = useState(localStorage.getItem('userId'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  //── هم‌زمان‌سازی با localStorage ───────────────
  useEffect(() => {
    localStorage.setItem('paintingTitle', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  //── ثبت‌نام خودکار یا بازیابی کاربر ────────────
  useEffect(() => {
    if (!userId) {
      const name = prompt('لطفاً نام خود را وارد کنید:');
      if (!name) return alert('نام کاربری لازم است.');

      axios.post(`${API_URL}/users`, { name })
        .then(res => res.data)
        .then(data => {
          setUserId(data.id);
          setUserName(data.name);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userName', data.name);
        })
        .catch(err => {
          console.error(err);
          alert('خطا در ثبت‌نام کاربر');
        });
    }
  }, [userId]);

  //── تاریخچه (Undo/Redo) ─────────────────────────
  const pushToHistory = prevShapes => {
    setPast(p => {
      const next = [...p, prevShapes];
      return next.length > MAX_HISTORY ? next.slice(1) : next;
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

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(p => p.slice(0, p.length - 1));
    setFuture(f => [...f, shapes]);
    setShapes(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    setFuture(f => f.slice(0, f.length - 1));
    setPast(p => [...p, shapes]);
    setShapes(next);
  };

  //── Export / Import محلی ────────────────────────
  const handleExport = () => {
    const data = { title, shapes };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    let fileName = title.trim() === '' ? 'untitled' : title.trim();
    fileName = fileName
      .replace(/[\s\/\\:\*\?"<>\|]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!fileName) fileName = 'untitled';
    fileName += '.json';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
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
          alert('فرمت فایل صحیح نیست.');
        }
      } catch {
        alert('خطا در خواندن فایل.');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  //── Save to Server / Load from Server ───────────
  const saveToServer = () => {
    if (!userId) return alert('کاربر ثبت نشده.');
    axios.post(`${API_URL}/paintings/${userId}`, { title, shapes })
      .then(res => res.data)
      .then(json => alert(json.message || 'ذخیره شد.'))
      .catch(err => alert('خطا در ذخیره: ' + err.message));
  };

  const loadFromServer = () => {
    if (!userId) return alert('کاربر ثبت نشده.');
    axios.get(`${API_URL}/paintings/${userId}`)
      .then(res => res.data)
      .then(data => {
        setTitle(data.title);
        setShapes(data.shapes);
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        alert('خطا در بارگذاری: ' + msg);
      });
  };

  //── رندر UI ────────────────────────────────────
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
          <button className="btn" onClick={handleUndo} disabled={past.length === 0}>
            Undo
          </button>
          <button className="btn" onClick={handleRedo} disabled={future.length === 0}>
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

          {/* دکمه‌های Save/Load به سرور */}
          <button className="btn" onClick={saveToServer}>
            Save to Server
          </button>
          <button className="btn" onClick={loadFromServer}>
            Load from Server
          </button>
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
