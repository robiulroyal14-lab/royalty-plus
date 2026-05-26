import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';

export default function Layout({
  children,
  title = 'Royalty Plus',
  description = 'Premium technology brand pioneering AI, robotics, and innovation',
  noFooter = false,
}) {
  const fullTitle = title === 'Royalty Plus' ? title : `${title} | Royalty Plus`;
  
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen flex flex-col bg-royal-950">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {!noFooter && <Footer />}
      </div>
    </>
  );
}
