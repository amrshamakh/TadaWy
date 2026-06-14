import React from 'react';

export const CardSkeleton = () => (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#334155] animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2 mb-6"></div>
        <div className="flex justify-between items-center">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-24"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-24"></div>
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div className="space-y-8 animate-pulse p-4">
        <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            <div className="space-y-3 flex-1">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                </div>
            ))}
        </div>
    </div>
);

export const TableSkeleton = () => (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-[#334155] animate-pulse">
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 dark:border-slate-800">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3"></div>
                    </div>
                    <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
            ))}
        </div>
    </div>
);

export const DoctorProfileSkeleton = ({ isRtl = false }) => (
    <div className="space-y-10 animate-pulse">
        {/* Top Info Row Spacer (Next to Avatar) */}
        <div className="flex items-start justify-between gap-4 -translate-y-1 sm:-translate-y-2">
            <div className={`${isRtl ? "pr-[158px] sm:pr-[180px]" : "pl-[158px] sm:pl-[180px]"} space-y-2`}>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-24"></div>
            </div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-32"></div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="mt-8 sm:mt-12 rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#0F172A] p-6">
            <div className="flex justify-around items-center">
                {[1, 2, 3].map(i => (
                    <div key={i} className="text-center space-y-2">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-12 mx-auto"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-20 mx-auto"></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Info Grid Skeleton */}
        <div className="space-y-8">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="space-y-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
                        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Bio Section Skeleton */}
        <div className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="space-y-6">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
            {[1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-slate-200 dark:border-[#1E293B] p-5 space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-32"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-24"></div>
                        </div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-16"></div>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3"></div>
                </div>
            ))}
        </div>
    </div>
);
