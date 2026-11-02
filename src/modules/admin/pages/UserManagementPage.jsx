import React, { useState } from 'react';
import { Search, UserCheck, UserX, Shield, MoreHorizontal } from 'lucide-react';
import { MOCK_USERS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';

export const UserManagementPage = () => {
  const { showToast } = useApp();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const next = u.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`User ${u.name} status updated to: ${next}`, 'info');
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Registered customer accounts, activity logs, and account status controls
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search user by name or email..."
            />
          </div>
          <span className="text-xs text-slate-400">Total customers: {filtered.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">Customer Name</th>
                <th className="py-3 px-2">Contact Details</th>
                <th className="py-3 px-2">Orders Placed</th>
                <th className="py-3 px-2">Total Spent</th>
                <th className="py-3 px-2">Joined</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{user.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <p className="font-medium text-slate-800">{user.email}</p>
                    <p className="text-slate-400 text-[10px]">{user.phone}</p>
                  </td>
                  <td className="py-3.5 px-2 font-bold text-slate-800">{user.ordersCount} orders</td>
                  <td className="py-3.5 px-2 font-black text-amber-800">{user.totalSpent}</td>
                  <td className="py-3.5 px-2 text-slate-500">{user.joinedDate}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        user.status === 'Active'
                          ? 'text-red-700 border-red-200 hover:bg-red-50'
                          : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagementPage;
