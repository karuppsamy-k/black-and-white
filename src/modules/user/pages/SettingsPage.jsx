import React, { useState } from 'react';
import { Bell, Moon, Shield, Globe, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export const SettingsPage = () => {
  const { showToast } = useApp();

  const [settings, setSettings] = useState({
    orderUpdates: true,
    whatsappAlerts: true,
    promoOffers: false,
    language: 'English',
    freshBatchAlerts: true,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast('Preference updated', 'info');
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-900">Account Settings</h1>
        <p className="text-sm text-stone-500 mt-1">
          Customize notifications, delivery alerts, and interface preferences
        </p>
      </div>

      {/* Notifications Section */}
      <Card title="Order & Delivery Notifications">
        <div className="space-y-4 divide-y divide-stone-100">
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <h4 className="text-sm font-bold text-stone-900">SMS & WhatsApp Live Order Updates</h4>
              <p className="text-xs text-stone-500">Receive rider location and stage transitions directly on WhatsApp</p>
            </div>
            <input
              type="checkbox"
              checked={settings.whatsappAlerts}
              onChange={() => handleToggle('whatsappAlerts')}
              className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">Morning Fresh Batch Notifications</h4>
              <p className="text-xs text-stone-500">Get alerted when your favourite Irutu Kadai Halwa or Kai Murukku arrives</p>
            </div>
            <input
              type="checkbox"
              checked={settings.freshBatchAlerts}
              onChange={() => handleToggle('freshBatchAlerts')}
              className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">Festival & Promotional Offers</h4>
              <p className="text-xs text-stone-500">Diwali, Pongal, and regional sweet combo festival coupons</p>
            </div>
            <input
              type="checkbox"
              checked={settings.promoOffers}
              onChange={() => handleToggle('promoOffers')}
              className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Regional & Language Settings */}
      <Card title="Regional Preferences">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-stone-900">Application Language</h4>
            <p className="text-xs text-stone-500">Choose your preferred display language for delicacy names</p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => {
              setSettings({ ...settings, language: e.target.value });
              showToast(`Language set to ${e.target.value}`, 'success');
            }}
            className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white text-stone-800 outline-none"
          >
            <option value="English">English</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
          </select>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Account Privacy & Danger Zone" className="border-red-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-red-700">Delete Customer Account</h4>
            <p className="text-xs text-stone-500">Permanently delete your order history and saved addresses</p>
          </div>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          showToast('Account deletion request registered', 'info');
        }}
        title="Delete Customer Account?"
        message="This action is irreversible. All your past orders, reward points, and saved addresses will be wiped."
      />
    </div>
  );
};

export default SettingsPage;
