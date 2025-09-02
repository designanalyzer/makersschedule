"use client";

import React, { useMemo, useState } from 'react';

// Product type definition
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'service' | 'consulting' | 'software' | 'maintenance';
  active: boolean;
}

// Customer type definition
interface Customer {
  id: string;
  company: string;
  personName: string;
  products: string[];
  incomeType: 'monthly' | 'one-time';
  incomeAmount: number;
  taxPercentage: number;
  startDate: string;
  notes?: string;
}

// Income transaction interface
interface IncomeTransaction {
  id: string;
  customer: string;
  work: string;
  amount: number;
  invoiceSent: string;
  status: 'paid' | 'late' | 'pending';
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

// Monthly income data for the chart (calculated from transactions)
interface MonthlyIncome {
  month: string;
  income: number;
  tax: number;
  netIncome: number;
}

// Available products
const availableProducts: Product[] = [
  {
    id: '1',
    name: 'Website Development',
    description: 'Custom website design and development',
    price: 2500,
    category: 'service',
    active: true
  },
  {
    id: '2',
    name: 'Monthly Maintenance',
    description: 'Ongoing website maintenance and updates',
    price: 500,
    category: 'maintenance',
    active: true
  },
  {
    id: '3',
    name: 'SEO Services',
    description: 'Search engine optimization strategy',
    price: 800,
    category: 'consulting',
    active: true
  },
  {
    id: '4',
    name: 'E-commerce Setup',
    description: 'Online store implementation',
    price: 3500,
    category: 'service',
    active: true
  },
  {
    id: '5',
    name: 'Content Creation',
    description: 'Website content writing and editing',
    price: 300,
    category: 'service',
    active: true
  }
];

// Your actual clients
const customers: Customer[] = [
  {
    id: '1',
    company: 'Multim',
    personName: 'Contact Person',
    products: ['Website Development', 'Monthly Maintenance'],
    incomeType: 'monthly',
    incomeAmount: 800,
    taxPercentage: 20,
    startDate: '2023-01-01',
    notes: 'Monthly website maintenance and updates'
  },
  {
    id: '2',
    company: 'EATfinland',
    personName: 'Contact Person',
    products: ['Website Development', 'SEO Services'],
    incomeType: 'monthly',
    incomeAmount: 1200,
    taxPercentage: 20,
    startDate: '2023-03-01',
    notes: 'Monthly SEO and website maintenance'
  },
  {
    id: '3',
    company: 'Tasodrums',
    personName: 'Contact Person',
    products: ['Website Development'],
    incomeType: 'one-time',
    incomeAmount: 2500,
    taxPercentage: 20,
    startDate: '2023-06-01',
    notes: 'One-time website development project'
  },
  {
    id: '4',
    company: 'Passive',
    personName: 'Contact Person',
    products: ['Website Development', 'Monthly Maintenance'],
    incomeType: 'monthly',
    incomeAmount: 600,
    taxPercentage: 20,
    startDate: '2023-09-01',
    notes: 'Monthly maintenance and occasional updates'
  }
];

// Sample income transactions
const sampleTransactions: IncomeTransaction[] = [
  {
    id: '1',
    customer: 'Multim',
    work: 'Website Maintenance',
    amount: 800,
    invoiceSent: '2025-09-01',
    status: 'paid',
    dueDate: '2025-09-15',
    paidDate: '2025-09-10',
    notes: 'Monthly maintenance'
  },
  {
    id: '2',
    customer: 'EATfinland',
    work: 'SEO Services',
    amount: 1200,
    invoiceSent: '2025-09-01',
    status: 'paid',
    dueDate: '2025-09-15',
    paidDate: '2025-09-12',
    notes: 'Monthly SEO work'
  },
  {
    id: '3',
    customer: 'Passive',
    work: 'Website Updates',
    amount: 600,
    invoiceSent: '2025-09-01',
    status: 'pending',
    dueDate: '2025-09-15',
    notes: 'Content updates'
  },
  {
    id: '4',
    customer: 'Tasodrums',
    work: 'New Feature Development',
    amount: 1500,
    invoiceSent: '2025-08-15',
    status: 'late',
    dueDate: '2025-09-01',
    notes: 'E-commerce integration'
  }
];

// Calculate monthly income from transactions
const calculateMonthlyIncome = (transactionsInput: IncomeTransaction[], year: number): MonthlyIncome[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => {
    const monthTransactions = transactionsInput.filter(t => {
      const transactionDate = new Date(t.invoiceSent);
      return transactionDate.getMonth() === index && transactionDate.getFullYear() === year;
    });

    const income = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const tax = income * 0.20; // 20% tax
    const netIncome = income - tax;

    return { month, income, tax, netIncome };
  });
};

