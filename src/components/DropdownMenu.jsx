import { useState } from 'react';

const DropdownMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menú
      </button>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        {items.map((item, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;