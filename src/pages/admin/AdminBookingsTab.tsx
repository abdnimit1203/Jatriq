import React, { useState } from 'react';
import { FirestoreBooking } from '../../lib/firebase';
import {
  Calendar,
  User,
  Phone,
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminBookingsTabProps {
  bookings: FirestoreBooking[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onUpdateStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
  formatPrice: (amount: number) => string;
  language: string;
}

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({
  bookings,
  loading,
  onRefresh,
  onUpdateStatus,
  formatPrice,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Statistics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;
  const totalEstimatedRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (Number(b.totalEstimatedBDT) || 0), 0);

  // Filtered list
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.fullName?.toLowerCase().includes(q) ||
      b.phone?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.packageTitle?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Bookings
          </span>
          <div className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">{totalBookings}</div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">From Firestore Cloud</span>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            Pending Actions
          </span>
          <div className="text-2xl font-bold text-amber-800 mt-1 tabular-nums">{pendingCount}</div>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Needs confirmation</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Confirmed
          </span>
          <div className="text-2xl font-bold text-emerald-800 mt-1 tabular-nums">{confirmedCount}</div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Ready for departure</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Estimated Revenue
          </span>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 tabular-nums">
            {formatPrice(totalEstimatedRevenue)}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Active bookings value</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search traveler name, phone, tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Tabs */}
          <div className="inline-flex rounded-lg bg-stone-100 p-1 text-xs">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh bookings from Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bookings List / Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-stone-700">No bookings found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'Customer booking submissions from the website will automatically appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Booking ID & Date</th>
                  <th className="py-3 px-4">Traveler Details</th>
                  <th className="py-3 px-4">Tour Package</th>
                  <th className="py-3 px-4">Group & Estimate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.map((booking) => {
                  const isUpdating = updatingId === booking.id;
                  const cleanPhone = (booking.phone || '').replace(/[^0-9+]/g, '');
                  const waNumber = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone.replace(/^0/, '')}`;

                  return (
                    <tr key={booking.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono text-[11px] font-bold text-stone-900 block">
                          {booking.id}
                        </span>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Travel: {booking.travelDate || 'Not specified'}
                        </span>
                      </td>

                      {/* Traveler Details */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-stone-900 block">{booking.fullName}</span>
                        <div className="mt-1 space-y-0.5">
                          <a
                            href={`tel:${booking.phone}`}
                            className="text-stone-600 hover:text-emerald-800 flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="w-3 h-3 text-stone-400" />
                            {booking.phone}
                          </a>
                          {booking.email && (
                            <a
                              href={`mailto:${booking.email}`}
                              className="text-stone-500 hover:text-emerald-800 flex items-center gap-1 text-[11px]"
                            >
                              <Mail className="w-3 h-3 text-stone-400" />
                              {booking.email}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Tour Package */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-stone-800 block">{booking.packageTitle}</span>
                        <span className="font-mono text-[10px] text-stone-400 block mt-0.5">
                          Slug: {booking.packageSlug}
                        </span>
                        {booking.specialRequests && (
                          <p className="mt-1 text-[11px] text-stone-500 italic bg-stone-50 p-1.5 rounded border border-stone-200 max-w-xs">
                            "{booking.specialRequests}"
                          </p>
                        )}
                      </td>

                      {/* Group & Estimate */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-stone-900 block">
                          {booking.travelersCount || 1} Travelers
                        </span>
                        <span className="text-emerald-800 font-bold text-xs mt-0.5 block tabular-nums">
                          {formatPrice(Number(booking.totalEstimatedBDT) || 0)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {booking.status === 'confirmed' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : booking.status === 'cancelled' ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{booking.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Direct Chat */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Hello ${booking.fullName}, regarding your booking (#${booking.id}) for ${booking.packageTitle} with Jatriq:`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Confirm */}
                          {booking.status !== 'confirmed' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}

                          {/* Cancel */}
                          {booking.status !== 'cancelled' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}

                          {/* Reset to Pending if cancelled/confirmed */}
                          {booking.status !== 'pending' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(booking.id, 'pending')}
                              className="px-2 py-1 text-stone-400 hover:text-stone-700 rounded text-[10px] cursor-pointer"
                              title="Reset status to pending"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
