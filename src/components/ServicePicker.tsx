import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { SERVICES, type ServiceEntry } from '../lib/services';
import { ServiceLogo } from './ServiceLogo';

interface Props {
  value: string;
  onChange: (name: string) => void;
}

export const ServicePicker: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? SERVICES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      )
    : SERVICES;

  // Group by category
  const groups: Record<string, ServiceEntry[]> = {};
  filtered.forEach(s => {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push(s);
  });

  const selected = SERVICES.find(s => s.name === value);

  const handleOpen = () => {
    setOpen(true);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelect = (svc: ServiceEntry) => {
    onChange(svc.name);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="service-picker">
      {/* Trigger */}
      <button type="button" className="service-trigger" onClick={handleOpen}>
        {selected ? (
          <>
            <ServiceLogo name={selected.name} size={26} />
            <span className="service-name">{selected.name}</span>
            <span className="service-category-badge">{selected.category}</span>
            <X size={14} className="service-clear" onClick={handleClear} />
          </>
        ) : (
          <>
            <Search size={16} className="service-search-icon" />
            <span className="service-placeholder">Buscar servicio...</span>
            <ChevronDown size={16} className="service-chevron" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="service-dropdown">
          {/* Search input inside dropdown */}
          <div className="service-search-box">
            <Search size={15} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por nombre o categoría..."
              className="service-search-input"
              autoComplete="off"
            />
            {query && <button type="button" onClick={() => setQuery('')}><X size={14} /></button>}
          </div>

          <div className="service-list">
            {Object.entries(groups).map(([category, items]) => (
              <div key={category}>
                <div className="service-group-label">{category}</div>
                {items.map(svc => (
                  <button
                    key={svc.name}
                    type="button"
                    className={`service-option ${value === svc.name ? 'selected' : ''}`}
                    onClick={() => handleSelect(svc)}
                  >
                    <ServiceLogo name={svc.name} size={24} />
                    <span>{svc.name}</span>
                    {value === svc.name && <span className="service-check">✓</span>}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="service-empty">
                Sin resultados. Puedes escribirlo directamente.
              </div>
            )}
          </div>

          {/* Custom entry */}
          <div className="service-custom-entry">
            <input
              type="text"
              placeholder="O escribe un nombre personalizado..."
              className="service-custom-input"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) { onChange(val); setOpen(false); }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
