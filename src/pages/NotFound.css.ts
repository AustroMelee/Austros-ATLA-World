import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: 600,
  margin: '0 auto',
  padding: '2rem',
  textAlign: 'center',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '1.5rem',
});

export const message = style({
  fontSize: '1.2rem',
  marginBottom: '2rem',
  color: '#666',
});

export const link = style({
  display: 'inline-block',
  padding: '0.75rem 2rem',
  borderRadius: 8,
  background: '#2563eb',
  color: '#fff',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'background 0.2s',
  ':hover': {
    background: '#1d4ed8',
  },
}); 