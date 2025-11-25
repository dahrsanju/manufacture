'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { Shield, Smartphone, Key, CheckCircle, Copy, ArrowRight } from 'lucide-react';

interface TwoFactorSetupProps {
  onComplete?: (method: string, backupCodes: string[]) => void;
  onCancel?: () => void;
}

const mockQrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const mockSecret = 'JBSWY3DPEHPK3PXP';
const mockBackupCodes = ['ABC123DEF', 'GHI456JKL', 'MNO789PQR', 'STU012VWX', 'YZA345BCD', 'EFG678HIJ'];

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'app' | 'sms'>('app');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    // In a real app, verify the code with the server
    setError('');
    setStep(3);
  };

  const handleComplete = () => {
    onComplete?.(method, mockBackupCodes);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(mockSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Set Up Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-24 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Method */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose how you want to receive verification codes
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setMethod('app')}
                className={`p-4 rounded-lg border cursor-pointer ${
                  method === 'app' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
              >
                <Smartphone className="h-8 w-8 mb-2 text-primary" />
                <p className="font-medium">Authenticator App</p>
                <p className="text-xs text-muted-foreground">
                  Use Google Authenticator, Authy, or similar
                </p>
              </div>
              <div
                onClick={() => setMethod('sms')}
                className={`p-4 rounded-lg border cursor-pointer ${
                  method === 'sms' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
              >
                <Key className="h-8 w-8 mb-2 text-primary" />
                <p className="font-medium">SMS</p>
                <p className="text-xs text-muted-foreground">
                  Receive codes via text message
                </p>
              </div>
            </div>

            {method === 'sms' && (
              <div className="mt-4">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Setup & Verify */}
        {step === 2 && (
          <div className="space-y-4">
            {method === 'app' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your authenticator app
                </p>
                <div className="flex justify-center p-6 bg-white rounded-lg">
                  <div className="w-48 h-48 bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">QR Code</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Or enter this code manually:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="px-3 py-1 bg-muted rounded font-mono text-sm">
                      {mockSecret}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copySecret}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    {copiedSecret && (
                      <span className="text-xs text-success">Copied!</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                We've sent a verification code to {phoneNumber || 'your phone'}
              </p>
            )}

            <div className="mt-6">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-1 text-center text-2xl tracking-widest"
                maxLength={6}
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleVerify}>
                Verify
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success mb-4">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Two-factor authentication enabled!</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Save these backup codes in a secure location. You can use them to access your account
              if you lose your device.
            </p>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {mockBackupCodes.map((code, i) => (
                  <code key={i} className="px-3 py-2 bg-background rounded text-center font-mono">
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg text-sm">
              <Key className="h-4 w-4 text-warning" />
              <span>Each code can only be used once</span>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleComplete}>
                Done
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
