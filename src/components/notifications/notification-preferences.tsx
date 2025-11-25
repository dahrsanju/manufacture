'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

interface NotificationPreferencesProps {
  onSave?: (preferences: NotificationCategory[]) => void;
}

const defaultCategories: NotificationCategory[] = [
  {
    id: 'tasks',
    name: 'Task Assignments',
    description: 'When you are assigned a new task or task status changes',
    channels: { email: true, push: true, sms: false, inApp: true },
  },
  {
    id: 'inventory',
    name: 'Inventory Alerts',
    description: 'Low stock warnings and reorder notifications',
    channels: { email: true, push: true, sms: true, inApp: true },
  },
  {
    id: 'production',
    name: 'Production Updates',
    description: 'Work order status changes and production issues',
    channels: { email: true, push: false, sms: false, inApp: true },
  },
  {
    id: 'quality',
    name: 'Quality Alerts',
    description: 'Inspection results and quality issues',
    channels: { email: true, push: true, sms: true, inApp: true },
  },
  {
    id: 'workflow',
    name: 'Workflow Approvals',
    description: 'Pending approvals and workflow completions',
    channels: { email: true, push: true, sms: false, inApp: true },
  },
  {
    id: 'system',
    name: 'System Notifications',
    description: 'Maintenance, updates, and security alerts',
    channels: { email: true, push: false, sms: false, inApp: true },
  },
];

export function NotificationPreferences({ onSave }: NotificationPreferencesProps) {
  const [categories, setCategories] = useState<NotificationCategory[]>(defaultCategories);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleChannel = (categoryId: string, channel: keyof NotificationCategory['channels']) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channel]: !cat.channels[channel] } }
          : cat
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(categories);
    setHasChanges(false);
  };

  const channels: { key: keyof NotificationCategory['channels']; name: string; icon: React.ReactNode }[] = [
    { key: 'inApp', name: 'In-App', icon: <Bell className="h-4 w-4" /> },
    { key: 'email', name: 'Email', icon: <Mail className="h-4 w-4" /> },
    { key: 'push', name: 'Push', icon: <Smartphone className="h-4 w-4" /> },
    { key: 'sms', name: 'SMS', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          {hasChanges && (
            <Badge variant="warning">Unsaved Changes</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Channel Headers */}
        <div className="grid grid-cols-[1fr,repeat(4,80px)] gap-4 mb-4 pb-4 border-b">
          <div className="text-sm font-medium">Category</div>
          {channels.map((channel) => (
            <div key={channel.key} className="text-center">
              <div className="flex flex-col items-center gap-1">
                {channel.icon}
                <span className="text-xs">{channel.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Rows */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-[1fr,repeat(4,80px)] gap-4 items-center py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
              {channels.map((channel) => (
                <div key={channel.key} className="flex justify-center">
                  <button
                    onClick={() => toggleChannel(category.id, channel.key)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      category.channels[channel.key]
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        category.channels[channel.key]
                          ? 'translate-x-5'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
