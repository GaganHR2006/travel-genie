"use client";
import { motion } from "framer-motion";
import { Users, DollarSign, Calculator, Check, Plus, Receipt, Share2 } from "lucide-react";
import { useState } from "react";

interface Props {
    travelers: string[];
    expenses?: { description: string; amount: number; paidBy: string }[];
}

const defaultExpenses = [
    { description: "Hotel (3 nights)", amount: 450, paidBy: "Alice" },
    { description: "Dinner at local restaurant", amount: 125, paidBy: "Bob" },
    { description: "Museum tickets", amount: 60, paidBy: "Alice" },
    { description: "Taxi to airport", amount: 45, paidBy: "Charlie" },
    { description: "Lunch at cafe", amount: 35, paidBy: "Bob" },
];

const travelerColors: Record<string, string> = {
    Alice: "bg-pink-500",
    Bob: "bg-blue-500",
    Charlie: "bg-green-500",
    You: "bg-purple-500",
};

export default function SplitExpenseTracker({ travelers, expenses: initialExpenses }: Props) {
    const [expenses, setExpenses] = useState(initialExpenses || defaultExpenses);
    const travelersWithDefault = travelers.length > 0 ? travelers : ["Alice", "Bob", "Charlie"];

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPerson = totalAmount / travelersWithDefault.length;

    // Calculate balances
    const calculateBalances = () => {
        const paid: Record<string, number> = {};
        travelersWithDefault.forEach(t => paid[t] = 0);
        expenses.forEach(exp => {
            if (paid[exp.paidBy] !== undefined) {
                paid[exp.paidBy] += exp.amount;
            }
        });

        const balances: Record<string, number> = {};
        travelersWithDefault.forEach(t => {
            balances[t] = paid[t] - perPerson;
        });
        return balances;
    };

    const balances = calculateBalances();

    // Calculate settlements
    const calculateSettlements = () => {
        const settlements: { from: string; to: string; amount: number }[] = [];
        const debts = travelersWithDefault.map(t => ({ name: t, balance: balances[t] }));

        const debtors = debts.filter(d => d.balance < 0).sort((a, b) => a.balance - b.balance);
        const creditors = debts.filter(d => d.balance > 0).sort((a, b) => b.balance - a.balance);

        for (const debtor of debtors) {
            let remaining = -debtor.balance;
            for (const creditor of creditors) {
                if (remaining <= 0) break;
                if (creditor.balance <= 0) continue;

                const amount = Math.min(remaining, creditor.balance);
                if (amount > 0.01) {
                    settlements.push({
                        from: debtor.name,
                        to: creditor.name,
                        amount: Math.round(amount * 100) / 100,
                    });
                }
                remaining -= amount;
                creditor.balance -= amount;
            }
        }

        return settlements;
    };

    const settlements = calculateSettlements();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 shadow-xl border border-green-200 dark:border-green-800 max-w-2xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                    <Receipt className="text-green-600" />
                    Split Expense Tracker
                </motion.h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Travelers */}
            <div className="flex flex-wrap gap-2 mb-4">
                {travelersWithDefault.map((traveler) => (
                    <span
                        key={traveler}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                        <div className={`w-3 h-3 rounded-full ${travelerColors[traveler] || 'bg-gray-500'}`} />
                        {traveler}
                    </span>
                ))}
            </div>

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 mb-4"
            >
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-sm text-green-100 mb-1">Total</div>
                        <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-green-100 mb-1">Per Person</div>
                        <div className="text-2xl font-bold">${perPerson.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-green-100 mb-1">Travelers</div>
                        <div className="text-2xl font-bold">{travelersWithDefault.length}</div>
                    </div>
                </div>
            </motion.div>

            {/* Expenses List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden">
                <div className="max-h-[200px] overflow-y-auto">
                    {expenses.map((expense, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + idx * 0.05 }}
                            className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${travelerColors[expense.paidBy] || 'bg-gray-500'}`} />
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white text-sm">{expense.description}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Paid by {expense.paidBy}</div>
                                </div>
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</div>
                        </motion.div>
                    ))}
                </div>
                <button className="w-full p-3 text-green-600 dark:text-green-400 font-medium text-sm flex items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                    <Plus className="w-4 h-4" />
                    Add Expense
                </button>
            </div>

            {/* Balances */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                    Balances
                </h3>
                <div className="space-y-2">
                    {travelersWithDefault.map((traveler, idx) => {
                        const balance = balances[traveler];
                        const isPositive = balance > 0;
                        const isNeutral = Math.abs(balance) < 0.01;

                        return (
                            <motion.div
                                key={traveler}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + idx * 0.05 }}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${travelerColors[traveler] || 'bg-gray-500'}`} />
                                    <span className="font-medium text-gray-900 dark:text-white">{traveler}</span>
                                </div>
                                <span className={`font-bold ${isNeutral
                                        ? 'text-gray-500'
                                        : isPositive
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {isNeutral ? 'Settled' : `${isPositive ? '+' : ''}$${balance.toFixed(2)}`}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Settlements */}
            {settlements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
                >
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        To Settle Up
                    </h3>
                    <div className="space-y-2">
                        {settlements.map((settlement, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3"
                            >
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{settlement.from}</span>
                                    <span className="text-gray-400">→</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{settlement.to}</span>
                                </div>
                                <span className="font-bold text-amber-600 dark:text-amber-400">${settlement.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
