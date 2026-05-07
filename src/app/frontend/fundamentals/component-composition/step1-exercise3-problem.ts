/**
 * @jest-environment jsdom
 */
import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

const h = React.createElement;

interface Contact {
  id: string;
  name: string;
  summary: string;
}

function ContactRow({ contact }: { contact: Contact }) {
  const [selected, setSelected] = useState(false);

  return h(
    'button',
    {
      type: 'button',
      'data-selected': selected ? 'yes' : 'no',
      onClick: () => setSelected(true),
    },
    contact.name,
  );
}

function ContactDetails({ contact }: { contact: Contact }) {
  return h('aside', null, h('h2', null, contact.name), h('p', null, contact.summary));
}

// Goal: clicking a row should update both the selected highlight and the details pane.
// TODO: own selectedId in ContactBrowser and pass it into both children.
function ContactBrowser({ contacts }: { contacts: Contact[] }) {
  return h(
    'section',
    null,
    h(
      'div',
      null,
      contacts.map((contact) => h(ContactRow, { key: contact.id, contact })),
    ),
    h(ContactDetails, { contact: contacts[0] }),
  );
}

test('clicking a contact updates the details pane and selection state together', () => {
  render(
    h(ContactBrowser, {
      contacts: [
        { id: 'mila', name: 'Mila', summary: 'Leads the API integration work.' },
        { id: 'omar', name: 'Omar', summary: 'Owns the device rendering layer.' },
      ],
    }),
  );

  fireEvent.click(screen.getByRole('button', { name: 'Omar' }));

  expect(screen.getByRole('button', { name: 'Omar' }).getAttribute('data-selected')).toBe('yes');
  expect(screen.getByText('Owns the device rendering layer.')).toBeTruthy();
});
