"use client";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";
import { MOCK_CURRENCY_RATES } from "@/lib/mockData";

interface Props {
    from: string;
    to: string;
    amount?: number;
}

export default function CurrencyConverter({ from, to, amount = 100 }: Props) {
    const [fromCurrency, setFromCurrency] = useState(from);
    const [toCurrency, setToCurrency] = useState(to);
    const [inputAmount, setInputAmount] = useState(amount);

    const currencies = Object.keys(MOCK_CURRENCY_RATES);
    const rate = MOCK_CURRENCY_RATES[toCurrency] / MOCK_CURRENCY_RATES[fromCurrency];
    const convertedAmount = (inputAmount * rate).toFixed(2);
    const commonAmounts = [10, 50, 100, 500, 1000];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 shadow-xl border border-green-200 dark:border-green-800"
        >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <DollarSign className="text-green-600" /> Currency Converter
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">From</label>
                        <div className="flex gap-2">
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                            >
                                {currencies.map((curr) => <option key={curr} value={curr}>{curr}</option>)}
                            </select>
                            <input
                                type="number"
                                value={inputAmount}
                                onChange={(e) => setInputAmount(Number(e.target.value))}
                                className="w-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">To</label>
                        <div className="flex gap-2">
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                            >
                                {currencies.map((curr) => <option key={curr} value={curr}>{curr}</option>)}
                            </select>
                            <div className="w-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 font-bold">
                                {convertedAmount}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600">Exchange Rate: </span>
                    <span className="text-lg font-bold text-green-600">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Convert</h3>
                <div className="grid grid-cols-5 gap-2">
                    {commonAmounts.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setInputAmount(amt)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-green-50"
                        >
                            <div className="text-xs text-gray-600">{amt} {fromCurrency}</div>
                            <div className="font-bold text-green-600 text-sm">{(amt * rate).toFixed(2)} {toCurrency}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold mb-1">💰 Money Saving Tip</h3>
                    <p className="text-sm text-green-50">Use ATMs or local exchange offices for better rates than airports.</p>
                </div>
            </div>
        </motion.div>
    );
}
