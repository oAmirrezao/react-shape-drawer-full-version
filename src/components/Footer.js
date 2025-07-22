// src/components/Footer.js
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

  return (
    <footer className="footer">
      {types.map(type => (
        <div className="footer-item" key={type}>
          <div className={`shape-icon ${type}`}></div>
          <span className="count">{counts[type]}</span>
        </div>
      ))}
    </footer>
  );
}
