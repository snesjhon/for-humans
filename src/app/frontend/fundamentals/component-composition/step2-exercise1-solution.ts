/**
 * @jest-environment jsdom
 */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const h = React.createElement;

interface PopoverContextValue {
  open: boolean;
  setOpen: (next: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
  const value = useContext(PopoverContext);
  if (!value) {
    throw new Error('Popover components must render inside PopoverRoot.');
  }
  return value;
}

function PopoverRoot({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return h(
    PopoverContext.Provider,
    { value: { open, setOpen } },
    children,
  );
}

function PopoverTrigger({ children }: { children?: ReactNode }) {
  const { setOpen } = usePopover();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setOpen(true),
    },
    children,
  );
}

function PopoverContent({ children }: { children?: ReactNode }) {
  const { open } = usePopover();
  if (!open) {
    return null;
  }

  return h('section', null, children);
}

function PopoverClose({ children }: { children?: ReactNode }) {
  const { setOpen } = usePopover();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setOpen(false),
    },
    children,
  );
}

test('trigger and content share the same root-owned popover state', () => {
  render(
    h(
      PopoverRoot,
      null,
      h(
        'div',
        null,
        h(PopoverTrigger, null, 'Open settings'),
      ),
      h(
        'div',
        null,
        h(
          PopoverContent,
          null,
          h('p', null, 'Danger zone'),
          h(PopoverClose, null, 'Dismiss'),
        ),
      ),
    ),
  );

  expect(screen.queryByText('Danger zone')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
  expect(screen.getByText('Danger zone')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  expect(screen.queryByText('Danger zone')).toBeNull();
});
