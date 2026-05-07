/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const h = React.createElement;

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

interface FaqItemProps {
  item: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ item, isOpen, onToggle }: FaqItemProps) {
  return h(
    'li',
    null,
    h(
      'button',
      {
        type: 'button',
        onClick: onToggle,
      },
      item.question,
    ),
    isOpen ? h('p', null, item.answer) : null,
  );
}

function FaqList({ items }: { items: FaqEntry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return h(
    'ul',
    null,
    items.map((item) =>
      h(FaqItem, {
        key: item.id,
        item,
        isOpen: openId === item.id,
        onToggle: () => setOpenId((current) => (current === item.id ? null : item.id)),
      }),
    ),
  );
}

test('opening a second answer closes the first one', () => {
  render(
    h(FaqList, {
      items: [
        {
          id: 'shipping',
          question: 'How long does shipping take?',
          answer: 'Shipping takes 2 business days.',
        },
        {
          id: 'returns',
          question: 'Can I return sale items?',
          answer: 'Sale items can be returned within 14 days.',
        },
      ],
    }),
  );

  fireEvent.click(screen.getByRole('button', { name: 'How long does shipping take?' }));
  expect(screen.getByText('Shipping takes 2 business days.')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Can I return sale items?' }));

  expect(screen.queryByText('Shipping takes 2 business days.')).toBeNull();
  expect(screen.getByText('Sale items can be returned within 14 days.')).toBeTruthy();
});
