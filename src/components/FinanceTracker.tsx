import React, { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  id: string;
  type: "pemasukan" | "pengeluaran";
  amount: number;
  description: string;
  date: Date;
}

export const FinanceTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"pemasukan" | "pengeluaran">("pemasukan");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filter, setFilter] = useState<
    "semua" | "hari-ini" | "minggu-ini" | "bulan-ini"
  >("semua");

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTransactions(
        parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (amount && description.trim()) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date(selectedDate),
      };
      setTransactions([...transactions, transaction]);
      setAmount("");
      setDescription("");
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(
        transaction.date.getFullYear(),
        transaction.date.getMonth(),
        transaction.date.getDate()
      );

      switch (filter) {
        case "hari-ini":
          return transactionDate.getTime() === today.getTime();
        case "minggu-ini":
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return transactionDate >= weekStart && transactionDate <= weekEnd;
        case "bulan-ini":
          const monthEnd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          );
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const totalPemasukan = filteredTransactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaran = filteredTransactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  // Chart data
  const chartData = [
    {
      name: "Pemasukan",
      amount: totalPemasukan,
    },
    {
      name: "Pengeluaran",
      amount: totalPengeluaran,
    },
  ];

  const balanceData = filteredTransactions
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc, transaction, index) => {
      const runningBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const newBalance =
        transaction.type === "pemasukan"
          ? runningBalance + transaction.amount
          : runningBalance - transaction.amount;

      return [
        ...acc,
        {
          name: `Hari ${index + 1}`,
          balance: newBalance,
        },
      ];
    }, [] as { name: string; balance: number }[]);

  const periods = [
    { value: "semua", label: "Semua" },
    { value: "hari-ini", label: "Hari Ini" },
    { value: "minggu-ini", label: "Minggu Ini" },
    { value: "bulan-ini", label: "Bulan Ini" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h3 className="font-medium">Total Pemasukan</h3>
              <p className="text-2xl font-bold">
                {formatRupiah(totalPemasukan)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8" />
            <div>
              <h3 className="font-medium">Total Pengeluaran</h3>
              <p className="text-2xl font-bold">
                {formatRupiah(totalPengeluaran)}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${
            saldo >= 0 ? "from-blue-400 to-blue-500" : "from-red-400 to-red-500"
          } text-white rounded-2xl p-6 shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h3 className="font-medium">Saldo</h3>
              <p className="text-2xl font-bold">{formatRupiah(saldo)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-200/30">
        <h2 className="text-xl font-bold text-pink-800 mb-4">
          Tambah Transaksi
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => setType("pemasukan")}
              className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                type === "pemasukan"
                  ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💰 Pemasukan
            </button>
            <button
              onClick={() => setType("pengeluaran")}
              className={`flex-1 p-3 rounded-xl font-medium transition-all ${
                type === "pengeluaran"
                  ? "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💸 Pengeluaran
            </button>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Jumlah (Rp)"
            className="w-full p-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors bg-white/50"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi transaksi"
            className="w-full p-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors bg-white/50"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-pink-700 text-sm font-medium mb-2">
                Tanggal Transaksi
              </label>
              <input
                type="date"
               value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all bg-white/70"
              />
            </div>
            <div className="flex items-end">
              <button   onClick={addTransaction} className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-4 rounded-2xl hover:from-pink-500 hover:to-rose-500 transition-all transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-3 font-medium">
              
                <Plus size={20} />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-pink-700 text-sm font-medium mb-2">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors bg-white/50 text-sm"
              />
            </div>
            <button
              style={{ height: "35px", marginBottom: "5px" }}
              onClick={addTransaction}
              className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-3 py-1.5 rounded-md hover:from-pink-500 hover:to-rose-500 transition-all transform hover:scale-105 shadow-sm flex items-center justify-center gap-1 text-xs font-medium"
            >
              <Plus size={14} />
              <span>Tambah</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-pink-200/30">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setFilter(period.value as any)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === period.value
                  ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg"
                  : "text-pink-700 hover:bg-pink-100"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-200/30">
          <h3 className="text-lg font-bold text-pink-800 mb-4">
            Perbandingan Pemasukan vs Pengeluaran
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#be185d" />
              <YAxis stroke="#be185d" />
              <Tooltip
                formatter={(value: number) => [formatRupiah(value), ""]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #fbcfe8",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="amount" fill="#f472b6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-200/30">
          <h3 className="text-lg font-bold text-pink-800 mb-4">
            Perkembangan Saldo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#be185d" />
              <YAxis stroke="#be185d" />
              <Tooltip
                formatter={(value: number) => [formatRupiah(value), "Saldo"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #fbcfe8",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#ec4899"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-200/30">
        <h3 className="text-lg font-bold text-pink-800 mb-4">
          Riwayat Transaksi
        </h3>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <p className="text-pink-600">
              Belum ada transaksi nih! Yuk mulai catat keuangan kamu! 💰
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-pink-100 hover:bg-white/70 transition-colors animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "pemasukan"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "pemasukan" ? "💰" : "💸"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.date.toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === "pemasukan"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "pemasukan" ? "+" : "-"}
                      {formatRupiah(transaction.amount)}
                    </p>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
