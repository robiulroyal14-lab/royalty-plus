import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { articlesAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const emptyForm = {
  title: '', excerpt: '', content: '', featuredImage: '',
  author: 'Royalty Plus Team', tags: '', status: 'draft', featured: false,
};

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await articlesAPI.getAllAdmin();
      setArticles(data || []);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ ...a, tags: a.tags?.join(', ') || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Title and content required');
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (editing) {
        await articlesAPI.update(editing._id, payload);
        toast.success('Article updated');
      } else {
        await articlesAPI.create(payload);
        toast.success('Article created');
      }
      setModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try { await articlesAPI.delete(id); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Error'); }
  };

  return (
    <AdminLayout title="Articles">
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="btn-royal text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2">
          <FiPlus size={14} /> New Article
        </button>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Title', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded" /></td>)}</tr>)
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-silver-500 text-sm">No articles yet.</td></tr>
              ) : (
                articles.map(a => (
                  <tr key={a._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium line-clamp-1 max-w-xs">{a.title}</p>
                      {a.featured && <span className="text-xs text-royal-400">★ Featured</span>}
                    </td>
                    <td className="px-5 py-4 text-silver-400 text-sm">{a.author}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${a.status === 'published' ? 'bg-green-500/20 text-green-400' : a.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-silver-500/20 text-silver-400'}`}>{a.status}</span>
                    </td>
                    <td className="px-5 py-4 text-silver-400 text-sm flex items-center gap-1"><FiEye size={12} /> {a.views}</td>
                    <td className="px-5 py-4 text-silver-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-white border border-white/5"><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(a._id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-red-400 border border-white/5"><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Article' : 'New Article'} size="xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Excerpt</label>
              <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm resize-none" placeholder="Short summary..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Content * (HTML or plain text)</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm resize-none font-mono text-xs" placeholder="Article content..." required />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Featured Image URL</label>
              <input type="url" value={form.featuredImage} onChange={e => setForm({...form, featuredImage: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Author</label>
              <input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Tags</label>
              <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="ai, tech, innovation" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured-art" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 accent-blue-600" />
              <label htmlFor="featured-art" className="text-silver-300 text-sm cursor-pointer">Featured article</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={() => setModal(false)} className="btn-ghost text-silver-300 px-5 py-2.5 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="btn-royal text-white px-6 py-2.5 rounded-xl text-sm disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
