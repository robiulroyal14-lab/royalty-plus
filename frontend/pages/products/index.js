import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../../components/ui/AnimatedSection';
import { productsAPI } from '../../lib/api';
import { FiSearch, FiFilter, FiArrowRight, FiEye } from 'react-icons/fi';

function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden border border-white/5 glow-on-hover group"
    >
      <div className="relative h-52 bg-gradient-to-br from-royal-800/40 to-royal-900/60 overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-royal-700/40 flex items-center justify-center">
              <span className="font-display text-2xl text-royal-400">R</span>
            </div>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-royal-600/90 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-medium text-white mb-2 group-hover:text-royal-300 transition-colors">
          {product.title}
        </h3>
        <p className="text-silver-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {product.shortDescription || product.description}
        </p>
        <div className="flex items-center justify-between">
          {product.price && (
            <span className="gradient-text font-semibold text-lg">
              ${product.price}
            </span>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-royal-400 hover:text-white text-sm font-medium transition-colors group/link"
          >
            View Details
            <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton loader
function ProductSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5">
      <div className="h-52 skeleton" />
      <div className="p-6 space-y-3">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded" />
        <div className="h-4 skeleton rounded w-2/3" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getAll({ search, page, limit: 12 });
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, page]);

  return (
    <Layout title="Products" description="Explore Royalty Plus premium product lineup">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-900/50 to-royal-950" />
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="text-center">
            <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-3">Our Products</p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4">
              Premium Solutions
            </h1>
            <p className="text-silver-400 max-w-xl mx-auto">
              Explore our curated lineup of technology products, each engineered for excellence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 sticky top-16 z-30 glass-dark border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-500" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full input-dark rounded-xl pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-silver-400 text-lg">No products found.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" stagger={0.07}>
              {products.map((product) => (
                <StaggerItem key={product._id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-royal-600 text-white'
                      : 'glass text-silver-400 hover:text-white hover:border-royal-600/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
