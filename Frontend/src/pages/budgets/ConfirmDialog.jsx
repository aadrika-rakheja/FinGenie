import React from 'react'

export default function ConfirmDialog({ open, theme, title, message, onCancel, onConfirm }) {
  if (!open) return null

  const isDark = theme === 'dark'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className={isDark ? 'w-full max-w-md rounded-[32px] bg-[#131b2e] border border-[#475569]/40 p-6 text-[#f1f5f9]' : 'w-full max-w-md rounded-[32px] bg-white border border-[#d3e4fe] p-6 text-[#0b1c30]'}>
        <h3 className={isDark ? 'text-2xl font-bold text-[#f8fafc]' : 'text-2xl font-bold text-[#0f172a]'}>{title}</h3>
        <p className={isDark ? 'mt-3 text-sm text-[#94a3b8]' : 'mt-3 text-sm text-[#64748b]'}>{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className={isDark ? 'rounded-3xl border border-[#475569] px-6 py-3 text-sm font-medium text-[#dde5dd] hover:bg-[#1f2e2b]' : 'rounded-3xl border border-[#d3e4fe] px-6 py-3 text-sm font-medium text-[#0f172a] hover:bg-[#f1f5ff]'}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-3xl bg-[#ef4444] px-6 py-3 text-sm font-semibold text-white hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
