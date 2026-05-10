/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: when the task list really changes, React should receive a brand-new array reference.
function useTaskList(initial: string[]) {
  const [tasks, setTasks] = useState(initial);

  function append(task: string) {
    setTasks((current) => {
      current.push(task);
      return current;
    });
  }

  function remove(task: string) {
    setTasks((current) => {
      const index = current.indexOf(task);
      if (index >= 0) current.splice(index, 1);
      return current;
    });
  }

  return { tasks, append, remove };
}

// ---Tests
test('append and remove publish fresh task arrays', () => {
  const { result } = renderHook(() => useTaskList(['draft', 'review']));

  const firstTasks = result.current.tasks;

  act(() => {
    result.current.append('ship');
  });

  const afterAppend = result.current.tasks;
  expect(afterAppend).toEqual(['draft', 'review', 'ship']);
  expect(afterAppend).not.toBe(firstTasks);

  act(() => {
    result.current.remove('review');
  });

  expect(result.current.tasks).toEqual(['draft', 'ship']);
  expect(result.current.tasks).not.toBe(afterAppend);
});
// ---End Tests
