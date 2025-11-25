'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Badge,
  Breadcrumb,
} from '@/components/ui';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Key,
  Bell,
  Clock,
  Camera,
  Trash2,
} from 'lucide-react';
import { useAuthStore } from '@/stores';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, companies, companyId } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentCompany = companies.find((c) => c.companyId === companyId);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Production Manager',
    department: 'Operations',
    timezone: 'America/New_York',
    language: 'en-US',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    taskReminders: true,
    inventoryAlerts: true,
    productionUpdates: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Profile updated successfully');
    setIsSaving(false);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    toast.success('Password reset email sent');
  };

  const activityLog = [
    { action: 'Logged in', timestamp: '2024-11-24T08:30:00', ip: '192.168.1.1' },
    { action: 'Updated profile', timestamp: '2024-11-23T14:15:00', ip: '192.168.1.1' },
    { action: 'Approved PO-2024-0567', timestamp: '2024-11-23T10:45:00', ip: '192.168.1.1' },
    { action: 'Logged in', timestamp: '2024-11-22T09:00:00', ip: '192.168.1.100' },
    { action: 'Changed password', timestamp: '2024-11-20T16:30:00', ip: '192.168.1.1' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                  <span className="text-2xl font-bold text-primary">
                    {formData.name.charAt(0)}
                  </span>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-white">
                      <Camera className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div>
                  <p className="font-medium text-lg">{formData.name}</p>
                  <p className="text-sm text-muted-foreground">{formData.jobTitle}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Timezone</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData({ ...formData, timezone: e.target.value })
                    }
                    disabled={!isEditing}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences).map(([key, value]) => {
                const labels: Record<string, string> = {
                  emailNotifications: 'Email Notifications',
                  pushNotifications: 'Push Notifications',
                  weeklyDigest: 'Weekly Digest',
                  taskReminders: 'Task Reminders',
                  inventoryAlerts: 'Inventory Alerts',
                  productionUpdates: 'Production Updates',
                };
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{labels[key]}</span>
                    <button
                      onClick={() =>
                        isEditing &&
                        setPreferences({ ...preferences, [key]: !value })
                      }
                      disabled={!isEditing}
                      className={`w-11 h-6 rounded-full transition-colors ${
                        value ? 'bg-primary' : 'bg-muted'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          value ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Last changed 4 days ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handlePasswordChange}>
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company & Role */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company & Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCompany && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{currentCompany.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="secondary">{currentCompany.role}</Badge>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">January 15, 2023</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="font-medium">{companies.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLog.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                    <div>
                      <p>{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="danger" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This action cannot be undone
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
