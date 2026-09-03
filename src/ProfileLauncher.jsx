import { useEffect, useState } from 'react'
import { Building2, ChevronDown, CircleUserRound, ImagePlus, LogOut, Save, UserRound, X } from 'lucide-react'
import { api } from './api'

const empty = { businessName:'', legalName:'', address:'', phone:'', email:'', gstin:'', state:'', stateCode:'', invoicePrefix:'INV', logoDataUrl:null }

function fileToJpeg(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1000
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject; img.src = reader.result
    }
    reader.onerror = reject; reader.readAsDataURL(file)
  })
}

export default function ProfileLauncher() {
  const [user,setUser] = useState(null), [open,setOpen] = useState(false), [businessOpen,setBusinessOpen] = useState(false)
  const [form,setForm] = useState(empty), [loading,setLoading] = useState(false), [saving,setSaving] = useState(false), [error,setError] = useState(''), [saved,setSaved] = useState('')

  useEffect(() => { api.me().then(r => setUser(r.user || null)).catch(() => setUser(null)) }, [])
  useEffect(() => {
    if (!businessOpen) return
    setLoading(true); setError('')
    api.business().then(r => setForm({...empty, ...(r.business ? { businessName:r.business.business_name||'', legalName:r.business.legal_name||'', address:r.business.address||'', phone:r.business.phone||'', email:r.business.email||'', gstin:r.business.gstin||'', state:r.business.state||'', stateCode:r.business.state_code||'', invoicePrefix:r.business.invoice_prefix||'INV', logoDataUrl:r.business.logo_data_url||null } : {})})).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [businessOpen])

  if (!user) return null
  const isAdmin = Number(user.role) === 1
  const set = (key,value) => setForm(v => ({...v,[key]:value}))
  async function chooseLogo(e) { const file=e.target.files?.[0]; if(!file)return; if(!file.type.startsWith('image/'))return setError('Please select an image file.'); try { const data=await fileToJpeg(file); if(data.length>700000)setError('Logo is too large. Choose a smaller image.'); else {setError('');set('logoDataUrl',data)} } catch { setError('Could not read the logo.') } }
  async function saveBusiness(e) { e.preventDefault(); setSaving(true); setError(''); setSaved(''); try { await api.saveBusiness(form); setSaved('Business details saved.'); setTimeout(()=>setSaved(''),2500) } catch(e) { setError(e.message) } finally { setSaving(false) } }
  async function logout() { try { await api.logout() } finally { window.location.reload() } }

  return <>
    <div className="fixed right-3 top-3 z-[55] sm:right-5 sm:top-3">
      <div className="relative">
        <button onClick={()=>setOpen(v=>!v)} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 shadow-xl shadow-black/20 hover:bg-slate-800" aria-label="Open profile menu">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-400"><CircleUserRound size={18}/></div>
          <div className="hidden text-left sm:block"><div className="max-w-32 truncate text-xs font-bold text-slate-200">{user.name || 'Profile'}</div><div className="text-[10px] text-slate-500">{isAdmin ? 'Administrator' : 'User'}</div></div>
          <ChevronDown size={15} className="text-slate-500"/>
        </button>
        {open && <>
          <div className="fixed inset-0 z-[-1]" onClick={()=>setOpen(false)}/>
          <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 px-4 py-3"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-400"><UserRound size={19}/></div><div className="min-w-0"><div className="truncate text-sm font-bold text-slate-100">{user.name || 'User'}</div><div className="truncate text-xs text-slate-500">{user.email}</div></div></div></div>
            <div className="p-2">
              <button onClick={()=>setOpen(false)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 hover:bg-slate-800"><UserRound size={16}/>Profile</button>
              {isAdmin && <button onClick={()=>{setOpen(false);setBusinessOpen(true)}} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 hover:bg-slate-800"><Building2 size={16}/>Business settings</button>}
              <div className="my-2 border-t border-slate-800"/>
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-400 hover:bg-rose-950/40"><LogOut size={16}/>Logout</button>
            </div>
          </div>
        </>}
      </div>
    </div>

    {businessOpen && <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/75 p-3 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-5 py-4 backdrop-blur"><div><h2 className="font-[Outfit] text-xl font-bold text-slate-100">Business settings</h2><p className="mt-1 text-sm text-slate-500">Business details and logo used on invoice PDFs.</p></div><button onClick={()=>setBusinessOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-800"><X size={19}/></button></div>
        {loading ? <div className="p-8 text-sm text-slate-500">Loading business details…</div> : <form onSubmit={saveBusiness} className="grid gap-4 p-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-300 md:col-span-2">Business name<input className="input mt-2" value={form.businessName} onChange={e=>set('businessName',e.target.value)} required/></label>
          <label className="text-sm font-semibold text-slate-300">Legal name<input className="input mt-2" value={form.legalName} onChange={e=>set('legalName',e.target.value)}/></label><label className="text-sm font-semibold text-slate-300">GSTIN<input className="input mt-2" value={form.gstin} onChange={e=>set('gstin',e.target.value)}/></label>
          <label className="text-sm font-semibold text-slate-300 md:col-span-2">Business address<textarea className="input mt-2 min-h-24" value={form.address} onChange={e=>set('address',e.target.value)}/></label>
          <label className="text-sm font-semibold text-slate-300">Phone<input className="input mt-2" value={form.phone} onChange={e=>set('phone',e.target.value)}/></label><label className="text-sm font-semibold text-slate-300">Email<input className="input mt-2" type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label>
          <label className="text-sm font-semibold text-slate-300">State<input className="input mt-2" value={form.state} onChange={e=>set('state',e.target.value)}/></label><label className="text-sm font-semibold text-slate-300">State code<input className="input mt-2" value={form.stateCode} onChange={e=>set('stateCode',e.target.value)}/></label>
          <label className="text-sm font-semibold text-slate-300">Invoice prefix<input className="input mt-2" maxLength={12} value={form.invoicePrefix} onChange={e=>set('invoicePrefix',e.target.value.toUpperCase())}/></label>
          <div className="md:col-span-2"><div className="text-sm font-semibold text-slate-300">Invoice logo</div><div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-4"><div className="grid h-24 w-36 place-items-center overflow-hidden rounded-xl border border-slate-800 bg-white">{form.logoDataUrl?<img src={form.logoDataUrl} className="max-h-full max-w-full object-contain"/>:<ImagePlus className="text-slate-500" size={28}/>}</div><div><label className="btn-secondary cursor-pointer"><ImagePlus size={16}/>Choose logo<input type="file" accept="image/*" className="hidden" onChange={chooseLogo}/></label>{form.logoDataUrl&&<button type="button" className="mt-2 block text-xs font-semibold text-rose-400 hover:underline" onClick={()=>set('logoDataUrl',null)}>Remove logo</button>}</div></div></div>
          {error&&<div className="rounded-xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-sm text-rose-300 md:col-span-2">{error}</div>}{saved&&<div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300 md:col-span-2">{saved}</div>}
          <div className="flex justify-end gap-3 md:col-span-2"><button type="button" className="btn-secondary" onClick={()=>setBusinessOpen(false)}>Close</button><button disabled={saving} className="btn-primary"><Save size={16}/>{saving?'Saving…':'Save business details'}</button></div>
        </form>}
      </div>
    </div>}
  </>
}
