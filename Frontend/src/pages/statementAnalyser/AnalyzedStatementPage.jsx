import { useMemo, useState } from 'react';
import {
  ArrowLeft, Download, AlertCircle, TrendingUp, Zap, Eye, EyeOff
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import MainHeader from '../../components/MainHeader';
import BottomNavigation from '../../components/BottomNavigation';
import { getThemeTokens } from '../../theme/theme';

const fmtINR = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const categoryColors = {
  GROCERIES: '#2dd4bf',
  ENTERTAINMENT: '#f59e0b',
  ELECTRONICS: '#3b82f6',
  SALARY: '#34d399',
  DINING: '#f97a76',
  UTILITIES: '#8b5cf6',
  TRANSPORT: '#ec4899',
  HEALTHCARE: '#14b8a6',
  SHOPPING: '#f43f5e',
  OTHER: '#6b7280',
};

export default function AnalyzedStatementPage({ theme = 'dark', onToggleTheme }) {
  const t = getThemeTokens(theme);
  const navigate = useNavigate();
  const location = useLocation();
  const analysisData = location.state;
  const [showTransactions, setShowTransactions] = useState(true);

  if (!analysisData) {
    return (
      <div style={{ background: t.bg, color: t.text, minHeight: '100vh' }}>
        <Sidebar theme={theme} />
        <MainHeader theme={theme} onToggleTheme={onToggleTheme} />
        <div className="ml-[200px] lg:ml-[200px] flex items-center justify-center py-20">
          <button
            onClick={() => navigate('/statement-analyzer')}
            className="px-6 py-3 rounded-xl font-semibold"
            style={{ background: t.primary, color: '#0a0f1e' }}
          >
            Go Back to Statement Analyzer
          </button>
        </div>
        <BottomNavigation theme={theme} />
      </div>
    );
  }

  const { summary, statements, insights } = analysisData;

  // Calculate spending by category
  const categorySpending = useMemo(() => {
    const categories = {};
    statements.forEach((statement) => {
      statement.transactions.forEach((tx) => {
        if (tx.amount < 0) {
          categories[tx.category] = (categories[tx.category] || 0) + Math.abs(tx.amount);
        }
      });
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [statements]);

  // Monthly income vs expenses
  const monthlyData = [
    { month: 'Jan', income: 5200, expenses: 3800 },
    { month: 'Feb', income: 4800, expenses: 4200 },
    { month: 'Mar', income: 7850, expenses: 4312 },
  ];

  const allTransactions = useMemo(() => {
    const txs = [];
    statements.forEach((statement) => {
      txs.push(...statement.transactions);
    });
    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [statements]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'SPENDING_ALERT':
        return <AlertCircle size={20} />;
      case 'LEARNING_OPPORTUNITY':
        return <Zap size={20} />;
      case 'WEALTH_PROJECTION':
        return <TrendingUp size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getInsightColor = (severity) => {
    switch (severity) {
      case 'warning':
        return { bg: t.warningSoft, fg: t.warning };
      case 'info':
        return { bg: t.primarySoft, fg: t.primary };
      case 'success':
        return { bg: t.successSoft, fg: t.success };
      default:
        return { bg: t.primarySoft, fg: t.primary };
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh', transition: 'background .3s ease, color .3s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-display { font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .hover-lift { transition: transform .18s ease, box-shadow .18s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        ::selection { background: ${t.primary}33; }
      `}</style>

      <Sidebar theme={theme} />
      <MainHeader theme={theme} onToggleTheme={onToggleTheme} />

      <main className="pt-24 pb-20 lg:pb-10 lg:ml-[280px] px-4 lg:px-10 min-h-screen">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                type="button"
                className="hover-lift inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium mb-4"
                style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.textMuted }}
                onClick={() => navigate('/statement-analyzer')}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1" style={{ color: t.text }}>
                Statement Analyzer
              </h1>
              <p className="text-lg" style={{ color: t.textMuted }}>
                Reviewing your processed bank statements for {statements[0]?.period || 'March 2024'}
              </p>
            </div>
            <button
              type="button"
              className="hover-lift inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold"
              style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.text }}
            >
              <Download size={18} />
              Export
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
              className="rounded-2xl p-6 hover-lift"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
            >
              <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                STATEMENTS UPLOADED
              </p>
              <p className="font-display text-3xl font-bold mt-2" style={{ color: t.text }}>
                {summary?.statements || 12}
              </p>
              <p className="text-xs mt-2" style={{ color: t.textFaint }}>
                +2 this week
              </p>
            </div>

            <div
              className="rounded-2xl p-6 hover-lift"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
            >
              <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                TRANSACTIONS EXTRACTED
              </p>
              <p className="font-display text-3xl font-bold mt-2" style={{ color: t.text }}>
                {summary?.totalTransactions?.toLocaleString() || '1,248'}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm" style={{ color: t.success }}>
                <TrendingUp size={14} />
                <span>{summary?.accuracy || 98.4}% Accuracy</span>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 hover-lift"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
            >
              <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                TOTAL EXPENSES
              </p>
              <p className="font-display text-3xl font-bold mt-2" style={{ color: t.text }}>
                {fmtINR(summary?.totalExpenses || 4312.5)}
              </p>
              <p className="text-xs mt-2" style={{ color: t.danger }}>
                +12% vs last month
              </p>
            </div>

            <div
              className="rounded-2xl p-6 hover-lift"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
            >
              <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                INCOME DETECTED
              </p>
              <p className="font-display text-3xl font-bold mt-2" style={{ color: t.text }}>
                {fmtINR(summary?.totalIncome || 7850)}
              </p>
              <p className="text-xs mt-2" style={{ color: t.success }}>
                Stable
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold mb-4" style={{ color: t.text }}>
              AI Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {insights?.map((insight, idx) => {
                const colors = getInsightColor(insight.severity);
                return (
                  <div
                    key={idx}
                    className="rounded-2xl p-6 hover-lift"
                    style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                        style={{ background: colors.bg, color: colors.fg }}
                      >
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg" style={{ color: t.text }}>
                          {insight.title}
                        </h3>
                        <p className="text-sm mt-2" style={{ color: t.textMuted }}>
                          {insight.message}
                        </p>
                        {insight.severity === 'warning' && (
                          <button
                            type="button"
                            className="text-sm font-semibold mt-3 hover-lift"
                            style={{ color: insight.severity === 'warning' ? t.warning : t.primary }}
                          >
                            Optimize This →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spending by Category */}
            <div
              className="rounded-2xl p-6 hover-lift"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
            >
              <h3 className="font-semibold text-xl mb-4" style={{ color: t.text }}>
                SPENDING BY CATEGORY
              </h3>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categorySpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${fmtINR(value)}`}
                      outerRadius={80}
                      fill={t.primary}
                      dataKey="value"
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || t.primary} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => fmtINR(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {categorySpending.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: categoryColors[cat.name] || t.primary }}
                    ></div>
                    <span style={{ color: t.textMuted }}>
                      {cat.name}: {fmtINR(cat.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income vs Expenses */}
            <div
              className="rounded-2xl p-6 hover-lift"
              style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
            >
              <h3 className="font-semibold text-xl mb-4" style={{ color: t.text }}>
                INCOME VS EXPENSE
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                  <XAxis dataKey="month" stroke={t.textMuted} />
                  <YAxis stroke={t.textMuted} />
                  <Tooltip
                    formatter={(value) => fmtINR(value)}
                    contentStyle={{
                      background: t.surface,
                      border: `1px solid ${t.border}`,
                      borderRadius: '8px',
                      color: t.text,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill={t.success} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill={t.warning} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Extracted Transactions */}
          <div
            className="rounded-2xl p-6 hover-lift"
            style={{ background: t.surface, border: `1px solid ${t.border}`, boxShadow: t.shadow }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl" style={{ color: t.text }}>
                EXTRACTED TRANSACTIONS
              </h3>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{ background: t.surfaceAlt, color: t.textMuted }}
                onClick={() => setShowTransactions(!showTransactions)}
              >
                {showTransactions ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {showTransactions && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                      <th
                        className="text-left px-4 py-3 font-semibold"
                        style={{ color: t.textMuted }}
                      >
                        DATE
                      </th>
                      <th
                        className="text-left px-4 py-3 font-semibold"
                        style={{ color: t.textMuted }}
                      >
                        MERCHANT
                      </th>
                      <th
                        className="text-left px-4 py-3 font-semibold"
                        style={{ color: t.textMuted }}
                      >
                        CATEGORY
                      </th>
                      <th
                        className="text-right px-4 py-3 font-semibold"
                        style={{ color: t.textMuted }}
                      >
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.slice(0, 10).map((tx, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: `1px solid ${t.border}` }}
                        className="hover-lift"
                      >
                        <td className="px-4 py-3" style={{ color: t.textMuted }}>
                          {fmtDate(tx.date)}
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: t.text }}>
                          {tx.merchant}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                              background: categoryColors[tx.category] + '20',
                              color: categoryColors[tx.category],
                            }}
                          >
                            {tx.category}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-right font-semibold"
                          style={{ color: tx.amount > 0 ? t.success : t.danger }}
                        >
                          {tx.amount > 0 ? '+' : ''}{fmtINR(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold hover-lift"
                style={{ background: t.primarySoft, color: t.primary }}
              >
                View All {allTransactions.length} Transactions
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation theme={theme} />
    </div>
  );
}
