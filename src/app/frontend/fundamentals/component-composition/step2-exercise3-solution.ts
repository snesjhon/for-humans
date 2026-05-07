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

interface AccordionContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

interface AccordionItemContextValue {
  itemId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordion() {
  const value = useContext(AccordionContext);
  if (!value) {
    throw new Error('Accordion components must render inside AccordionRoot.');
  }
  return value;
}

function useAccordionItem() {
  const value = useContext(AccordionItemContext);
  if (!value) {
    throw new Error('Accordion item parts must render inside AccordionItem.');
  }
  return value;
}

function AccordionRoot({ children }: { children?: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return h(
    AccordionContext.Provider,
    { value: { openId, setOpenId } },
    children,
  );
}

function AccordionItem({ itemId, children }: { itemId: string; children?: ReactNode }) {
  return h(
    AccordionItemContext.Provider,
    { value: { itemId } },
    children,
  );
}

function AccordionTrigger({ children }: { children?: ReactNode }) {
  const { itemId } = useAccordionItem();
  const { openId, setOpenId } = useAccordion();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => setOpenId(openId === itemId ? null : itemId),
    },
    children,
  );
}

function AccordionPanel({ children }: { children?: ReactNode }) {
  const { itemId } = useAccordionItem();
  const { openId } = useAccordion();

  if (openId !== itemId) {
    return null;
  }

  return h('p', null, children);
}

test('only the selected accordion item renders its panel', () => {
  render(
    h(
      AccordionRoot,
      null,
      h(
        AccordionItem,
        { itemId: 'shipping' },
        h(AccordionTrigger, null, 'Shipping'),
        h(AccordionPanel, null, 'Ships in two business days.'),
      ),
      h(
        AccordionItem,
        { itemId: 'returns' },
        h(AccordionTrigger, null, 'Returns'),
        h(AccordionPanel, null, 'Returns close after fourteen days.'),
      ),
    ),
  );

  expect(screen.queryByText('Ships in two business days.')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));
  expect(screen.getByText('Ships in two business days.')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Returns' }));
  expect(screen.queryByText('Ships in two business days.')).toBeNull();
  expect(screen.getByText('Returns close after fourteen days.')).toBeTruthy();
});
