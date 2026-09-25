import React, { useState, useEffect } from 'react';

function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLight]);

  return (
    <button
      className="btn btn-sm"
      onClick={() => setIsLight(!isLight)}
    >
      {isLight ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
    </button>
  );
}

export default ThemeToggle;