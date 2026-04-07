import React from 'react';

// Skeleton shimmer block
const Shimmer = ({ className = '' }) => (
  <div className={`bg-neutral-200 rounded-2xl animate-pulse ${className}`} />
);

// Hero skeleton
export const HeroSkeleton = () => (
  <section className="relative h-screen w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
    <div className="relative z-10 text-center px-6 max-w-4xl w-full space-y-8">
      <Shimmer className="h-8 w-48 mx-auto rounded-full bg-neutral-700" />
      <Shimmer className="h-24 w-full max-w-2xl mx-auto bg-neutral-700" />
      <Shimmer className="h-8 w-96 mx-auto bg-neutral-700" />
      <div className="flex justify-center gap-4">
        <Shimmer className="h-14 w-40 rounded-[2rem] bg-neutral-700" />
        <Shimmer className="h-14 w-40 rounded-[2rem] bg-neutral-700" />
      </div>
    </div>
  </section>
);

// Card grid skeleton (for mading, gallery, etc)
export const CardGridSkeleton = ({ count = 3, dark = false }) => (
  <section className={`py-20 w-full ${dark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
    <div className="container mx-auto px-6">
      <div className="mb-16 space-y-4">
        <Shimmer className={`h-4 w-32 ${dark ? 'bg-neutral-700' : ''}`} />
        <Shimmer className={`h-12 w-72 ${dark ? 'bg-neutral-700' : ''}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`rounded-3xl overflow-hidden ${dark ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
            <Shimmer className={`h-64 rounded-none ${dark ? 'bg-neutral-700' : ''}`} />
            <div className="p-8 space-y-3">
              <Shimmer className={`h-6 w-3/4 ${dark ? 'bg-neutral-700' : ''}`} />
              <Shimmer className={`h-4 w-full ${dark ? 'bg-neutral-700' : ''}`} />
              <Shimmer className={`h-4 w-2/3 ${dark ? 'bg-neutral-700' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Profile skeleton (About page)
export const ProfileSkeleton = () => (
  <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 py-20">
    <Shimmer className="h-[500px] rounded-[4rem]" />
    <div className="space-y-6 py-8">
      <Shimmer className="h-4 w-32" />
      <Shimmer className="h-16 w-full" />
      <Shimmer className="h-32 w-full" />
      <div className="flex gap-10 pt-8 border-t border-neutral-100">
        <div className="space-y-2">
          <Shimmer className="h-12 w-20" />
          <Shimmer className="h-3 w-24" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-12 w-20" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
    </div>
  </div>
);

// Full page loader (replaces the plain text boot screen)
export const AppLoader = ({ text = 'Memuat...' }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-neutral-950 gap-8">
    <div className="relative">
      <div className="w-20 h-20 rounded-full border-4 border-neutral-800 border-t-emerald-500 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 animate-pulse" />
      </div>
    </div>
    <p className="text-emerald-500 font-black uppercase tracking-[0.5em] text-xs animate-pulse">{text}</p>
  </div>
);

export default { HeroSkeleton, CardGridSkeleton, ProfileSkeleton, AppLoader };
