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

// Goal: root owns open state, and the dialog body must render inside #modal-root.
// TODO: provide dialog state from DialogRoot and portal DialogPortal into #modal-root.
function DialogRoot({ children }: { children?: ReactNode }) {
  return h(React.Fragment, null, children);
}

function DialogTrigger({ children }: { children?: ReactNode }) {
  void useDialog();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
    },
    children,
  );
}

function DialogPortal({ children }: { children?: ReactNode }) {
  const { open } = useDialog();
  if (!open) {
    return null;
  }

  return h('section', { 'data-testid': 'inline-dialog' }, children);
}

function DialogClose({ children }: { children?: ReactNode }) {
  void useDialog();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
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
  expect(screen.queryByTestId('inline-dialog')).toBeNull();

  fireEvent.click(within(modalRoot).getByRole('button', { name: 'Close dialog' }));
  expect(within(modalRoot).queryByText('Review device details')).toBeNull();

  modalRoot.remove();
});
