'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui';
import { Sparkles, AlertTriangle, Link } from 'lucide-react';

interface Suggestion {
  value: string;
  label: string;
  confidence: number;
  source: 'ai' | 'history' | 'related';
}

interface SmartAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: Suggestion) => void;
  placeholder?: string;
  label?: string;
  field: string;
  entityType: string;
  showDuplicateWarning?: boolean;
  showRelatedSuggestions?: boolean;
  className?: string;
}

export function SmartAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  label,
  field,
  entityType,
  showDuplicateWarning = true,
  showRelatedSuggestions = true,
  className,
}: SmartAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [relatedRecords, setRelatedRecords] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulate AI-powered suggestions
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setDuplicateWarning(null);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock AI predictions based on field type
      const mockSuggestions: Suggestion[] = [];

      if (field === 'sku') {
        mockSuggestions.push(
          { value: `SKU-${value.toUpperCase()}-001`, label: `SKU-${value.toUpperCase()}-001`, confidence: 0.95, source: 'ai' },
          { value: `${value.toUpperCase()}-PRD-001`, label: `${value.toUpperCase()}-PRD-001`, confidence: 0.85, source: 'ai' }
        );
      } else if (field === 'name') {
        mockSuggestions.push(
          { value: `${value} Pro`, label: `${value} Pro`, confidence: 0.9, source: 'ai' },
          { value: `${value} Standard`, label: `${value} Standard`, confidence: 0.8, source: 'ai' },
          { value: `${value} Basic`, label: `${value} Basic`, confidence: 0.7, source: 'history' }
        );
      } else if (field === 'category') {
        mockSuggestions.push(
          { value: 'Electronics', label: 'Electronics', confidence: 0.92, source: 'ai' },
          { value: 'Components', label: 'Components', confidence: 0.88, source: 'ai' },
          { value: 'Raw Materials', label: 'Raw Materials', confidence: 0.75, source: 'history' }
        );
      }

      setSuggestions(mockSuggestions);
      setIsLoading(false);

      // Check for duplicates
      if (showDuplicateWarning && value.toLowerCase().includes('widget')) {
        setDuplicateWarning('Similar product "Widget Pro X100" already exists');
      } else {
        setDuplicateWarning(null);
      }

      // Show related records
      if (showRelatedSuggestions && value.length > 3) {
        setRelatedRecords([
          { id: 'rel-1', name: `Related ${entityType} 1` },
          { id: 'rel-2', name: `Related ${entityType} 2` },
        ]);
      } else {
        setRelatedRecords([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, field, entityType, showDuplicateWarning, showRelatedSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.value);
    onSelect?.(suggestion);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={duplicateWarning ? 'border-warning' : ''}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>
        )}
      </div>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="flex items-center gap-2 mt-1 text-sm text-warning">
          <AlertTriangle className="h-3 w-3" />
          {duplicateWarning}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || relatedRecords.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Suggestions
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center justify-between"
                >
                  <span>{suggestion.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </button>
              ))}
            </div>
          )}

          {relatedRecords.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Link className="h-3 w-3" />
                Related Records
              </p>
              {relatedRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => {
                    // Navigate to related record
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm"
                >
                  {record.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
