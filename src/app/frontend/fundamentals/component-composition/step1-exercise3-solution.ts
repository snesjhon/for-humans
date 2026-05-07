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

interface ContactRowProps {
  contact: Contact;
  selected: boolean;
  onSelect: () => void;
}

function ContactRow({ contact, selected, onSelect }: ContactRowProps) {
  return h(
    'button',
    {
      type: 'button',
      'data-selected': selected ? 'yes' : 'no',
      onClick: onSelect,
    },
    contact.name,
  );
}

function ContactDetails({ contact }: { contact: Contact }) {
  return h('aside', null, h('h2', null, contact.name), h('p', null, contact.summary));
}

function ContactBrowser({ contacts }: { contacts: Contact[] }) {
  const [selectedId, setSelectedId] = useState(contacts[0]?.id ?? '');
  const selectedContact = contacts.find((contact) => contact.id === selectedId) ?? contacts[0];

  return h(
    'section',
    null,
    h(
      'div',
      null,
      contacts.map((contact) =>
        h(ContactRow, {
          key: contact.id,
          contact,
          selected: selectedId === contact.id,
          onSelect: () => setSelectedId(contact.id),
        }),
      ),
    ),
    h(ContactDetails, { contact: selectedContact }),
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
