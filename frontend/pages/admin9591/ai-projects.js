import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { aiProjectsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiGithub, FiYoutube, FiExternalLink, FiFileText } from 'react-icons/fi';

const CATS = ['ai','robotics','iot','machine-learning','computer-vision','automation','nlp','other'];

const emptyForm = {
  title: '', shortDescription: '', description: '', thumbnail: '',
  videoUrl: '', youtubeUrl: '', githubUrl: '', demoUrl: '', researchPdfUrl: '',
  category: 'ai', tags: '', technologies: '', status: 'active', featured: false,
  highlights: '',
};

export default function AdminAIProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await aiProjectsAPI.getAll({ status: 'all', limit: 100 });
      setProjects(data.projects || []);
    } catch { setProjects([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, tags: p.tags?.join(', ') || '', technologies: p.technologies?.join(', ') || '', highlights: p.highlights?.join(', ') || '' });
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
        technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
        highlights: form.highlights ? form.highlights.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await aiProjectsAPI.update(editing._id, payload);
        toast.success('Project updated');
      } else {
        await aiProjectsAPI.create(payload);
        toast.success('Project created');
      }
      setModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await aiProjectsAPI.delete(id);
      toast.success('Deleted');
      fetch();
    } catch { toast.error('Error deleting'); }
  };

  return (
    <AdminLayout title="AI & Robotics Projects">
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="btn-royal text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2">
          <FiPlus size={14} /> Add Project
        </button>
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Project', 'Category', 'Status', 'Links', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>{Array(5).fill(0).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded" /></td>)}</tr>
                ))
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-silver-500 text-sm">No projects yet.</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white text-sm font-medium">{p.title}</p>
                      <p className="text-silver-500 text-xs truncate max-w-xs">{p.shortDescription}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-royal-800/40 text-royal-400 border border-royal-700/30 capitalize">{p.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 text-silver-500">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white"><FiGithub size={14} /></a>}
                        {p.youtubeUrl && <a href={p.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-400"><FiYoutube size={14} /></a>}
                        {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-400"><FiExternalLink size={14} /></a>}
                        {p.researchPdfUrl && <a href={p.researchPdfUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400"><FiFileText size={14} /></a>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-white border border-white/5"><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(p._id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-red-400 border border-white/5"><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'New AI Project'} size="xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Full Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm">
                {['active','draft','completed','archived'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Thumbnail URL</label>
              <input type="url" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">GitHub URL</label>
              <input type="url" value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">YouTube URL</label>
              <input type="url" value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Live Demo URL</label>
              <input type="url" value={form.demoUrl} onChange={e => setForm({...form, demoUrl: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Research PDF URL</label>
              <input type="url" value={form.researchPdfUrl} onChange={e => setForm({...form, researchPdfUrl: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Tags</label>
              <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="ai, vision, python" />
            </div>
            <div>
              <label className="block text-silver-400 text-xs uppercase tracking-wide mb-1.5">Technologies</label>
              <input type="text" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" placeholder="Python, TensorFlow" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured-ai" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 accent-blue-600" />
              <label htmlFor="featured-ai" className="text-silver-300 text-sm cursor-pointer">Featured project</label>
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
