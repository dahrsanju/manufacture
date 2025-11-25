'use client';

import { useState, useRef, useEffect } from 'react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from './button';

interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

const presetRanges = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This week', custom: 'week' },
  { label: 'This month', custom: 'month' },
  { label: 'This year', custom: 'year' },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    value || {
      from: subDays(new Date(), 30),
      to: new Date(),
      label: 'Last 30 days',
    }
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (preset: typeof presetRanges[0]) => {
    const to = new Date();
    let from: Date;

    if (preset.custom === 'week') {
      from = startOfWeek(to, { weekStartsOn: 1 });
    } else if (preset.custom === 'month') {
      from = startOfMonth(to);
    } else if (preset.custom === 'year') {
      from = startOfYear(to);
    } else if (preset.days === 0) {
      from = new Date();
      from.setHours(0, 0, 0, 0);
    } else if (preset.days === 1) {
      from = subDays(to, 1);
      from.setHours(0, 0, 0, 0);
    } else {
      from = subDays(to, preset.days || 0);
    }

    const newRange = { from, to, label: preset.label };
    setSelectedRange(newRange);
    onChange?.(newRange);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (selectedRange.label !== 'Custom') {
      return selectedRange.label;
    }
    return `${format(selectedRange.from, 'MMM d')} - ${format(selectedRange.to, 'MMM d, yyyy')}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="truncate">{formatDateRange()}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[200px] rounded-md border bg-popover p-1 shadow-md z-50">
          {presetRanges.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetSelect(preset)}
              className={`w-full px-3 py-2 text-left text-sm rounded-sm hover:bg-muted transition-colors ${
                selectedRange.label === preset.label ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
