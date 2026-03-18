import { API_URL } from '../config/api';

const Sitemap = () => null;

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lushsecret.vercel.app';

  // Páginas estáticas que queremos indexar
  const staticPages = [
    '',
    '/productos',
    '/carrito',
    '/login',
    '/registro',
    '/contacto',
    '/politica',
    '/envios-discretos',
  ];

  let products = [];
  try {
    const response = await fetch(`${API_URL}/api/products`);
    if (response.ok) {
      products = await response.json();
    }
  } catch (error) {
    console.error('Error generando sitemap:', error);
  }

  const buildUrl = (path) => `${baseUrl}${path}`;

  const urls = [
    ...staticPages.map((path) => ({ loc: buildUrl(path), changefreq: 'weekly' })),
    ...products.map((product) => ({ loc: buildUrl(`/producto/${product.id}`), changefreq: 'weekly' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (url) =>
        `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
  </url>`
    )
    .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

export default Sitemap;
