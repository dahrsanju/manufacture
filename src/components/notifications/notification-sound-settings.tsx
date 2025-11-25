'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Volume2, VolumeX, Play, Save } from 'lucide-react';

interface SoundSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sound: string;
  volume: number;
}

interface NotificationSoundSettingsProps {
  onSave?: (settings: SoundSetting[]) => void;
}

const defaultSounds = [
  { id: 'default', name: 'Default' },
  { id: 'chime', name: 'Chime' },
  { id: 'bell', name: 'Bell' },
  { id: 'ping', name: 'Ping' },
  { id: 'pop', name: 'Pop' },
];

const defaultSettings: SoundSetting[] = [
  { id: 'tasks', name: 'Task Notifications', description: 'New tasks and assignments', enabled: true, sound: 'default', volume: 80 },
  { id: 'alerts', name: 'Alerts', description: 'Important alerts and warnings', enabled: true, sound: 'chime', volume: 100 },
  { id: 'messages', name: 'Messages', description: 'New messages and comments', enabled: true, sound: 'ping', volume: 60 },
  { id: 'approvals', name: 'Approvals', description: 'Approval requests and completions', enabled: true, sound: 'bell', volume: 70 },
  { id: 'system', name: 'System', description: 'System notifications', enabled: false, sound: 'pop', volume: 50 },
];

export function NotificationSoundSettings({ onSave }: NotificationSoundSettingsProps) {
  const [settings, setSettings] = useState<SoundSetting[]>(defaultSettings);
  const [masterVolume, setMasterVolume] = useState(100);
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (id: string, updates: Partial<SoundSetting>) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, ...updates } : setting
      )
    );
    setHasChanges(true);
  };

  const playSound = (soundId: string) => {
    // In a real app, this would play the actual sound
    console.log('Playing sound:', soundId);
  };

  const handleSave = () => {
    onSave?.(settings);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound Settings
          </CardTitle>
          {hasChanges && (
            <Badge variant="warning">Unsaved Changes</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Master Controls */}
        <div className="p-4 bg-muted/50 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Master Sound</p>
              <p className="text-sm text-muted-foreground">Enable or disable all notification sounds</p>
            </div>
            <button
              onClick={() => {
                setMasterEnabled(!masterEnabled);
                setHasChanges(true);
              }}
              className={`w-12 h-7 rounded-full transition-colors ${
                masterEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  masterEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Master Volume</span>
              <span className="text-sm text-muted-foreground">{masterVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={masterVolume}
              onChange={(e) => {
                setMasterVolume(parseInt(e.target.value));
                setHasChanges(true);
              }}
              disabled={!masterEnabled}
              className="w-full"
            />
          </div>
        </div>

        {/* Individual Sound Settings */}
        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className={`p-4 rounded-lg border ${
                !masterEnabled || !setting.enabled ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{setting.name}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <button
                  onClick={() => updateSetting(setting.id, { enabled: !setting.enabled })}
                  disabled={!masterEnabled}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      setting.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Sound</label>
                  <div className="flex gap-2 mt-1">
                    <select
                      value={setting.sound}
                      onChange={(e) => updateSetting(setting.id, { sound: e.target.value })}
                      disabled={!masterEnabled || !setting.enabled}
                      className="flex-1 px-2 py-1 text-sm border rounded bg-background"
                    >
                      {defaultSounds.map((sound) => (
                        <option key={sound.id} value={sound.id}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playSound(setting.sound)}
                      disabled={!masterEnabled || !setting.enabled}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium">Volume</label>
                    <span className="text-xs text-muted-foreground">{setting.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={setting.volume}
                    onChange={(e) => updateSetting(setting.id, { volume: parseInt(e.target.value) })}
                    disabled={!masterEnabled || !setting.enabled}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
