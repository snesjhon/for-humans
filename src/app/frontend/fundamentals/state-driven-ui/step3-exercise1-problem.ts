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

// Goal: one preset click should produce one complete checkout snapshot.
function useGuestCheckout() {
  const [checkout, setCheckout] = useState<CheckoutState>({
    name: '',
    email: '',
    step: 'contact',
  });

  function prefillGuest() {
    setCheckout({ ...checkout, name: 'Guest Buyer' });
    setCheckout({ ...checkout, email: 'guest@example.com' });
    setCheckout({ ...checkout, step: 'review' });
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
