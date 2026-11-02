import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRing, CheckCircle, XCircle, Clock, MapPin, Printer, ArrowUpRight } from 'lucide-react';
import { MOCK_ORDERS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const IncomingOrdersPage = () => {
  const { showToast } = useApp();
  const [incoming, setIncoming] = useState(MOCK_ORDERS);

  const handleAccept = (id) => {
    setIncoming(incoming.filter((o) => o.id !== id));
    showToast(`Order ${id} accepted and sent to sweet packing kitchen!`, 'success');
  };

  const handleReject = (id) => {
    setIncoming(incoming.filter((o) => o.id !== id));
    showToast(`Order ${id} rejected`, 'info');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span>Live Kitchen Order Stream</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Incoming Orders Queue</h1>
          <p className="text-sm text-stone-500 mt-1">
            Accept pending orders immediately to notify delivery executives for pickup
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger" size="md">
            {incoming.length} Orders Pending Action
          </Badge>
        </div>
      </div>

      {incoming.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h3 className="font-bold text-stone-900 text-lg">All incoming orders cleared!</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Your kitchen queue is up to date. New customer requests will show up here automatically.
          </p>
          <div className="pt-2">
            <Link to="/shopkeeper/orders/manage">
              <Button variant="outline" size="sm">
                View Past & Dispatched Orders
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {incoming.map((ord) => (
            <Card key={ord.id} className="border-amber-300 ring-1 ring-amber-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900 text-base">{ord.id}</span>
                    <Badge variant="warning">Awaiting Kitchen Acceptance</Badge>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Placed at 11:15 AM
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Customer: <strong className="text-stone-800">{ord.customer}</strong> ({ord.phone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Printing Kitchen Order Ticket (KOT)...', 'info')}
                    className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                    title="Print KOT"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(ord.id)}>
                    Decline
                  </Button>
                  <Button variant="primary" size="sm" icon={CheckCircle} onClick={() => handleAccept(ord.id)}>
                    Accept & Prepare
                  </Button>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="py-4 space-y-2">
                <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Delicacies to Pack:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ord.items.map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex justify-between">
                      <span className="font-bold text-stone-800">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-stone-500">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-500">
                  <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>{ord.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-stone-500 font-medium">Payment: {ord.paymentMethod}</span>
                  <span className="text-base font-black text-amber-800">₹{ord.total}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingOrdersPage;
