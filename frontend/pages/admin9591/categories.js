import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { categoriesAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TYPES = ['product', 'article', 'research', 'ai-project', 'general'];
const empty = { name: '', description: '', type: 'general', color: '#1d4ed8' };

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try { const { data } = await categoriesAPI.getAll(); setCats(data || []); }
    catch { setCats([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm(c); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name required');
    setSaving(true);
    try {
      if (editing) { await categoriesAPI.update(editing._id, form); toast.success('Updated'); }
      else { await categoriesAPI.create(form); toast.success('Created'); }
      setModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await categoriesAPI.delete(id); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Error'); }
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="btn-royal text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2">
          <FiPlus size={14} /> Add Category
        </button>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Name', 'Type', 'Slug', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array(4).fill(0).map((_, i) => <tr key={i}>{Array(4).fill(0).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded" /></td>)}</tr>)
            ) : cats.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-silver-500 text-sm">No categories yet.</td></tr>
            ) : (
              cats.map(c => (
                <tr key={c._id} className="hover:bg-white/2">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-white text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-md bg-royal-800/40 text-royal-400 border border-royal-700/30">{c.type}</span></td>
                  <td className="px-5 py-4 text-silver-500 text-xs font-mono">{c.slug}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-white border border-white/5"><FiEdit2 size={13} /></button>
                      <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-red-400 border border-white/5"><FiTrash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'New Category'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" required />
          </div>
          <div>
            <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Color</label>
            <div className="flex gap-3 items-center">
              <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
              <input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="flex-1 input-dark rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost text-silver-300 px-5 py-2.5 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-royal text-white px-5 py-2.5 rounded-xl text-sm disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
