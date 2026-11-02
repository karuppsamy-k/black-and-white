import React, { useState } from 'react';
import { Save, Store, Bell, Shield, Power } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopSettingsPage = () => {
  const { showToast } = useApp();

  const [settings, setSettings] = useState({
    autoAccept: true,
    vacationMode: false,
    minOrderAmount: '150',
    packagingFee: '15',
    smsAlerts: true,
    kitchenSoundAlerts: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Store settings saved successfully!', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-900">Shop Settings</h1>
        <p className="text-sm text-stone-500 mt-1">
          Configure automated kitchen operations, dispatch thresholds, and alerts
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Kitchen & Order Operations">
          <div className="space-y-4 divide-y divide-stone-100">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Auto-Accept Incoming Orders</h4>
                <p className="text-xs text-stone-500">Automatically accept and print KOT tickets to minimize cooking delays</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAccept}
                onChange={(e) => setSettings({ ...settings, autoAccept: e.target.checked })}
                className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Kitchen Audio Chime for New Orders</h4>
                <p className="text-xs text-stone-500">Play continuous bell chime in the kitchen until accepted</p>
              </div>
              <input
                type="checkbox"
                checked={settings.kitchenSoundAlerts}
                onChange={(e) => setSettings({ ...settings, kitchenSoundAlerts: e.target.checked })}
                className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">Store Vacation / Maintenance Mode</h4>
                <p className="text-xs text-stone-500">Temporarily hide sweet shop from customer listings during renovation or festival holidays</p>
              </div>
              <input
                type="checkbox"
                checked={settings.vacationMode}
                onChange={(e) => setSettings({ ...settings, vacationMode: e.target.checked })}
                className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <Card title="Packaging & Order Minimums">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Order Amount (₹)"
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: e.target.value })}
            />
            <Input
              label="Artisanal Tin / Box Packaging Fee (₹)"
              type="number"
              value={settings.packagingFee}
              onChange={(e) => setSettings({ ...settings, packagingFee: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={loading} icon={Save}>
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShopSettingsPage;
