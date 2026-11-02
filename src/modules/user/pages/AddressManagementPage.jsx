import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, Check, Home, Briefcase } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export const AddressManagementPage = () => {
  const { showToast } = useApp();

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      type: 'Home',
      title: 'Meenakshi Towers',
      street: 'Flat 4B, Meenakshi Towers, West Masi Street',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001',
      phone: '+91 98765 43210',
      isDefault: true,
    },
    {
      id: 'addr-2',
      type: 'Work',
      title: 'Tech Park Office',
      street: '3rd Floor, Tech Park, Bypass Road',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625016',
      phone: '+91 98765 43210',
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newAddr, setNewAddr] = useState({
    type: 'Home',
    title: '',
    street: '',
    city: 'Madurai',
    state: 'Tamil Nadu',
    pincode: '',
    phone: '',
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    const created = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, created]);
    setIsModalOpen(false);
    showToast('New address saved successfully!', 'success');
    setNewAddr({ type: 'Home', title: '', street: '', city: 'Madurai', state: 'Tamil Nadu', pincode: '', phone: '' });
  };

  const handleDelete = () => {
    setAddresses(addresses.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    showToast('Address removed', 'info');
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast('Default delivery address updated', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Saved Addresses</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage your doorstep delivery points for instant sweets dispatch
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Address
        </Button>
      </div>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <Card key={addr.id} className="relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    {addr.type === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">{addr.title}</h3>
                </div>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase">
                    Default
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-xs text-stone-500">Phone: {addr.phone}</p>
            </div>

            <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-stone-500 hover:text-amber-700 font-semibold"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Selected Default
                </span>
              )}

              <button
                onClick={() => setDeleteId(addr.id)}
                className="text-red-500 hover:text-red-700 p-1 transition"
                title="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Delivery Address"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <Input
            label="Address Title"
            value={newAddr.title}
            onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
            placeholder="e.g. My Apartment, Parents Home"
            required
          />
          <Input
            label="House / Street Details"
            value={newAddr.street}
            onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
            placeholder="Flat no., Building name, Street name"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={newAddr.city}
              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
              required
            />
            <Input
              label="Pincode"
              value={newAddr.pincode}
              onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
              placeholder="625001"
              required
            />
          </div>
          <Input
            label="Contact Mobile"
            value={newAddr.phone}
            onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
            placeholder="+91 98765 43210"
            required
          />

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Delivery Address?"
        message="Are you sure you want to delete this saved delivery address? You can always add it again later."
      />
    </div>
  );
};

export default AddressManagementPage;
