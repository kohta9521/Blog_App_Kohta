import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kohta-tech-blog.com'
  const currentDate = new Date()
  
  // 静的ページ
  const staticPages = [
    '',
    '/about',
    '/profile',
    '/contact',
    '/blog',
    '/legal/terms',
    '/legal/privacy',
  ]
  
  // 各言語のURLを生成
  const locales = ['ja', 'en']
  
  const urls: MetadataRoute.Sitemap = []
  
  // 静的ページを各言語で生成
  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: page === '/blog' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page === '/blog' ? 0.9 : 0.8,
        alternates: {
          languages: {
            ja: `${siteUrl}/ja${page}`,
            en: `${siteUrl}/en${page}`,
          },
        },
      })
    }
  }
  
  return urls
}
