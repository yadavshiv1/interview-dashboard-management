'use client'

import * as React from 'react';
import { SnackbarProvider as NotistackProvider, useSnackbar, VariantType } from 'notistack';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const CloseButton = ({ snackbarKey }: { snackbarKey: string | number }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => closeSnackbar(snackbarKey)}
    >
      <Close fontSize="small" />
    </IconButton>
  );
};

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  return (
    <NotistackProvider
      maxSnack={3}
      autoHideDuration={1000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={(snackbarKey) => <CloseButton snackbarKey={snackbarKey} />}
    >
      {children}
    </NotistackProvider>
  );
};