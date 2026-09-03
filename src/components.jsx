import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Boxes, ChevronLeft, ChevronRight, CircleUserRound, FileText, LayoutDashboard,
  LogOut, Menu, PackagePlus, Plus, ReceiptText, Search, Settings, ShoppingCart, Trash2,
  UsersRound, X, Pencil, RotateCcw, WalletCards, AlertTriangle, CheckCircle2
} from 'lucide-react'

export function Logo() {
  return <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25"><ReceiptText size={20}/></div><div><div className="font-[Outfit] text-lg font-extrabold tracking-tight text-slate-900">Invoicing</div><div className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400">Inventory & Billing</div></div></div>
}

export function Sidebar({ active, onNavigate, user, onLogout, open, setOpen }) {
  const items = [
    ['dashboard','Dashboard',LayoutDashboard], ['billing','New Invoice',Plus], ['invoices','Invoices',ReceiptText],
    ['products','Inventory',Boxes], ['customers','Customers',UsersRound], ['movements','Stock History',RotateCcw]
  ]
  return <>
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-soft transition-transform lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-7 flex items-center justify-between px-2"><Logo/><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={()=>setOpen(false)}><X size={20}/></button></div>
      <div className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</div>
      <nav className="space-y-1">
        {items.map(([id,label,Icon])=><button key={id} onClick={()=>{onNavigate(id);setOpen(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${active===id?'bg-brand-50 text-brand-700':'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18}/>{label}</button>)}
      </nav>
      {user?.role===1 && <><div className="mb-3 mt-8 px-2 text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">Administration</div><button onClick={()=>{onNavigate('users');setOpen(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold ${active==='users'?'bg-brand-50 text-brand-700':'text-slate-600 hover:bg-slate-50'}`}><Settings size={18}/>Users</button></>}
      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-bold text-brand-700">{user?.name?.[0]?.toUpperCase()||'U'}</div><div className="min-w-0"><div className="truncate text-sm font-bold text-slate-800">{user?.name||'User'}</div><div className="truncate text-xs text-slate-500">{user?.email}</div></div></div>
        <button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50"><LogOut size={15}/>Sign out</button>
      </div>
    </aside>
    {open && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={()=>setOpen(false)}/>}
  </>
}

export function Topbar({ title, user, onMenu }) {
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6"><div className="flex items-center gap-3"><button onClick={onMenu} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={21}/></button><div><h1 className="font-[Outfit] text-xl font-bold text-slate-900 md:text-2xl">{title}</h1><div className="text-xs text-slate-400">Manage your business in one place</div></div></div><div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"><CircleUserRound size={16} className="text-brand-600"/>{user?.role===1?'Administrator':'User'}</div></header>
}

export function StatCard({ label, value, hint, icon:Icon, tone='brand' }) {
  const tones={brand:'bg-brand-50 text-brand-700', blue:'bg-blue-50 text-blue-700', amber:'bg-amber-50 text-amber-700', rose:'bg-rose-50 text-rose-700'}
  return <motion.div whileHover={{y:-2}} className="panel p-4 md:p-5"><div className="flex items-start justify-between"><div><div className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{label}</div><div className="mt-2 font-[Outfit] text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>{hint&&<div className="mt-1 text-xs text-slate-500">{hint}</div>}</div><div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon size={20}/></div></div></motion.div>
}

export function EmptyState({ icon:Icon=PackagePlus, title, text, action }) {
  return <div className="flex flex-col items-center justify-center py-16 text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icon size={25}/></div><div className="mt-4 font-[Outfit] text-lg font-bold text-slate-800">{title}</div><div className="mt-1 max-w-sm text-sm text-slate-500">{text}</div>{action&&<button onClick={action.onClick} className="btn-primary mt-5">{action.label}</button>}</div>
}

export function Modal({ title, onClose, children, wide=false }) { return <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm"><motion.div initial={{y:20,scale:.98}} animate={{y:0,scale:1}} exit={{y:10,scale:.98}} className={`max-h-[94vh] w-full overflow-y-auto rounded-3xl bg-white shadow-panel ${wide?'max-w-3xl':'max-w-lg'}`}><div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur"><h2 className="font-[Outfit] text-xl font-bold text-slate-900">{title}</h2><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={19}/></button></div><div className="p-5">{children}</div></motion.div></motion.div></AnimatePresence> }

export function ConfirmModal({ title, text, onClose, onConfirm }) { return <Modal title={title} onClose={onClose}><p className="text-sm leading-6 text-slate-600">{text}</p><div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-danger" onClick={onConfirm}>Continue</button></div></Modal> }

export function SearchBox({ value, onChange, placeholder='Search...' }) { return <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="input pl-10"/></div> }

export function Pagination({ page, totalPages, onPage }) { if(totalPages<=1)return null; return <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><div className="text-xs text-slate-500">Page <b>{page}</b> of <b>{totalPages}</b></div><div className="flex gap-2"><button className="btn-secondary px-3 py-2" disabled={page<=1} onClick={()=>onPage(page-1)}><ChevronLeft size={16}/></button><button className="btn-secondary px-3 py-2" disabled={page>=totalPages} onClick={()=>onPage(page+1)}><ChevronRight size={16}/></button></div></div> }

export const money = paise => `₹${(Number(paise||0)/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`
export const prettyDate = value => value ? new Date(value).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'
export const statusLabel = s => s===1?'Cancelled':'Issued'
export const paymentMethodLabel = m => ({0:'Cash',1:'UPI',2:'Bank',3:'Credit',4:'Other'}[m]||'Other')
export function ErrorNotice({ message }) { return message ? <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700"><AlertTriangle size={16}/>{message}</div> : null }
export function SuccessNotice({ message }) { return message ? <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700"><CheckCircle2 size={16}/>{message}</div> : null }
