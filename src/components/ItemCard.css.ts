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
