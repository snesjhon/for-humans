/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';

const h = React.createElement;

interface DocTab {
  id: string;
  label: string;
  body: string;
}

interface TabListProps {
  tabs: DocTab[];
  activeId: string;
  onSelect: (id: string) => void;
}

function TabList({ tabs, activeId, onSelect }: TabListProps) {
  return h(
    'div',
    null,
    tabs.map((tab) =>
      h(
        'button',
        {
          key: tab.id,
          type: 'button',
          'aria-pressed': activeId === tab.id,
          onClick: () => onSelect(tab.id),
        },
        tab.label,
      ),
    ),
  );
}

function TabPanel({ tab }: { tab: DocTab }) {
  return h('article', null, h('h2', null, tab.label), h('p', null, tab.body));
}

function DocumentTabs({ tabs }: { tabs: DocTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '');
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return h(
    'section',
    null,
    h(TabList, { tabs, activeId, onSelect: setActiveId }),
    h(TabPanel, { tab: activeTab }),
  );
}

test('clicking a tab updates the preview panel', () => {
  render(
    h(DocumentTabs, {
      tabs: [
        { id: 'overview', label: 'Overview', body: 'Release checklist and project context.' },
        { id: 'api', label: 'API', body: 'HTTP contract and response examples.' },
      ],
    }),
  );

  fireEvent.click(screen.getByRole('button', { name: 'API' }));

  expect(screen.getByRole('heading', { name: 'API' })).toBeTruthy();
  expect(screen.getByText('HTTP contract and response examples.')).toBeTruthy();
});
