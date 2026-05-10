/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  label: string;
}

function useRenamableTasks(initial: Task[]) {
  const [tasks, setTasks] = useState(initial);
  const [syncRuns, setSyncRuns] = useState(0);

  useEffect(() => {
    setSyncRuns((count) => count + 1);
  }, [tasks]);

  function renameTask(taskId: string, nextLabel: string) {
    setTasks((current) => {
      const task = current.find((entry) => entry.id === taskId);

      if (!task) return current;
      if (task.label === nextLabel) return current;

      return current.map((entry) =>
        entry.id === taskId ? { ...entry, label: nextLabel } : entry,
      );
    });
  }

  return { tasks, syncRuns, renameTask };
}

// ---Tests
test('renameTask keeps the old array reference for no-op updates', () => {
  const { result } = renderHook(() =>
    useRenamableTasks([
      { id: 'a', label: 'Draft copy' },
      { id: 'b', label: 'Review copy' },
    ]),
  );

  expect(result.current.syncRuns).toBe(1);

  const firstTasks = result.current.tasks;

  act(() => {
    result.current.renameTask('a', 'Draft copy');
  });

  expect(result.current.tasks).toBe(firstTasks);
  expect(result.current.syncRuns).toBe(1);

  act(() => {
    result.current.renameTask('z', 'Ship copy');
  });

  expect(result.current.tasks).toBe(firstTasks);
  expect(result.current.syncRuns).toBe(1);

  act(() => {
    result.current.renameTask('b', 'Ship copy');
  });

  expect(result.current.tasks).toEqual([
    { id: 'a', label: 'Draft copy' },
    { id: 'b', label: 'Ship copy' },
  ]);
  expect(result.current.tasks).not.toBe(firstTasks);
  expect(result.current.syncRuns).toBe(2);
});
// ---End Tests
