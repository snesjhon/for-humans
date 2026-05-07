/**
 * @jest-environment jsdom
 */
import React, {
  createContext,
  useContext,
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

// Goal: the root should own open state so trigger, content, and close
// can collaborate even when wrappers separate them in the JSX tree.
// TODO: create the shared state here and provide it through PopoverContext.
function PopoverRoot({ children }: { children?: ReactNode }) {
  return h(React.Fragment, null, children);
}

function PopoverTrigger({ children }: { children?: ReactNode }) {
  void usePopover();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
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
  void usePopover();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
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
