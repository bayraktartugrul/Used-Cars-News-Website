const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');

// Supabase bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Not: Bu özel bir servis anahtarı olmalı
);

// Haber kaynaklarını tanımlayalım
const newsSources = [
  {
    name: 'Arabam.com',
    url: 'https://www.arabam.com/blog/',
    selector: {
      container: '.blog-list-item',
      title: '.blog-list-item__title',
      excerpt: '.blog-list-item__description',
      image: '.blog-list-item__image img',
      link: '.blog-list-item__link',
      category: '.blog-list-item__category'
    }
  },
  {
    name: 'AutoCar',
    url: 'https://www.autocar.co.uk/car-news',
    selector: {
      container: 'article',
      title: 'h3',
      excerpt: '.field-item',
      image: 'img',
      category: '.category'
    }
  },
  {
    name: 'CarBuyer',
    url: 'https://www.carbuyer.co.uk/news',
    selector: {
      container: '.article-card',
      title: '.article-card__title',
      excerpt: '.article-card__description',
      image: '.article-card__image img',
      category: '.article-card__category'
    }
  }
  // Diğer haber kaynakları eklenebilir
];

// URL'den slug oluşturma fonksiyonu
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Haberi kontrol et ve kaydet
async function saveArticle(article) {
  try {
    // Önce aynı slug'a sahip haber var mı kontrol et
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', article.slug)
      .single();

    if (existingArticle) {
      console.log(`Article already exists: ${article.title}`);
      return;
    }

    // Yeni haberi kaydet
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        image_url: article.image_url,
        source_url: article.source_url,
        source_name: article.source_name,
        category_id: article.category_id,
        status: 'published'
      }]);

    if (error) throw error;
    console.log(`Saved article: ${article.title}`);
  } catch (error) {
    console.error('Error saving article:', error);
  }
}

// Kategori eşleştirme fonksiyonu
async function matchCategory(categoryText) {
  const categoryMap = {
    'electric': ['ev', 'electric', 'battery', 'tesla'],
    'suv': ['suv', 'crossover', '4x4'],
    'luxury': ['luxury', 'premium', 'bentley', 'rolls-royce'],
    'budget': ['budget', 'affordable', 'cheap'],
    'classic': ['classic', 'vintage', 'retro']
  };

  // Kategori eşleştirmesi yap
  for (const [key, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => categoryText.toLowerCase().includes(keyword))) {
      const { data } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', key)
        .single();
      
      return data?.id;
    }
  }

  return null; // Eşleşme bulunamazsa
}

// Haber çekme fonksiyonu
async function scrapeNews(source) {
  try {
    const response = await axios.get(source.url);
    const $ = cheerio.load(response.data);
    const articles = [];

    $(source.selector.container).each((i, el) => {
      const title = $(el).find(source.selector.title).text().trim();
      const excerpt = $(el).find(source.selector.excerpt).text().trim();
      const imageUrl = $(el).find(source.selector.image).attr('src');
      const categoryText = $(el).find(source.selector.category).text().trim();

      if (title && excerpt) {
        articles.push({
          title,
          slug: createSlug(title),
          excerpt,
          image_url: imageUrl,
          source_name: source.name,
          source_url: source.url,
          category_text: categoryText
        });
      }
    });

    // Kategorileri eşleştir ve haberleri kaydet
    for (const article of articles) {
      article.category_id = await matchCategory(article.category_text);
      await saveArticle(article);
    }

  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
  }
}

// Ana bot fonksiyonu
async function runNewsBot() {
  console.log('News bot started:', new Date().toISOString());
  
  for (const source of newsSources) {
    await scrapeNews(source);
  }
  
  console.log('News bot finished:', new Date().toISOString());
}

// Botu çalıştır (her 6 saatte bir)
cron.schedule('0 */6 * * *', runNewsBot);

// Test için hemen çalıştır
runNewsBot(); 