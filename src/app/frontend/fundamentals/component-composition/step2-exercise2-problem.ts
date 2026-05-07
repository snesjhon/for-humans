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

// Goal: the root owns activeId so triggers and panels can live in different
// parts of the layout without prop threading.
// TODO: create activeId state from defaultTab and provide it through context.
function TabsRoot({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children?: ReactNode;
}) {
  void defaultTab;
  return h(React.Fragment, null, children);
}

function TabsTrigger({ id, children }: { id: string; children?: ReactNode }) {
  void id;
  void useTabs();

  return h(
    'button',
    {
      type: 'button',
      onClick: () => {},
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
