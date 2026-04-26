"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlanCard {
  name: string;
  monthlyPriceLabel: string;
  annualPriceLabel?: string;
  summary: string;
  items: string[];
  ctaLabel: string;
}

const PLAN_CARDS: PlanCard[] = [
  {
    name: 'Basic',
    monthlyPriceLabel: 'Free',
    summary: 'Your private finance command center, free forever',
    items: [
      'Zero-Access Core: encrypted account visibility without server-side raw data exposure.',
      'Multi-Source Sync: connect fiat and on-chain sources with strict read-only permissions.',
      'Privacy Dashboard: 30-day private analytics with no ad tracking.',
    ],
    ctaLabel: 'Get Started Free',
  },
  {
    name: 'Pro',
    monthlyPriceLabel: '$12.99 / mo',
    annualPriceLabel: '$129.99 billed annually (~$10.83/mo)',
    summary: 'Smarter market insights and everyday money control',
    items: [
      'Everything in Essential',
      'Market Intelligence with key stock and crypto metrics.',
      'DeFi Protocol Insights across leading ecosystems.',
      'Budget Planner with customizable categories.',
      'Priority Sync: 5 manual syncs/day + scheduled sync every 6 hours.',
    ],
    ctaLabel: 'Start Pro Trial',
  },
  {
    name: 'Ultimate',
    monthlyPriceLabel: '$29.99 / mo',
    annualPriceLabel: '$299.99 billed annually (~$24.99/mo)',
    summary: 'Institutional-grade analytics for serious operators',
    items: [
      'Everything in Pro',
      'Impermanent Loss Tracking powered by privacy-preserving compute.',
      'Tax Report Download with secure calculations.',
      'Unlimited History for full retention analytics.',
      'High-Frequency Sync: 20 manual syncs/day + hourly background sync.',
    ],
    ctaLabel: 'Go Ultimate',
  },
];

export default function PlansModal({ isOpen, onClose }: PlansModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const plans = useMemo(() => {
    return PLAN_CARDS.map((plan) => {
      const displayPriceLabel =
        billingCycle === 'annually' && plan.annualPriceLabel ? plan.annualPriceLabel : plan.monthlyPriceLabel;
      return { ...plan, displayPriceLabel };
    });
  }, [billingCycle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close plans modal"
      />

      <div className="relative w-full max-w-5xl rounded-2xl border border-[var(--kura-border)] bg-[var(--kura-bg-light)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--kura-border)] px-5 py-4">
          <h2 className="text-2xl font-semibold text-[var(--kura-text)]">Choose a Plan</h2>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-[var(--kura-border)] bg-[var(--kura-surface)] p-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-[var(--kura-primary)] text-white'
                    : 'text-[var(--kura-text-secondary)] hover:text-[var(--kura-text)]'
                }`}
              >
                Pay monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annually')}
                className={`ml-1 px-3 py-1.5 rounded-md text-xs transition-colors ${
                  billingCycle === 'annually'
                    ? 'bg-[var(--kura-primary)] text-white'
                    : 'text-[var(--kura-text-secondary)] hover:text-[var(--kura-text)]'
                }`}
              >
                Pay annually (-15%)
              </button>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              ×
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {plans.map((plan) => (
            <section key={plan.name} className="p-5 border-r border-[var(--kura-border)] last:border-r-0">
              <h3 className="text-lg font-semibold text-[var(--kura-text)]">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold text-[var(--kura-text)]">{plan.displayPriceLabel}</p>
              <p className="mt-2 text-sm text-[var(--kura-text-secondary)]">{plan.summary}</p>

              <Button className="w-full mt-4">{plan.ctaLabel}</Button>

              <ul className="mt-4 space-y-2">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--kura-text)]">
                    <span className="text-[var(--kura-success)]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
