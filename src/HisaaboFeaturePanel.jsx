import { useEffect, useMemo, useState } from 'react'
import { BarChart3, CreditCard, FileText, PackageSearch, ReceiptText, Search, X } from 'lucide-react'
import { api, money, paymentMethodLabel, prettyDate } from './api'

const nav = ['dashboard','billing','invoices','products','customers','movements','users']

export default function HisaaboFeaturePanel({ onNavigate }) {
  const [open,setOpen]=useState(false); const [query,setQuery]=useState(''); const [invoices,setInvoices]=useState([]); const [products,setProducts]=useState([]); const [loaded,setLoaded]=useState(false)
  useEffect(()=>{ if(!open || loaded)return; Promise.all([api.invoices({limit:20}),api.products({limit:50})]).then(([i,p])=>{setInvoices(i.invoices||[]);setProducts(p.products||[]);setLoaded(true)}).catch(()=>setLoaded(true)) },[open,loaded])
  const commands = useMemo(()=>[
    ...nav.map(id=>({id:`nav-${id}`,label:`Go to ${id==='billing'?'New Invoice':id[0].toUpperCase()+id.slice(1)}`,action:()=>onNavigate?.(id)})),
    {id:'paid',label:'Show paid invoices',action:()=>setQuery('paid')},
    {id:'pending',label:'Show pending invoices',action:()=>setQuery('pending')},
    {id:'low-stock',label:'Show low stock products',action:()=>setQuery('low stock')},
  ],[onNavigate])
  const filtered=commands.filter(x=>x.label.toLowerCase().includes(query.toLowerCase()))
  const q=query.toLowerCase(); const shownInvoices=q==='paid'?invoices.filter(i=>Number(i.payment_status)===1):q==='pending'?invoices.filter(i=>Number(i.payment_status)===0):[]; const lowStock=products.filter(p=>Number(p.stock_quantity)<=Number(p.reorder_level||0)).slice(0,8)
  return <>
    <button onClick={()=>setOpen(true)} className="fixed bottom-5 left-5 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 shadow-2xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-slate-800" title="Quick actions"><BarChart3 size={20}/></button>
    {open&&<div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm" onClick={()=>setOpen(false)}><div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center gap-3 border-b border-slate-800 px-4"><Search size={18} className="text-slate-500"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search commands, invoices, stock…" className="flex-1 bg-transparent py-4 text-sm text-slate-100 outline-none placeholder:text-slate-500"/><kbd className="rounded bg-slate-950 px-2 py-1 text-[10px] text-slate-500">ESC</kbd><button onClick={()=>setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800"><X size={18}/></button></div>
      {!['paid','pending','low stock'].includes(q)?<div className="p-2">{filtered.map(item=><button key={item.id} onClick={()=>{item.action();if(!['paid','pending','low stock'].includes(query.toLowerCase()))setOpen(false)}} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"><FileText size={16} className="text-brand-400"/>{item.label}</button>)}{filtered.length===0&&<div className="py-12 text-center text-sm text-slate-500">No commands found.</div>}</div>:<div className="p-5">{q==='low stock'?<><div className="mb-4 flex items-center gap-2"><PackageSearch size={18} className="text-amber-400"/><h3 className="font-[Outfit] text-lg font-bold text-slate-100">Low stock</h3></div>{lowStock.length?<div className="space-y-2">{lowStock.map(p=><div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"><div><div className="text-sm font-semibold text-slate-200">{p.name}</div><div className="text-xs text-slate-500">{p.sku}</div></div><span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300">{p.stock_quantity} left</span></div>)}</div>:<div className="py-10 text-center text-sm text-slate-500">No low-stock items.</div>}</>:<><div className="mb-4 flex items-center gap-2"><CreditCard size={18} className="text-emerald-400"/><h3 className="font-[Outfit] text-lg font-bold text-slate-100">{q==='paid'?'Paid invoices':'Pending invoices'}</h3></div>{shownInvoices.length?<div className="space-y-2">{shownInvoices.map(i=><div key={i.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"><div><div className="text-sm font-semibold text-slate-200">{i.invoice_number}</div><div className="text-xs text-slate-500">{i.customer_name||'Walk-in'} · {prettyDate(i.invoice_date)} · {paymentMethodLabel(i.payment_method)}</div></div><span className="font-bold text-brand-300">{money(i.total_amount_paise)}</span></div>)}</div>:<div className="py-10 text-center text-sm text-slate-500">No matching invoices.</div>}</>}</div>}
    </div></div>}
  </>
}
