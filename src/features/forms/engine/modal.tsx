'use client';

import { useCallback, type SyntheticEvent } from 'react';
import { boolean, define, event, oneOf, string } from '@react-form-builder/core';
import { Modal, type ModalProps } from 'rsuite';
import 'rsuite/Modal/styles/index.css';
import styles from './modal.module.css';

interface RsModalProps extends ModalProps {
  handleClose?: () => void;
}

/** FormEngine owns modal state; RSuite supplies its standard dialog behavior. */
function RsModal({ children, handleClose, onClose, className, ...props }: RsModalProps) {
  const close = useCallback(
    (event: SyntheticEvent) => {
      handleClose?.();
      onClose?.(event);
    },
    [handleClose, onClose],
  );

  return (
    <Modal
      {...props}
      className={[className, props.size !== 'full' && !props.full ? styles.centered : undefined]
        .filter(Boolean)
        .join(' ')}
      onClose={close}
    >
      {children}
    </Modal>
  );
}

// Keep the standard type/props so native Modal settings and actions round-trip.
export const rsModal = define(RsModal, 'RsModal')
  .name('مودال RSuite')
  .props({
    autoFocus: boolean.default(true).named('فوکوس خودکار'),
    backdrop: boolean.default(true).named('پس‌زمینه'),
    backdropClassName: string.named('کلاس پس‌زمینه'),
    classPrefix: string.named('پیشوند کلاس'),
    dialogClassName: string.named('کلاس پنجره'),
    enforceFocus: boolean.default(true).named('حفظ فوکوس در مودال'),
    keyboard: boolean.default(true).named('بستن با Escape'),
    overflow: boolean.default(true).named('تنظیم ارتفاع محتوا'),
    size: oneOf('xs', 'sm', 'md', 'lg', 'full')
      .labeled('خیلی کوچک', 'کوچک', 'متوسط', 'بزرگ', 'تمام‌صفحه')
      .default('md')
      .named('اندازه'),
    onOpen: event.named('هنگام باز شدن'),
    onClose: event.named('هنگام بسته شدن'),
  })
  .componentRole('modal')
  .hideFromComponentPalette();
