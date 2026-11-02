import React from 'react';

/**
 * Base Shimmer Skeleton
 */
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-stone-200/80 rounded-md ${className}`}
      {...props}
    />
  );
};

/**
 * Skeleton Loader for Product & Shop Cards in Grids
 */
export const CardSkeleton = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden p-0 shadow-xs flex flex-col justify-between"
        >
          <div>
            <Skeleton className="h-52 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
          <div className="p-5 pt-0 flex items-center justify-between mt-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton Loader for Dashboard KPI Stat Cards
 */
export const StatCardSkeleton = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-3 w-36 rounded" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton Loader for Admin and Merchant Data Tables
 */
export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>
      <div className="divide-y divide-stone-100">
        <div className="bg-stone-50/60 p-4 grid grid-cols-12 gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="col-span-2">
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 grid grid-cols-12 gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="col-span-2">
                <Skeleton className={`h-4 ${c === 0 ? 'w-32' : 'w-20'}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Order Listings
 */
export const OrderListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-stone-200/80 p-6 space-y-4 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton Loader for Shop / Product Details Page
 */
export const DetailSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <Skeleton className="h-4 w-36 rounded" />
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden p-6 space-y-6">
        <Skeleton className="h-64 sm:h-80 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
