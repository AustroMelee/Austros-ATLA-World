import React from 'react';
import { darkTheme } from './darkTheme.css';
import { themeContract } from './theme.contract.css';

const themeColors = [
  { name: 'Primary', varName: themeContract.primaryColor },
  { name: 'Border', varName: themeContract.borderColor },
  { name: 'Water Nation', varName: themeContract.nationWater },
  { name: 'Earth Nation', varName: themeContract.nationEarth },
  { name: 'Fire Nation', varName: themeContract.nationFire },
  { name: 'Air Nation', varName: themeContract.nationAir },
  { name: 'Neutral', varName: themeContract.neutral },
];

function ThemeSwatches() {
  React.useEffect(() => {
    document.body.classList.add(darkTheme);
    return () => document.body.classList.remove(darkTheme);
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {themeColors.map(({ name, varName }) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: `var(${varName})`,
              border: '2px solid var(--borderColor, #2d3748)',
              borderRadius: 8,
              marginBottom: 8,
            }}
            aria-label={name}
          />
          <div>{name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{varName}</div>
        </div>
      ))}
    </div>
  );
}

export default {
  title: 'Theme/Colors',
  component: ThemeSwatches,
};

export const Colors = () => <ThemeSwatches />;
