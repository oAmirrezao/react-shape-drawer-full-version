import React from 'react';

export default function Footer({ shapes }) {
  const counts = shapes.reduce(
    (acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    },
    { circle: 0, square: 0, triangle: 0 }
  );

  const types = ['circle', 'square', 'triangle'];
  const total = shapes.length;

  return (
    <footer className="footer">
      {types.map(type => (
        <div className="footer-item" key={type}>
          <div className={`shape-icon ${type}`}></div>
          <span className="count">{counts[type]}</span>
        </div>
      ))}

      <div className="footer-item total">
        <span className="count">{total}</span>
        <span className="count">Total</span>
      </div>
    </footer>
  );
}
