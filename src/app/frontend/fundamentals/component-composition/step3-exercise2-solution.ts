/**
 * @jest-environment jsdom
 */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';

const h = React.createElement;

interface ToastContextValue {
  visible: boolean;
  setVisible: (next: boolean) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('Toast parts must render inside ToastRoot.');
  }
  return value;
}

function ToastRoot({ children }: { children?: ReactNode }) {
  const [visible, setVisible] = useState(false);

  return h(
    ToastContext.Provider,
    { value: { visible, setVisible } },
    children,
  );
}

function ToastTrigger({ children }: { children?: ReactNode }) {
  const { setVisible } = useToast();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setVisible(true),
    },
    children,
  );
}

function ToastViewport({ children }: { children?: ReactNode }) {
  const { visible } = useToast();
  const toastRoot = document.getElementById('toast-root');

  if (!visible || !toastRoot) {
    return null;
  }

  return createPortal(h('aside', null, children), toastRoot);
}

function ToastDismiss({ children }: { children?: ReactNode }) {
  const { setVisible } = useToast();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setVisible(false),
    },
    children,
  );
}

test('toast trigger and dismiss collaborate through a portal-backed root', () => {
  const toastRoot = document.createElement('div');
  toastRoot.id = 'toast-root';
  document.body.appendChild(toastRoot);

  render(
    h(
      ToastRoot,
      null,
      h('header', null, h(ToastTrigger, null, 'Show toast')),
      h(
        ToastViewport,
        null,
        h('p', null, 'Filter saved'),
        h(ToastDismiss, null, 'Dismiss toast'),
      ),
    ),
  );

  fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));

  expect(within(toastRoot).getByText('Filter saved')).toBeTruthy();

  fireEvent.click(within(toastRoot).getByRole('button', { name: 'Dismiss toast' }));
  expect(within(toastRoot).queryByText('Filter saved')).toBeNull();

  toastRoot.remove();
});
