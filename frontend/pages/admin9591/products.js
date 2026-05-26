import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { productsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from 'react-icons/fi';

const emptyForm = {
  title: '', shortDescription: '', description: '', price: '', currency: 'USD',
  thumbnail: '', images: [], tags: '', features: '', status: 'active', featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getAll({ status: 'all', limit: 50, search });
      setProducts(data.products || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags?.join(', ') || '', features: p.features?.join(', ') || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        price: form.price ? parseFloat(form.price) : undefined,
      };
      if (editing) {
        await productsAPI.update(editing._id, payload);
        toast.success('Product updated');
      } else {
        await productsAPI.create(payload);
        toast.success('Product created');
      }
      setModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Error deleting'); }
    finally { setDeleting(null); }
  };

  return (
    <AdminLayout title="Products">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" size={14} />
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark rounded-xl pl-9 pr-4 py-2 text-sm w-64" />
        </div>
        <button onClick={openNew}
          className="btn-royal text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2">
          <FiPlus size={14} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Status', 'Price', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-silver-500 text-sm">
                    No products yet. <button onClick={openNew} className="text-royal-400 hover:text-royal-300">Create one →</button>
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-royal-800/40 border border-royal-700/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.thumbnail ? <img src={p.thumbnail} className="w-full h-full object-cover" /> : <FiImage size={14} className="text-silver-600" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{p.title}</p>
                          <p className="text-silver-500 text-xs truncate max-w-xs">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${
                        p.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        p.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-silver-500/20 text-silver-400'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-4 text-silver-300 text-sm">{p.price ? `${p.currency} ${p.price}` : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs ${p.featured ? 'text-royal-400' : 'text-silver-600'}`}>
                        {p.featured ? '★ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-white hover:border-royal-600/30 transition-all border border-white/5">
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-red-400 hover:border-red-500/30 transition-all border border-white/5">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Product' : 'New Product'} size="lg">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="Product title" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="Brief summary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Full Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={4} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm resize-none" placeholder="Detailed description" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Price</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="0.00" step="0.01" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Thumbnail URL</label>
              <input type="url" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="tag1, tag2, tag3" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 accent-blue-600 rounded" />
              <label htmlFor="featured" className="text-silver-300 text-sm cursor-pointer">Featured product</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={() => setModal(false)}
              className="btn-ghost text-silver-300 px-5 py-2.5 rounded-xl text-sm">Cancel</button>
            <button type="submit" disabled={saving}
              className="btn-royal text-white px-6 py-2.5 rounded-xl text-sm disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
