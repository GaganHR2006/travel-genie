"use client";
import { motion } from "framer-motion";
import { DollarSign, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
    category?: string;
    amount?: number;
}

export default function ExpenseTracker({ category, amount }: Props) {
    const [expenses] = useState([
        { category: "Food", amount: 125, color: "#3b82f6" },
        { category: "Transport", amount: 45, color: "#ef4444" },
        { category: "Activities", amount: 80, color: "#f59e0b" },
        { category: "Shopping", amount: 60, color: "#8b5cf6" },
    ]);

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budget = 500;
    const remaining = budget - totalSpent;
    const percentSpent = Math.round((totalSpent / budget) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-2xl p-6 shadow-xl border border-orange-200 dark:border-orange-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <DollarSign className="text-orange-600" /> Expense Tracker
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">${budget}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Spent</div>
                    <div className="text-2xl font-bold text-orange-600">${totalSpent}</div>
                    <div className="text-xs text-gray-500 mt-1">{percentSpent}% of budget</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</div>
                    <div className={`text-2xl font-bold ${remaining > 0 ? "text-emerald-600" : "text-red-600"}`}>${Math.abs(remaining)}</div>
                    <div className="flex items-center gap-1 text-xs mt-1">
                        {remaining > 0 ? (
                            <><TrendingDown className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">On track</span></>
                        ) : (
                            <><TrendingUp className="w-3 h-3 text-red-500" /><span className="text-red-600">Over budget</span></>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={expenses} cx="50%" cy="50%" labelLine={false} outerRadius={70} fill="#8884d8" dataKey="amount">
                                {expenses.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                    {expenses.map((expense, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expense.color }} />
                                <span className="font-medium text-gray-900 dark:text-white">{expense.category}</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">${expense.amount}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3"><Plus className="w-5 h-5" /><span className="font-bold">Quick Add Expense</span></div>
                <div className="grid grid-cols-4 gap-2">
                    {["Food", "Transport", "Activity", "Shopping"].map((cat) => (
                        <button key={cat} className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-2 text-sm font-semibold">{cat}</button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
