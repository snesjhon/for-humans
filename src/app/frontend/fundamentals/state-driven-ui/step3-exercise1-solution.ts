/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

interface CheckoutState {
  name: string;
  email: string;
  step: 'contact' | 'review';
}

// Goal: model the preset as one transaction and publish one coherent next snapshot.
function useGuestCheckout() {
  const [checkout, setCheckout] = useState<CheckoutState>({
    name: '',
    email: '',
    step: 'contact',
  });

  function prefillGuest() {
    setCheckout({
      name: 'Guest Buyer',
      email: 'guest@example.com',
      step: 'review',
    });
  }

  return { checkout, prefillGuest };
}

// ---Tests
test('guest preset fills all checkout fields together', () => {
  const { result } = renderHook(() => useGuestCheckout());

  act(() => {
    result.current.prefillGuest();
  });

  expect(result.current.checkout).toEqual({
    name: 'Guest Buyer',
    email: 'guest@example.com',
    step: 'review',
  });
});
// ---End Tests
