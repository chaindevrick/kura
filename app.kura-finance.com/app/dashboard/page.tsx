// src/app/dashboard/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import AccountCarousel from './_components/AccountCarousel';
import TransactionsModal from './_components/TransactionsModal';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAppStore } from '@/store/useAppStore';
import { updatePlaidAccountOrder } from '@/lib/plaidApi';

const ConnectAccountModal = dynamic(() => import('@/components/ConnectAccountModal'), {
  ssr: false,
});

export default function DashboardPage() {
  const accounts = useFinanceStore(state => state.accounts);
  const setAccounts = useFinanceStore(state => state.setAccounts);
  const transactions = useFinanceStore(state => state.transactions);
  const authStatus = useAppStore(state => state.authStatus);
  const authToken = useAppStore(state => state.authToken);

  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  const openConnectFlow = () => {
    setIsConnectModalOpen(true);
  };

  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => {
      return curr.type === 'credit' ? acc - curr.balance : acc + curr.balance;
    }, 0);
  }, [accounts]);

  const selectedAccount = selectedAccountId === 'all' 
    ? { id: 'all', type: 'all', name: 'All Accounts' } 
    : accounts.find(a => a.id === selectedAccountId);

  const transactionHeader = selectedAccount?.type === 'all'
    ? 'Recent Transactions'
    : selectedAccount?.type === 'credit'
      ? 'Transaction History'
      : selectedAccount?.type === 'saving'
        ? 'Savings Transactions'
        : 'Transfer Records';

  // 核心邏輯：根據選中的帳戶過濾交易資料
  const displayTransactions = useMemo(() => {
    if (selectedAccountId === 'all') return transactions;
    return transactions.filter(tx => tx.accountId === selectedAccountId);
  }, [transactions, selectedAccountId]);



  const handleAccountsReorder = async (nextAccounts: typeof accounts) => {
    setAccounts(nextAccounts);

    if (authStatus !== 'authenticated' || !authToken) {
      return;
    }

    try {
      await updatePlaidAccountOrder(authToken, {
        accountIds: nextAccounts.map((account) => account.id),
      });
    } catch (error) {
      console.error('Failed to persist account order', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {isConnectModalOpen && (
        <ConnectAccountModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
        />
      )}


      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Here is the summary of your fiat assets.</p>
      </div>
      
      <AccountCarousel 
        accounts={accounts}
        totalBalance={totalBalance}
        selectedId={selectedAccountId}
        onAccountSelect={(id) => setSelectedAccountId(id)}
        onConnectAccount={openConnectFlow}
        onAccountsReorder={(nextAccounts) => void handleAccountsReorder(nextAccounts)}
      />

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-white">Activity</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          <div className="rounded-3xl bg-[#1A1A24] border border-white/5 p-8 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                {transactionHeader}
              </h3>
              <span className="text-xs font-mono text-[#A78BFA] bg-[#8B5CF6]/10 px-3 py-1 rounded-full uppercase">
                Plaid Real-time
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden pr-2 hide-scrollbar">
              {displayTransactions.slice(0, 4).map((tx) => {
                const isExpense = tx.type === 'credit' || tx.type === 'transfer';
                return (
                  <div key={tx.id} className="flex w-full min-w-0 justify-between items-center py-3 border-b border-white/5 last:border-0 text-gray-400 group hover:bg-white/[0.02] px-3 rounded-xl transition-colors">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0B0B0F] flex items-center justify-center border border-white/5 group-hover:border-[#8B5CF6]/30 transition-colors">
                        {tx.type === 'deposit' ? '💰' : tx.type === 'transfer' ? '🔄' : '🛍️'}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-white font-medium group-hover:text-[#A78BFA] transition-colors">{tx.merchant}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{tx.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className={`rounded-full px-2 py-0.5 uppercase tracking-wider ${tx.accountType === 'saving' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/5 text-gray-400'}`}>
                            {tx.accountType === 'saving' ? 'Savings' : tx.accountType === 'checking' ? 'Checking' : tx.accountType === 'credit' ? 'Credit' : 'Crypto'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`shrink-0 pl-3 font-mono font-medium ${isExpense ? 'text-white' : 'text-green-400'}`}>
                      {isExpense ? '-' : '+'}${tx.amount}
                    </div>
                  </div>
                );
              })}
              
              {displayTransactions.length === 0 && (
                <div className="flex h-full items-center justify-center text-gray-500 italic">
                  No recent activity found.
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 py-3.5 rounded-xl border border-white/5 bg-[#0B0B0F]/50 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] hover:border-white/10 transition-all flex items-center justify-center gap-2 group cursor-pointer shrink-0"
            >
              View All Activity
              <span className="group-hover:translate-x-1 transition-transform text-[#8B5CF6]">→</span>
            </button>
          </div>


        </div>
      </div>

      <TransactionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactions={displayTransactions}
        accountName={selectedAccount?.name || 'All Accounts'}
      />
    </div>
  );
}