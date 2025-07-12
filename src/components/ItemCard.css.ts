import { style } from '@vanilla-extract/css';
import { vars } from '../styles/tokens.css';

export const card = style({
  background: 'white',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.spacing.md,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'box-shadow .2s',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing.sm,
  textDecoration: 'none', // For Link component
  color: 'inherit', // For Link component
  ':hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    borderColor: vars.color.accent,
  },
});
export const title = style({
  fontWeight: 700,
  fontSize: '1.25rem',
  marginBottom: vars.spacing.sm,
});
export const tags = style({
  display: 'flex',
  gap: vars.spacing.sm,
  flexWrap: 'wrap',
});

export const expansion = style({
  marginTop: vars.spacing.md,
  background: '#f9f9ff',
  borderRadius: vars.radius.sm,
  padding: vars.spacing.md,
  fontSize: '1rem',
});

export const expandBtn = style({
  marginTop: vars.spacing.sm,
  alignSelf: 'flex-end',
  background: vars.color.accent,
  color: 'white',
  border: 'none',
  borderRadius: vars.radius.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'background .2s',
  ':hover': {
    background: '#2a4d8f', // fallback hover color
  },
});

export const cardExpanded = style([
  card,
  {
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    zIndex: 2,
    position: 'relative',
    transform: 'scale(1.04)',
    minHeight: '24rem', // 3x typical collapsed height
    minWidth: '32rem',  // ensure enough width for expanded content
    maxWidth: '90vw',
    fontSize: '1.1rem',
  },
]);
