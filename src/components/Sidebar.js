import React from 'react';

const tools = ['pointer', 'circle', 'square', 'triangle'];

export default function Sidebar({ selectedTool, onSelectTool }) {
  return (
    <aside className="sidebar">
      {tools.map(tool => (
        <div
          key={tool}
          className={`tool ${tool} ${selectedTool === tool ? 'active' : ''}`}
          onClick={() => onSelectTool(tool)}
          draggable={tool !== 'pointer'}
          onDragStart={e => {
            if (tool !== 'pointer') {
              e.dataTransfer.setData('shape', tool);
            }
          }}
        />
      ))}
    </aside>
  );
}
