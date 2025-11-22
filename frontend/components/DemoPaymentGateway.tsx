'use client';

import React, { useState } from 'react';

interface DemoPaymentGatewayProps {
    amount: number;
    onSuccess: (paymentData: any) => void;
    onFailure: (error: string) => void;
    onCancel: () => void;
}

export default function DemoPaymentGateway({ amount, onSuccess, onFailure, onCancel }: DemoPaymentGatewayProps) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
    const [processing, setProcessing] = useState(false);

    // Card fields
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');

    // UPI field
    const [upiId, setUpiId] = useState('');

    // Wallet field
    const [walletType, setWalletType] = useState('demo');

    const handlePayment = async () => {
        setProcessing(true);

        let paymentDetails: any = {};

        if (paymentMethod === 'card') {
            if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
                onFailure('Please fill all card details');
                setProcessing(false);
                return;
            }
            paymentDetails = { cardNumber, cardName, cardExpiry, cardCVV };
        } else if (paymentMethod === 'upi') {
            if (!upiId) {
                onFailure('Please enter UPI ID');
                setProcessing(false);
                return;
            }
            paymentDetails = { upiId };
        } else if (paymentMethod === 'wallet') {
            paymentDetails = { walletType };
        }

        // Simulate processing delay
        setTimeout(() => {
            onSuccess({ paymentMethod, paymentDetails });
            setProcessing(false);
        }, 2500);
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Demo Payment Gateway</h2>
                <div className="text-right">
                    <div className="text-sm text-slate-400">Total Amount</div>
                    <div className="text-2xl font-bold text-blue-400">₹{amount}</div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    ⚠️ This is a DEMO payment gateway. No real transactions will be processed.
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className={`py-3 rounded-lg font-medium transition-all ${paymentMethod === 'card'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        💳 Card
                    </button>
                    <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-3 rounded-lg font-medium transition-all ${paymentMethod === 'upi'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        📱 UPI
                    </button>
                    <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`py-3 rounded-lg font-medium transition-all ${paymentMethod === 'wallet'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        👛 Wallet
                    </button>
                </div>

                {paymentMethod === 'card' && (
                    <div className="space-y-4">
                        <div className="text-xs text-slate-400 bg-slate-900 rounded p-2 mb-4">
                            Test Cards: <span className="text-green-400">4111 1111 1111 1111</span> (Success) | <span className="text-red-400">4000 0000 0000 0002</span> (Fail)
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Card Number</label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Cardholder Name</label>
                            <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Expiry (MM/YY)</label>
                                <input
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="12/25"
                                    maxLength={5}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">CVV</label>
                                <input
                                    type="text"
                                    value={cardCVV}
                                    onChange={(e) => setCardCVV(e.target.value)}
                                    placeholder="123"
                                    maxLength={3}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                        <div className="text-xs text-slate-400 bg-slate-900 rounded p-2 mb-4">
                            Test UPI: <span className="text-green-400">test@upi</span> (Success) | <span className="text-red-400">fail@upi</span> (Fail)
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">UPI ID</label>
                            <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="yourname@upi"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                            />
                        </div>
                    </div>
                )}

                {paymentMethod === 'wallet' && (
                    <div className="space-y-4">
                        <div className="text-xs text-slate-400 bg-slate-900 rounded p-2 mb-4">
                            Demo Wallet has unlimited balance for testing
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Select Wallet</label>
                            <select
                                value={walletType}
                                onChange={(e) => setWalletType(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                            >
                                <option value="demo">Demo Wallet (Always Success)</option>
                                <option value="test">Test Wallet (Random)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        `Pay ₹${amount}`
                    )}
                </button>
                <button
                    onClick={onCancel}
                    disabled={processing}
                    className="px-6 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
