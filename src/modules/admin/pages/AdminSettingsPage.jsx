import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, CreditCard } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AdminSettingsPage = () => {
  const { showToast } = useApp();

  const [settings, setSettings] = useState({
    commissionRate: '5.0',
    gstTaxRate: '5.0',
    freeDeliveryThreshold: '500',
    maintenanceMode: false,
    autoApproveVerifiedFssai: false,
    enableCod: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Global marketplace configurations saved!', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Marketplace commission rates, payment gateways, and global maintenance controls
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Marketplace Financial Configurations">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Standard Commission (%)"
              type="number"
              step="0.1"
              value={settings.commissionRate}
              onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
              required
            />
            <Input
              label="GST Tax Rate (%)"
              type="number"
              step="0.1"
              value={settings.gstTaxRate}
              onChange={(e) => setSettings({ ...settings, gstTaxRate: e.target.value })}
              required
            />
            <Input
              label="Free Delivery Above (₹)"
              type="number"
              value={settings.freeDeliveryThreshold}
              onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: e.target.value })}
              required
            />
          </div>
        </Card>

        <Card title="Global Platform Toggles">
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Platform Maintenance Mode</h4>
                <p className="text-xs text-slate-500">Temporarily suspend customer checkout for system upgrades</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Enable Cash on Delivery (COD)</h4>
                <p className="text-xs text-slate-500">Allow customers to pay physical cash upon sweet box doorstep handover</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableCod}
                onChange={(e) => setSettings({ ...settings, enableCod: e.target.checked })}
                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={Save}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save Global System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
