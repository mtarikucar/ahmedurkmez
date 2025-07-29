'use client';

import { useState, useCallback } from 'react';
import Modal, { ModalType } from '@/components/ui/Modal';

interface NotificationState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const initialState: NotificationState = {
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
};

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>(initialState);

  const showNotification = useCallback((
    type: ModalType,
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void;
      showCancel?: boolean;
    }
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      onConfirm: options?.onConfirm,
      showCancel: options?.showCancel || false,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(initialState);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showNotification('success', title, message, { onConfirm });
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showNotification('error', title, message, { onConfirm });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, options?: {
    onConfirm?: () => void;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
  }) => {
    showNotification('warning', title, message, options);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showNotification('info', title, message, { onConfirm });
  }, [showNotification]);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    showNotification('warning', title, message, {
      onConfirm,
      showCancel: true,
      confirmText: options?.confirmText || 'Evet',
      cancelText: options?.cancelText || 'Hayır',
    });
  }, [showNotification]);

  const NotificationComponent = () => (
    <Modal
      isOpen={notification.isOpen}
      onClose={hideNotification}
      type={notification.type}
      title={notification.title}
      message={notification.message}
      confirmText={notification.confirmText}
      cancelText={notification.cancelText}
      onConfirm={notification.onConfirm}
      showCancel={notification.showCancel}
    />
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideNotification,
    NotificationComponent,
  };
}
