import { useEffect, useMemo, useState } from 'react'
import { Play, Square, Server, Activity, Monitor, CheckCircle2, Clock, Download } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function HeaderHero() {
  return (
    <div className="w-full relative h-56 overflow-hidden rounded-b-2xl shadow-sm">
      <Spline
        scene="https://prod.spline.design/WCoEDSwacOpKBjaC/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/60 px-6 py-3 rounded-xl border border-white/60 shadow">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Modality Emulator
          </h1>
        </div>
      </div>
    </div>
  )
}

function WorklistTable() {
  const [rows, setRows] = useState(() => [
    {
      name: 'Budi Santoso',
      id: 'PID-001245',
      modality: 'CT',
      study: 'Head CT w/ Contrast',
      accession: 'ACC-2025-0001',
      status: 'Scheduled',
    },
    {
      name: 'Siti Aminah',
      id: 'PID-001246',
      modality: 'MR',
      study: 'Brain MRI',
      accession: 'ACC-2025-0002',
      status: 'In Progress',
    },
    {
      name: 'Andi Wijaya',
      id: 'PID-001247',
      modality: 'CR',
      study: 'Chest X-Ray',
      accession: 'ACC-2025-0003',
      status: 'Completed',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getWorklist = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE}/api/worklist`)
      if (!res.ok) throw new Error('Gagal mengambil worklist')
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-slate-700">Worklist</span>
        </div>
        <button
          onClick={getWorklist}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors ${
            loading
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-wait'
              : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          <Download className="w-4 h-4" />
          {loading ? 'Mengambil...' : 'Get Worklist'}
        </button>
      </div>
      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-4 py-2">Patient Name</th>
              <th className="text-left font-medium px-4 py-2">Patient ID</th>
              <th className="text-left font-medium px-4 py-2">Modality</th>
              <th className="text-left font-medium px-4 py-2">Study</th>
              <th className="text-left font-medium px-4 py-2">Accession</th>
              <th className="text-left font-medium px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-2 text-slate-800">{r.name}</td>
                <td className="px-4 py-2 text-slate-700">{r.id}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 text-slate-800">
                    <Activity className="w-4 h-4 text-blue-600" /> {r.modality}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-700">{r.study}</td>
                <td className="px-4 py-2 text-slate-700">{r.accession}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ' +
                      (r.status === 'Completed'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : r.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-50 text-slate-700 border border-slate-200')
                    }
                  >
                    {r.status === 'Completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ControlPanel() {
  const [running, setRunning] = useState(false)
  const [sent, setSent] = useState(0)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="size-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
          <Monitor className="w-7 h-7" />
        </div>
        <div>
          <div className="text-sm text-slate-500">Modality</div>
          <div className="font-semibold text-slate-800">CT / MR / CR</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setRunning(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors border ${
            running
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
          }`}
          disabled={running}
        >
          <Play className="w-4 h-4" /> Start Server
        </button>
        <button
          onClick={() => setRunning(false)}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors border ${
            running
              ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
              : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
          disabled={!running}
        >
          <Square className="w-4 h-4" /> Stop Server
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
        <div className="text-sm text-slate-600 mb-2">Status</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`size-2.5 rounded-full ${running ? 'bg-green-500' : 'bg-slate-300'}`}
            />
            <span className="text-sm font-medium text-slate-800">
              {running ? 'Server berjalan' : 'Server berhenti'}
            </span>
          </div>
          <button
            onClick={() => running && setSent((s) => s + 1)}
            className={`text-xs rounded-md px-2 py-1 border transition-colors ${
              running
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                : 'bg-white text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
            disabled={!running}
          >
            Kirim 1 Gambar ke PACS
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-700">
          Gambar terkirim ke PACS: <span className="font-semibold">{sent}</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="px-4 py-2.5 border-b border-slate-200 text-sm font-medium text-slate-700">
          Log
        </div>
        <div className="max-h-40 overflow-auto p-3 text-xs text-slate-600 space-y-1">
          <div>[INFO] Emulator siap digunakan.</div>
          <div>
            {running ? '[RUNNING] Menunggu studi untuk dikirim...' : '[STOPPED] Server tidak aktif.'}
          </div>
          {sent > 0 && (
            <div>[OK] {sent} gambar berhasil dikirim ke PACS.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <HeaderHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ControlPanel />
          </div>
          <div className="lg:col-span-2">
            <WorklistTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
