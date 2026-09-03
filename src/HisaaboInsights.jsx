import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, IndianRupee, PackageSearch, ReceiptText, UsersRound, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { api, money } from './api'

export default function HisaaboInsights({ go }) {
  const [summary, setSummary] = useState(null)
  const [receivables, setReceivables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([api.accountingSummary(), api.receivables()]).then(([s, r]) => {
      if (!alive) return
      setSummary(s.summary || {})
      setReceivables(r.receivables || [])
    }).catch(() => {}).finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  const topDebtors = useMemo(() => receivables.filter(r => Number(r.outstanding_paise) > 0).slice(0, 5), [receivables])
  if (loading) return <div className="panel p-5 text-sm text-slate-500">Loading business insights…</div>

  return <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div><div className="section-title">Business overview</div><div className="section-subtitle">A Hisaabo-style operating snapshot.</div></div>
        <button className="btn-secondary" onClick={() => go('invoices')}><ArrowUpRight size={15}/>Invoices</button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Mini icon={IndianRupee} label="Sales" value={money(summary?.sales_paise)} />
        <Mini icon={ReceiptText} label="Outstanding" value={money(summary?.outstanding_paise)} tone="amber" />
        <Mini icon={TrendingUp} label="Collected" value={money(summary?.paid_paise)} tone="green" />
        <Mini icon={PackageSearch} label="Low stock" value={Number(summary?.low_stock || 0)} tone="rose" onClick={() => go('products')} />
      </div>
    </div>
    <div className="panel p-5">
      <div className="flex items-center justify-between"><div><div className="section-title">Receivables</div><div className="section-subtitle">Customers needing collection follow-up.</div></div><UsersRound size={19} className="text-brand-400"/></div>
      <div className="mt-4 space-y-3">{topDebtors.length ? topDebtors.map(r => <button key={r.id} onClick={() => go('customers')} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-3 text-left hover:bg-slate-900"><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-200">{r.name}</div><div className="text-xs text-slate-500">{r.open_invoices} open invoice{Number(r.open_invoices)===1?'':'s'}</div></div><div className="text-sm font-bold text-amber-300">{money(r.outstanding_paise)}</div></button>) : <div className="rounded-xl border border-dashed border-slate-800 p-5 text-center text-sm text-slate-500">No outstanding customer balances.</div>}</div>
    </div>
  </div>
}

function Mini({ icon:Icon, label, value, tone='brand', onClick }) {
  const toneCls={brand:'bg-brand-500/15 text-brand-400',amber:'bg-amber-500/15 text-amber-400',green:'bg-emerald-500/15 text-emerald-400',rose:'bg-rose-500/15 text-rose-400'}[tone]
  return <button disabled={!onClick} onClick={onClick} className={`flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left ${onClick?'hover:bg-slate-900':''}`}><div className="flex min-w-0 items-center gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneCls}`}><Icon size={18}/></div><div><div className="text-xs uppercase tracking-[.12em] text-slate-500">{label}</div><div className="mt-1 font-[Outfit] text-lg font-bold text-slate-100">{value}</div></div></div>{onClick&&<AlertTriangle size={15} className="text-slate-600"/>}</button>
}
