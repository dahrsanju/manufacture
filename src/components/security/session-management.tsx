'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { Monitor, Smartphone, Tablet, Globe, LogOut, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Session {
  id: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SessionManagementProps {
  sessions?: Session[];
  onTerminateSession?: (sessionId: string) => void;
  onTerminateAllOthers?: () => void;
}

const mockSessions: Session[] = [
  { id: 's1', device: 'MacBook Pro', deviceType: 'desktop', browser: 'Chrome 119', location: 'San Francisco, CA', ip: '192.168.1.100', lastActive: '2024-11-24T10:30:00', isCurrent: true },
  { id: 's2', device: 'iPhone 15', deviceType: 'mobile', browser: 'Safari', location: 'San Francisco, CA', ip: '192.168.1.101', lastActive: '2024-11-24T09:15:00', isCurrent: false },
  { id: 's3', device: 'Windows PC', deviceType: 'desktop', browser: 'Firefox 120', location: 'New York, NY', ip: '10.0.0.50', lastActive: '2024-11-23T16:45:00', isCurrent: false },
  { id: 's4', device: 'iPad Air', deviceType: 'tablet', browser: 'Safari', location: 'Los Angeles, CA', ip: '172.16.0.25', lastActive: '2024-11-22T11:30:00', isCurrent: false },
];

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export function SessionManagement({
  sessions = mockSessions,
  onTerminateSession,
  onTerminateAllOthers,
}: SessionManagementProps) {
  const [confirmTerminate, setConfirmTerminate] = useState<string | null>(null);

  const handleTerminate = (sessionId: string) => {
    onTerminateSession?.(sessionId);
    setConfirmTerminate(null);
  };

  const currentSession = sessions.find((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          {otherSessions.length > 0 && (
            <Button variant="outline" size="sm" onClick={onTerminateAllOthers}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out All Others
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Session */}
        {currentSession && (
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-3">Current Session</p>
            <SessionCard session={currentSession} />
          </div>
        )}

        {/* Other Sessions */}
        {otherSessions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Other Active Sessions ({otherSessions.length})
            </p>
            <div className="space-y-3">
              {otherSessions.map((session) => (
                <div key={session.id}>
                  <SessionCard
                    session={session}
                    showTerminate
                    isConfirming={confirmTerminate === session.id}
                    onTerminate={() => setConfirmTerminate(session.id)}
                    onConfirm={() => handleTerminate(session.id)}
                    onCancel={() => setConfirmTerminate(null)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {otherSessions.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No other active sessions
          </p>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-warning/10 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-sm">Security Recommendation</p>
            <p className="text-xs text-muted-foreground">
              If you see any unfamiliar devices or locations, terminate those sessions immediately
              and change your password.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SessionCardProps {
  session: Session;
  showTerminate?: boolean;
  isConfirming?: boolean;
  onTerminate?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function SessionCard({
  session,
  showTerminate,
  isConfirming,
  onTerminate,
  onConfirm,
  onCancel,
}: SessionCardProps) {
  const Icon = deviceIcons[session.deviceType];

  return (
    <div className={`p-4 rounded-lg border ${session.isCurrent ? 'border-primary bg-primary/5' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{session.device}</span>
            {session.isCurrent && (
              <Badge variant="success">Current</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{session.browser}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {session.location}
            </span>
            <span>{session.ip}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
            </span>
          </div>
        </div>
        {showTerminate && (
          <div>
            {isConfirming ? (
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={onConfirm}>
                  Confirm
                </Button>
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onTerminate}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
