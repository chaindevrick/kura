// src/components/PlaidLinkWrapper.tsx
"use client";

import { useMemo } from 'react';
import { usePlaidLink, type PlaidLinkOnSuccessMetadata, type PlaidLinkOptions } from 'react-plaid-link';

interface PlaidLinkWrapperProps {
  token: string | null;
  onSuccess: (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => void;
  onExit?: (error: any) => void;
  onEvent?: (eventName: string) => void;
}

/**
 * Wrapper component for usePlaidLink that handles Plaid SDK loading safely
 * Prevents errors when Plaid SDK is not yet available
 */
export function PlaidLinkWrapper({ token, onSuccess, onExit, onEvent }: PlaidLinkWrapperProps) {
  // Safely handle usePlaidLink hook with null token initially
  let plaidLink = useMemo(() => {
    return { open: () => {}, ready: false };
  }, []);

  try {
    const options: PlaidLinkOptions = {
      token: token || null,
      onSuccess,
      onExit: (err) => {
        if (onExit) onExit(err);
      },
      onEvent: (eventName) => {
        if (onEvent) onEvent(eventName);
      },
    };

    const result = usePlaidLink(options);
    plaidLink = result;
  } catch (error) {
    console.error('[PlaidLinkWrapper] Failed to initialize Plaid Link:', error);
  }

  return { open: plaidLink.open, ready: plaidLink.ready };
}

export type PlaidLinkResult = ReturnType<typeof PlaidLinkWrapper>;
