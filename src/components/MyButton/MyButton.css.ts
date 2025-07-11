import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/themes/lightTheme.css';

export const button = style({
  background: vars.colors.primary,
  color: vars.colors.onPrimary,
  border: 'none',
  borderRadius: '8px',
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.2s',
  selectors: {
    '&:hover': {
      background: vars.colors.accent,
    },
    '&:active': {
      background: vars.colors.primary,
    },
  },
});
