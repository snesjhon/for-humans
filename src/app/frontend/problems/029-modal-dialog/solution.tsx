/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { createPortal } from 'react-dom';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// Goal: render a portal-based modal that controls its own visibility, dismisses on backdrop click, and mounts into document.body regardless of where <Modal> sits in the component tree.
export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ---Tests
test('renders nothing when isOpen is false', () => {
  render(
    <Modal isOpen={false} onClose={() => {}}>
      <p>content</p>
    </Modal>,
  );

  expect(screen.queryByRole('dialog')).toBeNull();
});

test('renders the dialog when isOpen is true', () => {
  render(
    <Modal isOpen={true} onClose={() => {}}>
      <p>content</p>
    </Modal>,
  );

  expect(screen.getByRole('dialog')).not.toBeNull();
});

test('renders children inside the dialog', () => {
  render(
    <Modal isOpen={true} onClose={() => {}}>
      <p>hello</p>
    </Modal>,
  );

  expect(screen.getByRole('dialog').textContent).toContain('hello');
});

test('calls onClose when the backdrop is clicked', () => {
  const onClose = jest.fn();
  render(
    <Modal isOpen={true} onClose={onClose}>
      <p>content</p>
    </Modal>,
  );

  const backdrop = screen.getByRole('dialog').parentElement!;
  fireEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('the dialog overlay is a direct child of document.body when the portal is active', () => {
  render(
    <Modal isOpen={true} onClose={() => {}}>
      <p>content</p>
    </Modal>,
  );

  const dialog = screen.getByRole('dialog');
  expect(dialog.parentElement?.parentElement).toBe(document.body);
});
// ---End Tests
