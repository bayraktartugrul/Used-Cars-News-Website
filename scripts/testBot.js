const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

// OpenAI yapılandırması
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Supabase bağlantısını kontrol et
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Supabase environment variables are missing!');
  process.exit(1);
}

// Supabase yapılandırması
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Headers
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Test için kaynak
const testSource = {
  name: 'Car Dealer Magazine',
  url: 'https://cardealermagazine.co.uk/publish/category/car-news',
  selector: {
    container: 'article.post',
    title: 'h2.entry-title a',
    excerpt: '.entry-content p:first-of-type',
    image: '.post-thumbnail img',
    link: 'h2.entry-title a'
  }
};

// Delay fonksiyonu
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('.entry-content').text().trim();
  } catch (error) {
    console.error('Content scraping error:', error.message);
    return null;
  }
}

async function generateAISummary(content) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional automotive journalist. Summarize the given article in 2-3 paragraphs."
        },
        {
          role: "user",
          content
        }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    return null;
  }
}

async function testScraping() {
  try {
    console.log('Starting scraping...');
    const response = await axios.get(testSource.url);
    const $ = cheerio.load(response.data);
    
    const articles = [];
    const foundArticles = $(testSource.selector.container);
    
    console.log(`Found ${foundArticles.length} articles`);

    // İlk 5 makaleyi işle
    for (let i = 0; i < Math.min(5, foundArticles.length); i++) {
      try {
        const article = $(foundArticles[i]);
        const title = article.find(testSource.selector.title).text().trim();
        const link = article.find(testSource.selector.link).attr('href');
        const imageUrl = article.find(testSource.selector.image).attr('src');
        const excerpt = article.find(testSource.selector.excerpt).text().trim();

        console.log(`\nProcessing article ${i + 1}:`);
        console.log('Title:', title);
        
        if (!title || !link) continue;

        // İçeriği çek
        const content = await scrapeArticleContent(link);
        if (!content) continue;

        // AI özeti oluştur
        await delay(1000); // Rate limiting
        const aiSummary = await generateAISummary(content);

        articles.push({
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          excerpt: excerpt || content.substring(0, 200),
          image_url: imageUrl,
          source_url: link,
          source_name: testSource.name,
          original_content: content,
          ai_summary: aiSummary,
          status: 'published',
          created_at: new Date().toISOString()
        });

        console.log('✓ Article processed successfully');
        await delay(2000); // Rate limiting
      } catch (err) {
        console.error(`Error processing article:`, err.message);
      }
    }

    if (articles.length > 0) {
      console.log('\nSaving articles to database...');
      
      for (const article of articles) {
        const { error } = await supabase
          .from('articles')
          .insert([article]);

        if (error) {
          console.error('Error saving article:', error);
        } else {
          console.log(`✓ Saved: ${article.title}`);
        }
        await delay(1000);
      }
    }

  } catch (error) {
    console.error('Main error:', error.message);
  }
}

// Çalıştır
testScraping(); 