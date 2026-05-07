/**
 * @jest-environment jsdom
 */
import React, {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
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

// Goal: trigger and dismiss should share one root-owned state, and the
// viewport should render inside #toast-root through a portal.
// TODO: provide toast state from ToastRoot and portal ToastViewport into #toast-root.
function ToastRoot({ children }: { children?: ReactNode }) {
  return h(React.Fragment, null, children);
}

function ToastTrigger({ children }: { children?: ReactNode }) {
  void useToast();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
    },
    children,
  );
}

function ToastViewport({ children }: { children?: ReactNode }) {
  const { visible } = useToast();
  if (!visible) {
    return null;
  }

  return h('aside', { 'data-testid': 'inline-toast' }, children);
}

function ToastDismiss({ children }: { children?: ReactNode }) {
  void useToast();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
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
  expect(screen.queryByTestId('inline-toast')).toBeNull();

  fireEvent.click(within(toastRoot).getByRole('button', { name: 'Dismiss toast' }));
  expect(within(toastRoot).queryByText('Filter saved')).toBeNull();

  toastRoot.remove();
});
