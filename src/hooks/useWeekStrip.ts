import { useState, useMemo, useCallback } from 'react';

export interface WeekDay {
  name: string;
  date: number;
  isToday: boolean;
  isSelected: boolean;
  dateStr: string; // YYYY-MM-DD
}

export function useWeekStrip() {
  const [weekOffset, setWeekOffset] = useState(0);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const weekDays = useMemo((): WeekDay[] => {
    const today = new Date();
    const dow = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7);

    const names = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return names.map((name, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      return {
        name,
        date: d.getDate(),
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDateStr,
        dateStr,
      };
    });
  }, [weekOffset, todayStr, selectedDateStr]);

  const weekStart = weekDays[0]?.dateStr ?? '';
  const weekEnd = weekDays[6]?.dateStr ?? '';
  const isCurrentWeek = weekOffset === 0;

  const goBack = useCallback(() => {
    setWeekOffset(prev => prev - 1);
  }, []);

  const goForward = useCallback(() => {
    setWeekOffset(prev => {
      if (prev < 0) return prev + 1;
      return prev;
    });
  }, []);

  const selectDay = useCallback((dateStr: string) => {
    setSelectedDateStr(dateStr);
  }, []);

  return {
    weekDays,
    weekOffset,
    weekStart,
    weekEnd,
    isCurrentWeek,
    selectedDateStr,
    selectDay,
    goBack,
    goForward,
  };
}
