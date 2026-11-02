import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, Award, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getShopkeeperStatistics } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import { StatCardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const SalesOverviewPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    completedOrderCount: 0,
    productCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const data = await getShopkeeperStatistics(currentUser?.uid || 'merchant');
        setStats(data);
      } catch (_err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [currentUser?.uid]);

  const avgOrderValue = stats.completedOrderCount > 0 ? Math.round(stats.totalRevenue / stats.completedOrderCount) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Sales Overview</h1>
          <p className="text-sm text-stone-500 mt-1">
            Revenue trends, order volumes, and average ticket sizes
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      {loading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card>
            <p className="text-xs font-semibold text-stone-400 uppercase">Gross Sales</p>
            <h3 className="text-2xl font-black text-stone-900 mt-1">₹{stats.totalRevenue}</h3>
            <p className="text-[11px] text-stone-400 mt-1">Verified customer payments</p>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-stone-400 uppercase">Orders Completed</p>
            <h3 className="text-2xl font-black text-stone-900 mt-1">{stats.completedOrderCount} Orders</h3>
            <p className="text-[11px] text-stone-400 mt-1">{stats.orderCount} total lifetime orders</p>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-stone-400 uppercase">Avg Order Value</p>
            <h3 className="text-2xl font-black text-stone-900 mt-1">₹{avgOrderValue}</h3>
            <p className="text-[11px] text-stone-400 mt-1">Average per customer bag</p>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-stone-400 uppercase">Active Catalog</p>
            <h3 className="text-2xl font-black text-stone-900 mt-1">{stats.productCount} Items</h3>
            <p className="text-[11px] text-stone-400 mt-1">Listed products</p>
          </Card>
        </div>
      )}

      {/* Breakdown or Empty State */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900">Sales by Delicacy</h2>
        {stats.completedOrderCount === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No Sales Data Available Yet"
            description="As customers purchase your traditional sweets and savouries, item-level revenue trends will populate here automatically."
            actionLabel="Add Delicacies"
            onAction={() => (window.location.href = '/shopkeeper/products/add')}
          />
        ) : (
          <Card>
            <p className="text-xs text-stone-500">Sales reporting is calculated in real time from completed orders.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalesOverviewPage;
