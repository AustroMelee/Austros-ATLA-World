import { style } from '@vanilla-extract/css';
import { vars } from '../styles/themes/lightTheme.css';

export const searchBar = style({
  display: 'flex',
  alignItems: 'center',
  padding: vars.spacing.sm,
  background: vars.colors.primarySoft,
  borderRadius: vars.radius.md,
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  gap: vars.spacing.sm,
});
export const input = style({
  flex: 1,
  padding: vars.spacing.sm,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.sm,
  fontSize: '1rem',
  outline: 'none',
});
export const button = style({
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  border: 0,
  borderRadius: vars.radius.sm,
  background: vars.colors.accent,
  color: vars.colors.onPrimary,
  fontWeight: 600,
  cursor: 'pointer',
});
