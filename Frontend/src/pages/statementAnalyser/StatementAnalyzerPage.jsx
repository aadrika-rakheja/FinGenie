import { useState } from 'react';
import {
  Upload, ArrowRight, Lock, Shield, HelpCircle, FileUp, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import MainHeader from '../../components/MainHeader';
import BottomNavigation from '../../components/BottomNavigation';
import { getThemeTokens } from '../../theme/theme';

export default function StatementAnalyzerPage({ theme = 'dark', onToggleTheme }) {
  const t = getThemeTokens(theme);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    
    // Simulate file upload and analysis
    setTimeout(() => {
      const mockAnalysisData = {
        fileName: selectedFile.name,
        uploadedDate: new Date().toISOString(),
        statements: [
          {
            id: 1,
            bankName: 'ICICI Bank',
            accountLast4: '5678',
            period: 'March 2024',
            transactions: [
              { id: 1, date: 'Mar 12, 2024', merchant: 'Whole Foods Market', category: 'GROCERIES', amount: -142.50 },
              { id: 2, date: 'Mar 11, 2024', merchant: 'Netflix Subscription', category: 'ENTERTAINMENT', amount: -19.99 },
              { id: 3, date: 'Mar 10, 2024', merchant: 'Apple Store', category: 'ELECTRONICS', amount: -1299.00 },
              { id: 4, date: 'Mar 10, 2024', merchant: 'Employer Deposit', category: 'SALARY', amount: 3925.00 },
              { id: 5, date: 'Mar 08, 2024', merchant: 'Starbucks Coffee', category: 'DINING', amount: -6.45 },
            ]
          }
        ],
        summary: {
          totalTransactions: 1248,
          totalExpenses: 4312.50,
          totalIncome: 7850.00,
          netFlow: 3537.50,
          accuracy: 98.4,
        },
        insights: [
          {
            type: 'SPENDING_ALERT',
            title: 'Spending Alert',
            message: 'Dining expenses increased by 18% compared to last month. You\'ve visited 4 new restaurants this week.',
            severity: 'warning',
          },
          {
            type: 'LEARNING_OPPORTUNITY',
            title: 'Learning Opportunity',
            message: 'Detected 3 duplicate subscriptions for cloud storage. Canceling these could save you $348/year.',
            severity: 'info',
          },
          {
            type: 'WEALTH_PROJECTION',
            title: 'Wealth Projection Maps',
            message: 'Based on current spending patterns, we project your savings to reach $50,000 in 18 months.',
            severity: 'success',
          }
        ]
      };

      navigate('/statement-analyzed', { state: mockAnalysisData });
      setIsLoading(false);
    }, 2000);
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
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2" style={{ color: t.text }}>
              Statement Analyzer
            </h1>
            <p className="text-lg" style={{ color: t.textMuted }}>
              Upload your bank or credit card statements (PDF, CSV) to gain instant AI-powered insights into your spending habits and financial health.
            </p>
          </div>

          {/* Main Card */}
          <div
            className="rounded-[28px] p-8 sm:p-10 mb-8 hover-lift"
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              boxShadow: t.shadow,
            }}
          >
            {/* Drag and Drop Area */}
            <div
              className="relative rounded-2xl border-2 border-dashed p-12 sm:p-16 text-center transition-all duration-300 cursor-pointer"
              style={{
                borderColor: isDragging ? t.primary : t.borderStrong,
                background: isDragging ? t.primarySoft : t.surfaceAlt,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={handleFileSelect}
              />

              <div className="flex flex-col items-center gap-4">
                {selectedFile ? (
                  <>
                    <div
                      className="inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ background: t.successSoft }}
                    >
                      <CheckCircle2 size={32} style={{ color: t.success }} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg" style={{ color: t.text }}>
                        {selectedFile.name}
                      </p>
                      <p className="text-sm" style={{ color: t.textMuted }}>
                        Ready to analyze • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-sm font-medium hover-lift"
                      style={{ color: t.primary }}
                    >
                      Choose Different File
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ background: t.primarySoft }}
                    >
                      <FileUp size={32} style={{ color: t.primary }} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: t.text }}>
                      Drag and drop files here
                    </h3>
                    <p style={{ color: t.textMuted }}>
                      Securely upload your transaction history. We support PDF, CSV, and XLSX formats from all major financial institutions.
                    </p>
                    <label htmlFor="file-input">
                      <button
                        type="button"
                        onClick={() => document.getElementById('file-input').click()}
                        className="hover-lift inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold"
                        style={{
                          background: t.primary,
                          color: '#0a0f1e',
                        }}
                      >
                        <Upload size={18} />
                        Select File
                      </button>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <Lock size={20} style={{ color: t.primary, flexShrink: 0 }} className="mt-0.5" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: t.text }}>
                    Bank-grade Encryption
                  </p>
                  <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                    Your data is encrypted and processed securely.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield size={20} style={{ color: t.primary, flexShrink: 0 }} className="mt-0.5" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: t.text }}>
                    Privacy First Policy
                  </p>
                  <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                    We never share your financial data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-8">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!selectedFile || isLoading}
              className="hover-lift inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                background: selectedFile ? t.primary : t.surfaceAlt,
                color: selectedFile ? '#0a0f1e' : t.textMuted,
              }}
            >
              {isLoading ? (
                <>
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <ArrowRight size={20} />
                  Analyze Statement
                </>
              )}
            </button>
          </div>

          {/* Coming Soon Section */}
          <div
            className="rounded-2xl p-6 border hover-lift"
            style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              boxShadow: t.shadow,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                style={{ background: t.primarySoft }}
              >
                <span className="font-semibold text-sm" style={{ color: t.primary }}>
                  🚀
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg" style={{ color: t.text }}>
                    AI Financial Analysis
                  </h3>
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: t.primarySoft,
                      color: t.primary,
                    }}
                  >
                    COMING SOON
                  </span>
                </div>
                <p style={{ color: t.textMuted }}>
                  Unlock deep behavioral spending analysis, fraud detection, and personalized saving strategies driven by GPT-4 finance models.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: t.textMuted }}>
                    <span style={{ color: t.primary }}>✓</span>
                    Categorization Engine
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: t.textMuted }}>
                    <span style={{ color: t.primary }}>✓</span>
                    Anomaly Detection
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: t.textMuted }}>
                    <span style={{ color: t.primary }}>✓</span>
                    Wealth Projection Maps
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation theme={theme} />
    </div>
  );
}
