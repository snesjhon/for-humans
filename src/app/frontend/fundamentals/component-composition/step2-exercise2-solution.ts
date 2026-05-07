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

interface TabsContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const value = useContext(TabsContext);
  if (!value) {
    throw new Error('Tabs components must render inside TabsRoot.');
  }
  return value;
}

function TabsRoot({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children?: ReactNode;
}) {
  const [activeId, setActiveId] = useState(defaultTab);

  return h(
    TabsContext.Provider,
    { value: { activeId, setActiveId } },
    children,
  );
}

function TabsTrigger({ id, children }: { id: string; children?: ReactNode }) {
  const { activeId, setActiveId } = useTabs();

  return h(
    'button',
    {
      type: 'button',
      'aria-pressed': activeId === id,
      onClick: () => setActiveId(id),
    },
    children,
  );
}

function TabsPanel({ whenActive, children }: { whenActive: string; children?: ReactNode }) {
  const { activeId } = useTabs();
  if (activeId !== whenActive) {
    return null;
  }

  return h('section', null, children);
}

test('triggers and panels can coordinate through one tabs root', () => {
  render(
    h(
      TabsRoot,
      { defaultTab: 'overview' },
      h(
        'header',
        null,
        h(TabsTrigger, { id: 'overview' }, 'Overview'),
        h(TabsTrigger, { id: 'api' }, 'API'),
      ),
      h(
        'main',
        null,
        h(TabsPanel, { whenActive: 'overview' }, h('p', null, 'Project context')),
        h(TabsPanel, { whenActive: 'api' }, h('p', null, 'Typed response schema')),
      ),
    ),
  );

  expect(screen.getByText('Project context')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'API' }));

  expect(screen.queryByText('Project context')).toBeNull();
  expect(screen.getByText('Typed response schema')).toBeTruthy();
});
