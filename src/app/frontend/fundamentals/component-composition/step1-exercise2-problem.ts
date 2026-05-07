/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const h = React.createElement;

interface DocTab {
  id: string;
  label: string;
  body: string;
}

function TabList({ tabs }: { tabs: DocTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '');

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
          onClick: () => setActiveId(tab.id),
        },
        tab.label,
      ),
    ),
  );
}

function TabPanel({ tab }: { tab: DocTab }) {
  return h('article', null, h('h2', null, tab.label), h('p', null, tab.body));
}

// Goal: the buttons and the panel should read the same active tab.
// TODO: lift the activeId state to DocumentTabs and make TabList controlled.
function DocumentTabs({ tabs }: { tabs: DocTab[] }) {
  return h(
    'section',
    null,
    h(TabList, { tabs }),
    h(TabPanel, { tab: tabs[0] }),
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
