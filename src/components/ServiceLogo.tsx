import React, { useState } from 'react';
import { findService } from '../lib/services';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export const ServiceLogo: React.FC<Props> = ({ name, size = 36, className = '' }) => {
  const [srcIndex, setSrcIndex] = useState(0);
  const service = findService(name);
  const domain = service?.domain;
  const color = service?.color ?? '#3ce57e';
  const emoji = service?.emoji ?? '💳';

  // Try multiple logo sources in order
  const sources = domain
    ? [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        `https://logo.clearbit.com/${domain}`,
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      ]
    : [];

  const handleError = () => {
    setSrcIndex(prev => prev + 1);
  };

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: size * 0.5,
  };

  // Show real logo if we still have sources to try
  if (sources.length > 0 && srcIndex < sources.length) {
    return (
      <div
        style={{ ...baseStyle, background: '#fff', padding: Math.max(2, size * 0.08) }}
        className={className}
      >
        <img
          src={sources[srcIndex]}
          alt={name}
          onError={handleError}
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
        />
      </div>
    );
  }

  // Final fallback: colored circle with emoji
  return (
    <div
      style={{
        ...baseStyle,
        background: `${color}22`,
        border: `1.5px solid ${color}55`,
        color,
      }}
      className={className}
    >
      {emoji}
    </div>
  );
};
