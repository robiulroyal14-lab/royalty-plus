import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { contactsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiMail, FiTrash2, FiCheck, FiMessageSquare } from 'react-icons/fi';

const STATUS_COLORS = {
  unread: 'bg-rose-500/20 text-rose-400',
  read: 'bg-blue-500/20 text-blue-400',
  replied: 'bg-green-500/20 text-green-400',
  archived: 'bg-silver-500/20 text-silver-400',
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await contactsAPI.getAll({ limit: 50, status: filter || undefined });
      setContacts(data.contacts || []);
    } catch { setContacts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const markStatus = async (id, status) => {
    try {
      await contactsAPI.updateStatus(id, status);
      setContacts(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactsAPI.delete(id);
      toast.success('Deleted');
      setSelected(null);
      fetchAll();
    } catch { toast.error('Error'); }
  };

  return (
    <AdminLayout title="Contact Messages">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'unread', 'read', 'replied', 'archived'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === s ? 'bg-royal-600 text-white' : 'glass text-silver-400 hover:text-white border border-white/5'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['From', 'Subject', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}>{Array(5).fill(0).map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded" /></td>)}</tr>)
              ) : contacts.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-silver-500 text-sm">No messages found.</td></tr>
              ) : (
                contacts.map(c => (
                  <tr key={c._id} className={`hover:bg-white/2 cursor-pointer transition-colors ${c.status === 'unread' ? 'bg-royal-900/10' : ''}`}
                    onClick={() => setSelected(c)}>
                    <td className="px-5 py-4">
                      <p className={`text-sm font-medium ${c.status === 'unread' ? 'text-white' : 'text-silver-300'}`}>{c.name}</p>
                      <p className="text-silver-500 text-xs">{c.email}</p>
                    </td>
                    <td className="px-5 py-4 text-silver-400 text-sm">{c.subject || c.message?.slice(0,40) + '...'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-4 text-silver-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        {c.status !== 'replied' && (
                          <button onClick={() => markStatus(c._id, 'replied')} title="Mark replied"
                            className="w-7 h-7 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-green-400 border border-white/5">
                            <FiCheck size={12} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(c._id)}
                          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-silver-400 hover:text-red-400 border border-white/5">
                          <FiTrash2 size={12} />
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

      {/* Message detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message Detail" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-silver-500 text-xs uppercase tracking-wide mb-1">From</p>
                <p className="text-white font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-silver-500 text-xs uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-royal-400 hover:underline">{selected.email}</a>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-silver-500 text-xs uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-white">{selected.phone}</p>
                </div>
              )}
              <div>
                <p className="text-silver-500 text-xs uppercase tracking-wide mb-1">Date</p>
                <p className="text-silver-300">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {selected.subject && (
              <div>
                <p className="text-silver-500 text-xs uppercase tracking-wide mb-1">Subject</p>
                <p className="text-white">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="text-silver-500 text-xs uppercase tracking-wide mb-2">Message</p>
              <div className="glass rounded-xl p-4 border border-white/5">
                <p className="text-silver-200 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href={`mailto:${selected.email}`}
                className="btn-royal text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2"
                onClick={() => markStatus(selected._id, 'replied')}>
                <FiMail size={14} /> Reply via Email
              </a>
              {selected.phone && (
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="btn-ghost text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiMessageSquare size={14} /> WhatsApp
                </a>
              )}
              <button onClick={() => { markStatus(selected._id, 'archived'); setSelected(null); }}
                className="btn-ghost text-silver-400 text-sm px-4 py-2 rounded-xl">
                Archive
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
