import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mediaAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2, FiCopy, FiImage, FiFile, FiVideo } from 'react-icons/fi';

const TYPE_ICONS = { image: FiImage, video: FiVideo, pdf: FiFile, document: FiFile, other: FiFile };

function MediaCard({ item, onDelete }) {
  const copyUrl = () => {
    navigator.clipboard.writeText(item.url);
    toast.success('URL copied!');
  };
  const Icon = TYPE_ICONS[item.type] || FiFile;
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/5 group">
      <div className="relative h-36 bg-royal-900/40 flex items-center justify-center overflow-hidden">
        {item.type === 'image' ? (
          <img src={item.url} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Icon className="text-silver-500" size={32} />
            <span className="text-silver-500 text-xs uppercase">{item.type}</span>
          </div>
        )}
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={copyUrl} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white border border-white/20 hover:border-royal-500/50 transition-all">
            <FiCopy size={14} />
          </button>
          <button onClick={() => onDelete(item._id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white border border-white/20 hover:border-red-500/50 hover:text-red-400 transition-all">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-silver-300 text-xs truncate">{item.originalName || item.filename}</p>
        <p className="text-silver-600 text-xs">{item.size ? `${(item.size / 1024).toFixed(1)} KB` : ''}</p>
      </div>
    </div>
  );
}

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('');
  const fileInputRef = useRef();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await mediaAPI.getAll({ type: filter || undefined, limit: 50 });
      setMedia(data.media || []);
    } catch { setMedia([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name);
      await mediaAPI.upload(formData);
      toast.success('Uploaded!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    try { await mediaAPI.delete(id); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Error'); }
  };

  return (
    <AdminLayout title="Media Manager">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          {['', 'image', 'video', 'pdf', 'document'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === t ? 'bg-royal-600 text-white' : 'glass text-silver-400 hover:text-white border border-white/5'}`}>
              {t || 'All'}
            </button>
          ))}
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden"
            accept="image/*,video/*,application/pdf,.doc,.docx" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-royal text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2 disabled:opacity-60"
          >
            {uploading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><FiUpload size={14} /> Upload File</>
            )}
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && fileInputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
            handleUpload({ target: { files: dt.files, value: '' } });
          }
        }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center mb-6 hover:border-royal-600/40 transition-colors"
      >
        <FiUpload className="mx-auto text-silver-600 mb-2" size={24} />
        <p className="text-silver-500 text-sm">Drag and drop files here, or click Upload</p>
        <p className="text-silver-700 text-xs mt-1">Images, Videos, PDFs up to 50MB</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden border border-white/5">
              <div className="h-36 skeleton" />
              <div className="p-3 space-y-1"><div className="h-3 skeleton rounded" /><div className="h-2 skeleton rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : media.length === 0 ? (
        <p className="text-center text-silver-500 text-sm py-12">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map(item => <MediaCard key={item._id} item={item} onDelete={handleDelete} />)}
        </div>
      )}
    </AdminLayout>
  );
}
