import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { researchAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';

const emptyForm = {
  title: '', abstract: '', content: '', authors: '', pdfUrl: '', thumbnail: '',
  tags: '', status: 'draft', featured: false, journal: '', doi: '',
};

export default function AdminResearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await researchAPI.getAll({ status: 'all', limit: 50 });
      setItems(data.research || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ ...r, authors: r.authors?.join(', ') || '', tags: r.tags?.join(', ') || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.abstract) return toast.error('Title and abstract required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        authors: form.authors ? form.authors.split(',').map(a => a.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (editing) { await researchAPI.update(editing._id, payload); toast.success('Updated'); }
      else { await researchAPI.create(payload); toast.success('Created'); }
      setModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await researchAPI.delete(id); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Error'); }
  };

  return (
    <AdminLayout title="Research">
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="btn-royal text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2">
          <FiPlus size={14} /> Add Research
        </button>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Title', 'Authors', 'Status', 'Downloads', 'PDF', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(4).fill(0).map((_, i) => <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded" /></td>)}</tr>)
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-silver-500 text-sm">No research yet.</td></tr>
              ) : (
                items.map(r => (
                  <tr key={r._id} className="hover:bg-white/2">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium line-clamp-1 max-w-xs">{r.title}</p>
                    </td>
                    <td className="px-5 py-4 text-silver-400 text-xs">{r.authors?.slice(0,2).join(', ')}{r.authors?.length > 2 ? '...' : ''}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${r.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-4 text-silver-400 text-sm flex items-center gap-1"><FiDownload size={12} /> {r.downloads}</td>
                    <td className="px-5 py-4">
                      {r.pdfUrl ? <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-royal-400 text-xs hover:underline">View PDF</a> : <span className="text-silver-600 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-white border border-white/5"><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(r._id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-red-400 border border-white/5"><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Research' : 'New Research'} size="xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Abstract *</label>
              <textarea value={form.abstract} onChange={e => setForm({...form, abstract: e.target.value})} rows={4} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm resize-none" required />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Authors (comma separated)</label>
              <input type="text" value={form.authors} onChange={e => setForm({...form, authors: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="Dr. Smith, Dr. Jones" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">PDF URL</label>
              <input type="url" value={form.pdfUrl} onChange={e => setForm({...form, pdfUrl: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Journal</label>
              <input type="text" value={form.journal} onChange={e => setForm({...form, journal: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">DOI</label>
              <input type="text" value={form.doi} onChange={e => setForm({...form, doi: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="10.xxxx/..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Tags</label>
              <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="ai, ml, robotics" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost text-silver-300 px-5 py-2.5 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-royal text-white px-6 py-2.5 rounded-xl text-sm disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
