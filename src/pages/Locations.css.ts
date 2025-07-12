import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: 800,
  margin: '0 auto',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const title = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '1.5rem',
});

export const body = style({
  color: '#666',
  marginTop: '2rem',
  textAlign: 'center',
}); 