import React from 'react';

export default function Header({ title, onTitleChange, onExport, onImportClick }) {
  return (
    <header className="header">
      <input
        className="title-input"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
      />
      <div className="header-buttons">
        <button onClick={onExport}>Export</button>
        <button onClick={onImportClick}>Import</button>
      </div>
    </header>
  );
}
