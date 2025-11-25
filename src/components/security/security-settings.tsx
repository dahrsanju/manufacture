'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { Shield, Key, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SecuritySettingsProps {
  twoFactorEnabled?: boolean;
  lastPasswordChange?: string;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onToggleTwoFactor?: () => void;
}

export function SecuritySettings({
  twoFactorEnabled = false,
  lastPasswordChange = '2024-10-15T10:00:00',
  onChangePassword,
  onToggleTwoFactor,
}: SecuritySettingsProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const passwordStrength = getPasswordStrength(newPassword);
  const daysSinceChange = Math.floor(
    (Date.now() - new Date(lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleChangePassword = () => {
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    onChangePassword?.(currentPassword, newPassword);
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Current Password</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last changed {daysSinceChange} days ago
              </div>
            </div>
            {daysSinceChange > 90 && (
              <Badge variant="warning">Consider updating</Badge>
            )}
          </div>

          {!showPasswordForm ? (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="relative">
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative mt-1">
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Password strength</span>
                      <span className={passwordStrength.color}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.barColor}`}
                        style={{ width: `${passwordStrength.score * 25}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium">2FA Status</p>
                {twoFactorEnabled ? (
                  <Badge variant="success">Enabled</Badge>
                ) : (
                  <Badge variant="secondary">Disabled</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
            <Button
              variant={twoFactorEnabled ? 'outline' : 'primary'}
              onClick={onToggleTwoFactor}
            >
              {twoFactorEnabled ? 'Manage' : 'Enable'}
            </Button>
          </div>

          {!twoFactorEnabled && (
            <div className="mt-4 p-3 bg-warning/10 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <p className="text-sm">
                We strongly recommend enabling two-factor authentication to protect your account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <SecurityCheckItem
              label="Strong password"
              description="At least 8 characters with mixed case, numbers, and symbols"
              checked={true}
            />
            <SecurityCheckItem
              label="Two-factor authentication"
              description="Extra security layer for account access"
              checked={twoFactorEnabled}
            />
            <SecurityCheckItem
              label="Recent password update"
              description="Password changed within the last 90 days"
              checked={daysSinceChange <= 90}
            />
            <SecurityCheckItem
              label="Recovery email"
              description="Backup email for account recovery"
              checked={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityCheckItem({
  label,
  description,
  checked,
}: {
  label: string;
  description: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 ${checked ? 'text-success' : 'text-muted-foreground'}`}>
        {checked ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2" />
        )}
      </div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Very weak', color: 'text-destructive', barColor: 'bg-destructive' },
    { label: 'Weak', color: 'text-destructive', barColor: 'bg-destructive' },
    { label: 'Fair', color: 'text-warning', barColor: 'bg-warning' },
    { label: 'Good', color: 'text-success', barColor: 'bg-success' },
    { label: 'Strong', color: 'text-success', barColor: 'bg-success' },
  ];

  return { ...levels[Math.min(score, 4)], score };
}
