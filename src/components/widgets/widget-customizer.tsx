'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings2,
  RotateCcw,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useWidgetStore } from '@/stores';

interface WidgetCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const widgetIcons: Record<string, string> = {
  kpi: '📊',
  chart: '📈',
  activity: '📋',
  actions: '⚡',
};

export function WidgetCustomizer({ isOpen, onClose }: WidgetCustomizerProps) {
  const { widgets, toggleWidget, resetWidgets } = useWidgetStore();

  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);
  const visibleCount = widgets.filter((w) => w.visible).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Customize Dashboard</h2>
                  <p className="text-xs text-muted-foreground">
                    {visibleCount} of {widgets.length} widgets visible
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetWidgets}
                  title="Reset to defaults"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Widget List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sortedWidgets.map((widget) => (
                <Card
                  key={widget.id}
                  className={`p-3 transition-colors ${
                    widget.visible ? 'border-primary/50' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-move text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="text-lg">{widgetIcons[widget.type] || '📦'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{widget.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {widget.type} • {widget.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWidget(widget.id)}
                      className={widget.visible ? 'text-primary' : 'text-muted-foreground'}
                    >
                      {widget.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Click the eye icon to show/hide widgets. Drag to reorder.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default WidgetCustomizer;
