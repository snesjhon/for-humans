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

interface DialogContextValue {
  open: boolean;
  setOpen: (next: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog() {
  const value = useContext(DialogContext);
  if (!value) {
    throw new Error('Dialog parts must render inside DialogRoot.');
  }
  return value;
}

function DialogRoot({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return h(
    DialogContext.Provider,
    { value: { open, setOpen } },
    children,
  );
}

function DialogTrigger({ children }: { children?: ReactNode }) {
  const { setOpen } = useDialog();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setOpen(true),
    },
    children,
  );
}

function DialogPortal({ children }: { children?: ReactNode }) {
  const { open } = useDialog();
  const modalRoot = document.getElementById('modal-root');

  if (!open || !modalRoot) {
    return null;
  }

  return createPortal(h('section', null, children), modalRoot);
}

function DialogClose({ children }: { children?: ReactNode }) {
  const { setOpen } = useDialog();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setOpen(false),
    },
    children,
  );
}

test('dialog content renders through #modal-root and closes from inside the portal', () => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);

  render(
    h(
      DialogRoot,
      null,
      h(DialogTrigger, null, 'Open dialog'),
      h(
        DialogPortal,
        null,
        h('p', null, 'Review device details'),
        h(DialogClose, null, 'Close dialog'),
      ),
    ),
  );

  fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

  expect(within(modalRoot).getByText('Review device details')).toBeTruthy();
  expect(screen.queryByText('Review device details')).toBeTruthy();

  fireEvent.click(within(modalRoot).getByRole('button', { name: 'Close dialog' }));
  expect(within(modalRoot).queryByText('Review device details')).toBeNull();

  modalRoot.remove();
});
