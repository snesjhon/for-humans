/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// Goal: render a controlled modal — return null when closed, show children in a role="dialog" element when open, and call onClose when the backdrop is clicked.
export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
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
// ---End Tests
