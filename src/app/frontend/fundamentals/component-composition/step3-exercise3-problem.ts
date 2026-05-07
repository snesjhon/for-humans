/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const h = React.createElement;

interface FileNode {
  id: string;
  name: string;
  kind: 'file' | 'folder';
  children?: FileNode[];
}

function TreeNode({ node }: { node: FileNode }) {
  if (node.kind === 'file') {
    return h('li', null, node.name);
  }

  const [open, setOpen] = useState(false);

  return h(
    'li',
    null,
    h(
      'button',
      {
        type: 'button',
        onClick: () => setOpen((value) => !value),
      },
      node.name,
    ),
    // Goal: a folder node should render more TreeNode components of the same shape.
    // TODO: when open, recursively render node.children here.
    open ? h('ul', null) : null,
  );
}

function FileTree({ nodes }: { nodes: FileNode[] }) {
  return h(
    'ul',
    null,
    nodes.map((node) => h(TreeNode, { key: node.id, node })),
  );
}

test('nested folders expand by rendering more TreeNode components recursively', () => {
  render(
    h(FileTree, {
      nodes: [
        {
          id: 'src',
          name: 'src',
          kind: 'folder',
          children: [
            {
              id: 'components',
              name: 'components',
              kind: 'folder',
              children: [
                {
                  id: 'modal',
                  name: 'Modal.ts',
                  kind: 'file',
                },
              ],
            },
          ],
        },
      ],
    }),
  );

  fireEvent.click(screen.getByRole('button', { name: 'src' }));
  fireEvent.click(screen.getByRole('button', { name: 'components' }));

  expect(screen.getByText('Modal.ts')).toBeTruthy();
});
