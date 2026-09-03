import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Boxes, ChevronLeft, ChevronRight, CircleUserRound, LayoutDashboard,
  LogOut, Menu, PackagePlus, Plus, ReceiptText, Search, Settings,
  UsersRound, X, Pencil, RotateCcw, AlertTriangle, CheckCircle2
} from 'lucide-react'

export function Logo() {
  return <div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25"><ReceiptText size={20}/></div><div className="min-w-0"><div className="font-[Outfit] text-lg font-extrabold tracking-tight text-slate-100">Invoicing</div><div className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">Inventory & Billing</div></div></div>
}

export function Sidebar({ active, onNavigate, page, setPage, user, onLogout, open, setOpen }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const controlled = typeof open === 'boolean' && typeof setOpen === 'function'
  const isOpen = controlled ? open : internalOpen
  const close = () => controlled ? setOpen(false) : setInternalOpen(false)
  const navigate = onNavigate ?? setPage ?? (()=>{})
  const current = active ?? page

  useEffect(() => {
    if (controlled) return
    const toggle = () => setInternalOpen(v => !v)
    const closeMenu = () => setInternalOpen(false)
    window.addEventListener('toggle-sidebar', toggle)
    window.addEventListener('close-sidebar', closeMenu)
    return () => {
      window.removeEventListener('toggle-sidebar', toggle)
      window.removeEventListener('close-sidebar', closeMenu)
    }
  }, [controlled])

  const items = [
    ['dashboard','Dashboard',LayoutDashboard], ['billing','New Invoice',Plus], ['invoices','Invoices',ReceiptText],
    ['products','Inventory',Boxes], ['customers','Customers',UsersRound], ['movements','Stock History',RotateCcw]
  ]
  return <>
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(280px,88vw)] flex-col border-r border-slate-800 bg-slate-950 px-4 py-5 shadow-2xl transition-transform duration-200 ease-out lg:relative lg:z-auto lg:w-[280px] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-7 flex items-center justify-between px-2"><Logo/><button className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 lg:hidden" onClick={close} aria-label="Close navigation"><X size={20}/></button></div>
      <div className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</div>
      <nav className="space-y-1">
        {items.map(([id,label,Icon])=><button key={id} onClick={()=>{navigate(id);close()}} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${current===id?'bg-brand-600/15 text-brand-400':'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}><Icon size={18}/>{label}</button>)}
      </nav>
      {user?.role===1 && <><div className="mb-3 mt-8 px-2 text-[11px] font-bold uppercase tracking-[.18em] text-slate-500">Administration</div><button onClick={()=>{navigate('users');close()}} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold ${current==='users'?'bg-brand-600/15 text-brand-400':'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}><Settings size={18}/>Users</button></>}
      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900 p-3">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500/15 font-bold text-brand-400">{user?.name?.[0]?.toUpperCase()||'U'}</div><div className="min-w-0"><div className="truncate text-sm font-bold text-slate-200">{user?.name||'User'}</div><div className="truncate text-xs text-slate-500">{user?.email}</div></div></div>
        {onLogout&&<button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-rose-400 ring-1 ring-slate-800 hover:bg-rose-950/50"><LogOut size={15}/>Sign out</button>}
      </div>
    </aside>
    {isOpen && <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={close} aria-hidden="true"/>}
  </>
}

export function Topbar({ title, user, onMenu }) {
  const toggleMenu = () => {
    if (onMenu) onMenu()
    else window.dispatchEvent(new Event('toggle-sidebar'))
  }
  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-3 backdrop-blur sm:px-4 md:px-6"><div className="flex min-w-0 items-center gap-2 sm:gap-3"><button onClick={toggleMenu} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21}/></button><div className="min-w-0"><h1 className="truncate font-[Outfit] text-xl font-bold text-slate-100 md:text-2xl">{title}</h1><div className="hidden text-xs text-slate-500 sm:block">Manage your business in one place</div></div></div><div className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-2.5 py-2 text-xs font-semibold text-slate-300 ring-1 ring-slate-800 sm:px-3"><CircleUserRound size={16} className="text-brand-400"/><span className="hidden xs:inline">{user?.role===1?'Administrator':'User'}</span></div></header>
}

export function StatCard({ label, value, hint, icon:Icon, tone='brand' }) {
  const tones={brand:'bg-brand-500/15 text-brand-400', blue:'bg-blue-500/15 text-blue-400', amber:'bg-amber-500/15 text-amber-400', rose:'bg-rose-500/15 text-rose-400'}
  return <motion.div whileHover={{y:-2}} className="panel p-4 md:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">{label}</div><div className="mt-2 truncate font-[Outfit] text-2xl font-extrabold tracking-tight text-slate-100">{value}</div>{hint&&<div className="mt-1 text-xs text-slate-500">{hint}</div>}</div><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon size={20}/></div></div></motion.div>
}

export function EmptyState({ icon:Icon=PackagePlus, title, text, action }) { return <div className="flex flex-col items-center justify-center py-16 text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-800 text-slate-500"><Icon size={25}/></div><div className="mt-4 font-[Outfit] text-lg font-bold text-slate-200">{title}</div><div className="mt-1 max-w-sm text-sm text-slate-500">{text}</div>{action&&<button onClick={action.onClick} className="btn-primary mt-5">{action.label}</button>}</div> }
export function Modal({ title, onClose, children, wide=false }) { return <AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/75 p-3 backdrop-blur-sm"><motion.div initial={{y:20,scale:.98}} animate={{y:0,scale:1}} exit={{y:10,scale:.98}} className={`max-h-[94vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl ${wide?'max-w-3xl':'max-w-lg'}`}><div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-5 py-4 backdrop-blur"><h2 className="font-[Outfit] text-xl font-bold text-slate-100">{title}</h2><button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-800"><X size={19}/></button></div><div className="p-5">{children}</div></motion.div></motion.div></AnimatePresence> }
export function ConfirmModal({ title, text, onClose, onConfirm }) { return <Modal title={title} onClose={onClose}><p className="text-sm leading-6 text-slate-400">{text}</p><div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-danger" onClick={onConfirm}>Continue</button></div></Modal> }
export function SearchBox({ value, onChange, placeholder='Search...' }) { return <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="input pl-10"/></div> }
export function Pagination({ page, totalPages, onPage }) { if(totalPages<=1)return null; return <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3"><div className="text-xs text-slate-500">Page <b className="text-slate-300">{page}</b> of <b className="text-slate-300">{totalPages}</b></div><div className="flex gap-2"><button className="btn-secondary px-3 py-2" disabled={page<=1} onClick={()=>onPage(page-1)}><ChevronLeft size={16}/></button><button className="btn-secondary px-3 py-2" disabled={page>=totalPages} onClick={()=>onPage(page+1)}><ChevronRight size={16}/></button></div></div> }
export const money = paise => `₹${(Number(paise||0)/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`
export const prettyDate = value => value ? new Date(value).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'
export const statusLabel = s => s===1?'Cancelled':'Issued'
export const paymentMethodLabel = m => ({0:'Cash',1:'UPI',2:'Bank',3:'Credit',4:'Other'}[m]||'Other')
export function ErrorNotice({ message }) { return message ? <div className="flex items-center gap-2 rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2.5 text-sm font-medium text-rose-300"><AlertTriangle size={16}/>{message}</div> : null }
export function SuccessNotice({ message }) { return message ? <div className="flex items-center gap-2 rounded-xl border border-emerald-900/60 bg-emerald-950/40 px-3 py-2.5 text-sm font-medium text-emerald-300"><CheckCircle2 size={16}/>{message}</div> : null }