export default function CRMPage() {
  const [customerList, setCustomerList] = useState<Customer[]>(customers);
  const [products, setProducts] = useState<Product[]>(availableProducts);
  const [transactions, setTransactions] = useState<IncomeTransaction[]>(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'company' | 'personName' | 'incomeAmount' | 'startDate'>('company');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter and sort customers
  const filteredCustomers = customerList
    .filter(customer => {
      const matchesSearch = customer.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.products.some(product => product.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'incomeAmount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === 'startDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === 'personName' || sortBy === 'company') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getIncomeTypeColor = (type: 'monthly' | 'one-time') => {
    switch (type) {
      case 'monthly': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'one-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getIncomeTypeLabel = (type: 'monthly' | 'one-time') => {
    switch (type) {
      case 'monthly': return 'Monthly';
      case 'one-time': return 'One-time';
      default: return type;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleSaveCustomer = (updatedCustomer: Customer) => {
    setCustomerList(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  // Calculate chart data from current state
  const currentYear = new Date().getFullYear();
  const monthlyIncome = useMemo(() => calculateMonthlyIncome(transactions, currentYear), [transactions, currentYear]);
  const maxIncome = Math.max(...monthlyIncome.map(m => m.income), 1);
  const chartHeight = 200;

      return (
        <>
        {/* Header with Stats */}
        <div className="-mx-4 lg:-mx-6 -mt-4 lg:-mt-6 bg-brand-dark pt-4 pb-8 w-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-2">Financial Dashboard</h1>
                <p className="text-gray-300 text-sm">Customer income tracking & tax management</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Current Period</div>
                <div className="text-lg font-medium text-white">September 2025</div>
              </div>
            </div>
            
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="bg-[#362222] rounded-xl border border-[#423f3e] border-t-2 border-t-brand-purple p-3 hover:bg-[#2b2b2b] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Invoices Sent This Month</p>
                    <p className="text-2xl font-semibold text-white">
                      {transactions.filter(t => new Date(t.invoiceSent).getMonth() === new Date().getMonth()).length}
                    </p>
                  </div>
                  <div className="p-2 bg-[#423f3e] rounded-lg">
                    <svg className="w-5 h-5 text-[#f2f2f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#362222] rounded-xl border border-[#423f3e] border-t-2 border-t-brand-blue p-3 hover:bg-[#2b2b2b] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Total Income</p>
                    <p className="text-2xl font-semibold text-white">
                      {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
                    </p>
                  </div>
                  <div className="p-2 bg-[#423f3e] rounded-lg">
                    <svg className="w-5 h-5 text-[#f2f2f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#362222] rounded-xl border border-[#423f3e] border-t-2 border-t-emerald-400 p-3 hover:bg-[#2b2b2b] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Income After Tax</p>
                    <p className="text-2xl font-semibold text-white">
                      {formatCurrency(transactions.reduce((sum, t) => sum + (t.amount * 0.8), 0))}
                    </p>
                  </div>
                  <div className="p-2 bg-[#423f3e] rounded-lg">
                    <svg className="w-5 h-5 text-[#f2f2f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* Revenue Chart - Calculated from Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <div className="text-sm text-gray-700 bg-brand-blue/10 px-3 py-1.5 rounded-lg">Calculated from {transactions.length} transactions</div>
            </div>
            <div className="flex items-end justify-between h-64 space-x-2">
              {monthlyIncome.map((month, index) => (
                <div key={month.month} className="flex flex-col items-center flex-1">
                  <div className="relative w-full">
                    <div 
                      className="bg-brand-purple rounded-t-lg w-full transition-all duration-300 hover:bg-brand-blue"
                      style={{ 
                        height: `${(month.income / maxIncome) * chartHeight}px`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <div 
                      className="bg-brand-blue rounded-t-lg w-full absolute bottom-0 transition-all duration-300 hover:bg-[#423f3e]"
                      style={{ 
                        height: `${(month.tax / maxIncome) * chartHeight}px`,
                        minHeight: '2px'
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    <div className="font-medium text-gray-900">{month.month}</div>
                    <div className="text-gray-500 text-xs mt-1">{formatCurrency(month.income)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-brand-purple rounded mr-2"></div>
                <span className="text-gray-700 font-medium">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-brand-blue rounded mr-2"></div>
                <span className="text-gray-700 font-medium">Tax</span>
              </div>
            </div>
          </div>

          {/* Income Transactions Table - Professional Accounting Style */}
          <div className="bg-white rounded-xl border border-gray-200 mb-8 hover:shadow-sm transition-all duration-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#8758ff]/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Income Transactions</h2>
                  <p className="text-gray-600 text-sm">Track all your invoices and payments</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Transaction
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Income transactions with status and notes</caption>
                <thead className="bg-[#8758ff]/10 border-b border-[#8758ff]/20">
                  <tr>
                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-[#181818] uppercase tracking-wider border-r border-[#8758ff]/20">
                      <div className="flex items-center">
                        <span>Customer</span>
                        <svg className="w-4 h-4 ml-2 text-[#8758ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>

                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-[#181818] uppercase tracking-wider border-r border-[#8758ff]/20">
                      <div className="flex items-center">
                        <span>Amount</span>
                        <svg className="w-4 h-4 ml-2 text-[#8758ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-[#181818] uppercase tracking-wider border-r border-[#8758ff]/20">
                      <div className="flex items-center">
                        <span>Invoice Date</span>
                        <svg className="w-4 h-4 ml-2 text-[#8758ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>

                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-[#181818] uppercase tracking-wider border-r border-[#8758ff]/20">
                      <div className="flex items-center">
                        <span>Status</span>
                        <svg className="w-4 h-4 ml-2 text-[#8758ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </th>
                    <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-[#181818] uppercase tracking-wider">
                      <div className="flex items-center">
                        <span>Notes</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {transaction.customer.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{transaction.customer}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                        <div className="text-sm font-bold text-gray-900 text-right">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                        <div className="text-sm text-gray-700">{formatDate(transaction.invoiceSent)}</div>
                      </td>

                      <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center">
                          <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                            transaction.status === 'paid' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : transaction.status === 'late'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {transaction.status === 'paid' && (
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            {transaction.status === 'late' && (
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                            {transaction.status === 'pending' && (
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            )}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={transaction.notes}>
                          {transaction.notes}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-8 py-4 bg-[#5cb8e4]/10 border-t border-[#5cb8e4]/20">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Showing {transactions.length} transactions</span>
                <div className="flex items-center space-x-6">
                  <span>Total: <span className="font-semibold text-[#181818]">{formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}</span></span>
                  <span>Paid: <span className="font-semibold text-[#8758ff]">{formatCurrency(transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0))}</span></span>
                  <span>Outstanding: <span className="font-semibold text-[#5cb8e4]">{formatCurrency(transactions.filter(t => t.status !== 'paid').reduce((sum, t) => sum + t.amount, 0))}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 hover:shadow-sm transition-all duration-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-[#ecbc55]/5">
              <h2 className="text-lg font-semibold text-gray-900">Client Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Client list with services and billing details</caption>
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Since</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {customer.company.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.company}</div>
                            <div className="text-xs text-gray-500">{customer.personName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {customer.products.map((product, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              {product}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getIncomeTypeColor(customer.incomeType)}`}>
                          {getIncomeTypeLabel(customer.incomeType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(customer.incomeAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.taxPercentage}% ({formatCurrency(customer.incomeAmount * customer.taxPercentage / 100)})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditCustomer(customer)}
                            className="text-gray-600 hover:text-gray-800 transition-all duration-200"
                          >
                            Edit
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-all duration-200">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">No clients found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'Get started by adding your first client.'
                }
              </p>
            </div>
          )}

          {/* Services Catalog - Always Visible */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Service Catalog</h2>
              <span className="text-sm text-gray-500 bg-[#432c51]/10 px-3 py-1.5 rounded-lg">{products.length} active services</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.active 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Customer Modal */}
          {isEditModalOpen && editingCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Client</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={editingCustomer.company}
                      onChange={(e) => setEditingCustomer({...editingCustomer, company: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={editingCustomer.personName}
                      onChange={(e) => setEditingCustomer({...editingCustomer, personName: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Income Amount (€)</label>
                    <input
                      type="number"
                      value={editingCustomer.incomeAmount}
                      onChange={(e) => setEditingCustomer({...editingCustomer, incomeAmount: Number(e.target.value)})}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tax Percentage (%)</label>
                    <input
                      type="number"
                      value={editingCustomer.taxPercentage}
                      onChange={(e) => setEditingCustomer({...editingCustomer, taxPercentage: Number(e.target.value)})}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Income Type</label>
                    <select
                      value={editingCustomer.incomeType}
                      onChange={(e) => setEditingCustomer({...editingCustomer, incomeType: e.target.value as 'monthly' | 'one-time'})}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={editingCustomer.startDate}
                      onChange={(e) => setEditingCustomer({...editingCustomer, startDate: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Services</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {products.filter(p => p.active).map((product) => (
                      <label key={product.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCustomer.products.includes(product.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingCustomer({
                                ...editingCustomer,
                                products: [...editingCustomer.products, product.name]
                              });
                            } else {
                              setEditingCustomer({
                                ...editingCustomer,
                                products: editingCustomer.products.filter(p => p !== product.name)
                              });
                            }
                          }}
                          className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-900">{product.name}</span>
                          <span className="text-xs text-slate-500 block">{formatCurrency(product.price)}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={editingCustomer.notes || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveCustomer(editingCustomer)}
                    className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
  );
} 