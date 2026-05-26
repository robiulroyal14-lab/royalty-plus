import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { productsAPI } from '../../lib/api';
import { FiArrowLeft, FiCheck, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    productsAPI.getOne(slug)
      .then(({ data }) => setProduct(data))
      .catch(() => router.replace('/products'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Layout title="Loading...">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-royal-600/30 border-t-royal-400 rounded-full animate-spin" />
      </div>
    </Layout>
  );

  if (!product) return null;

  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];

  return (
    <Layout title={product.title} description={product.shortDescription || product.description}>
      <section className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-silver-400 hover:text-white text-sm mb-8 transition-colors">
            <FiArrowLeft size={14} /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <AnimatedSection direction="left">
              <div className="glass rounded-2xl overflow-hidden border border-white/5 mb-4">
                {images.length > 0 ? (
                  <img src={images[activeImage]} alt={product.title} className="w-full h-80 object-cover" />
                ) : (
                  <div className="w-full h-80 flex items-center justify-center bg-royal-900/40">
                    <FiPackage className="text-silver-600" size={48} />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-royal-500' : 'border-white/10'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection direction="right" delay={0.1}>
              {product.category && <p className="text-royal-400 text-xs uppercase tracking-widest mb-2">{product.category?.name}</p>}
              <h1 className="font-display text-4xl font-semibold text-white mb-4">{product.title}</h1>
              {product.price && (
                <div className="flex items-center gap-2 mb-5">
                  <span className="font-display text-3xl gradient-text font-semibold">{product.currency} {product.price}</span>
                </div>
              )}
              <p className="text-silver-300 leading-relaxed mb-8">{product.description}</p>

              {product.features?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-display text-lg font-medium text-white mb-3">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-silver-300 text-sm">
                        <FiCheck className="text-royal-400 mt-0.5 flex-shrink-0" size={14} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full glass border border-white/10 text-silver-400">{tag}</span>
                  ))}
                </div>
              )}

              <Link href="/contact" className="btn-royal inline-flex items-center gap-2 text-white font-medium px-7 py-3.5 rounded-xl mt-8 text-sm">
                Inquire About This Product
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
}
