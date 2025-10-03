import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export type NotificationVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = useCallback((
    message: string,
    variant: NotificationVariant = 'default',
    options?: any
  ) => {
    enqueueSnackbar(message, {
      variant,
      autoHideDuration: variant === 'error' ? 2000 : 1000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      ...options,
    });
  }, [enqueueSnackbar]);

  const showSuccess = useCallback((message: string, options?: any) => {
    showNotification(message, 'success', options);
  }, [showNotification]);

  const showError = useCallback((message: string, options?: any) => {
    showNotification(message, 'error', options);
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: any) => {
    showNotification(message, 'warning', options);
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: any) => {
    showNotification(message, 'info', options);
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeSnackbar,
  };
};