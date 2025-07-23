import React, { useRef, useState } from 'react';

export default function CanvasArea({
  shapes,
  selectedTool,
  onAddShape,
  onRemoveShape,
  onMoveStart,
  onMoveShape
}) {
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);

  const handleShapeMouseDown = (e, shape) => {
    e.stopPropagation();
    if (selectedTool !== 'pointer') return;

    onMoveStart();

    setDragState({
      id: shape.id,
      lastX: e.clientX,
      lastY: e.clientY
    });
  };

  const handleMouseMove = e => {
    if (!dragState) return;
    const dx = e.clientX - dragState.lastX;
    const dy = e.clientY - dragState.lastY;
    const shape = shapes.find(s => s.id === dragState.id);
    if (shape) {
      onMoveShape(shape.id, shape.x + dx, shape.y + dy);
      setDragState({
        id: dragState.id,
        lastX: e.clientX,
        lastY: e.clientY
      });
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  const handleClick = e => {
    if (e.target !== e.currentTarget) return;
    if (selectedTool === 'pointer') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;
    onAddShape(selectedTool, x, y);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = e => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData('shape');
    if (!shapeType) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;
    onAddShape(shapeType, x, y);
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {shapes.map(shape => {
        const base = {
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          cursor: selectedTool === 'pointer' ? 'move' : 'pointer'
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
            onMouseDown={e => handleShapeMouseDown(e, shape)}
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
