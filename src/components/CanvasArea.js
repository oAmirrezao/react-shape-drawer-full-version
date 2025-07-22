import React, { useRef } from 'react';

export default function CanvasArea({
  shapes,
  selectedTool,
  onAddShape,
  onRemoveShape
}) {
  const canvasRef = useRef();

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = e => {
    e.preventDefault();
    // if (selectedTool === 'pointer') return;

    const shapeType = e.dataTransfer.getData('shape');
    if (!shapeType) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;

    onAddShape(shapeType, x, y);
  };

  const handleClick = e => {
    if (e.target !== e.currentTarget) return;
    if (selectedTool === 'pointer') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;

    onAddShape(selectedTool, x, y);
  };

  return (
    <div
      className="canvas"
      ref={canvasRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ position: 'relative' }}
    >
      {shapes.map(shape => {
        const base = {
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          cursor: 'pointer'
        };
        let style = {};

        switch (shape.type) {
          case 'circle':
            style = {
              ...base,
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: '#87ceeb'
            };
            break;
          case 'square':
            style = {
              ...base,
              width: 50,
              height: 50,
              backgroundColor: '#ffa07a'
            };
            break;
          case 'triangle':
            style = {
              ...base,
              width: 0,
              height: 0,
              borderLeft: '25px solid transparent',
              borderRight: '25px solid transparent',
              borderBottom: '50px solid #90ee90'
            };
            break;
          default:
            style = base;
        }

        return (
          <div
            key={shape.id}
            style={style}
            onDoubleClick={e => {
              e.stopPropagation();
              onRemoveShape(shape.id);
            }}
          />
        );
      })}
    </div>
  );
}
