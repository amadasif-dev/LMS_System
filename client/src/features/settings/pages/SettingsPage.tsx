import { useState } from 'react';
import { Card } from '../../../shared/components/Card/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { Toast } from '../../../shared/components/Toast/Toast';
import { useAppSelector } from '../../../core/store/hooks';
import { User, Bell, Shield, Palette } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSave = () => {
    Toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:w-64 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card title="Profile Information" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Profile Photo</p>
                    <p className="text-sm text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue={user?.firstName} />
                  <Input label="Last Name" defaultValue={user?.lastName} />
                  <Input label="Email" type="email" defaultValue={user?.email} />
                  <Input label="Phone" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="pt-4">
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Notification Preferences" className="p-6">
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive updates via email', checked: true },
                  { label: 'Push Notifications', desc: 'Browser push notifications', checked: true },
                  { label: 'Assignment Reminders', desc: 'Get notified before deadlines', checked: false },
                  { label: 'Course Updates', desc: 'New content and announcements', checked: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
                <div className="pt-4">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security Settings" className="p-6">
              <div className="space-y-4">
                <Input label="Current Password" type="password" />
                <Input label="New Password" type="password" />
                <Input label="Confirm New Password" type="password" />
                <div className="pt-4">
                  <Button onClick={handleSave}>Update Password</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card title="Appearance" className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700">Theme preferences coming soon...</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
