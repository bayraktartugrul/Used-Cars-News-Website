import requests
from bs4 import BeautifulSoup
import time
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from slugify import slugify
from datetime import datetime
from urllib.parse import urlparse

# .env dosyasını yükle
load_dotenv('.env.local')

# Supabase ve OpenAI yapılandırması
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')

# Bağlantıları kontrol et
if not all([SUPABASE_URL, SUPABASE_KEY, DEEPSEEK_API_KEY]):
    raise ValueError("Missing environment variables. Check .env.local file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Multiple news sources configuration
NEWS_SOURCES = [
    {
        'name': 'Car Dealer Magazine',
        'url': 'https://cardealermagazine.co.uk/publish/category/used-cars',
        'selectors': {
            'article': 'article.post',
            'title': 'h2.entry-title a',
            'link': 'h2.entry-title a',
            'image': '.post-thumbnail img',
            'content': '.entry-content',
            'excerpt': '.entry-content p:first-of-type'
        },
        'base_url': 'https://cardealermagazine.co.uk'
    },
    {
        'name': 'AM Online',
        'url': 'https://www.am-online.com/used-cars',
        'selectors': {
            'article': '.article-item',
            'title': 'h3 a',
            'link': 'h3 a',
            'image': '.article-image img',
            'content': '.article-body',
            'excerpt': '.article-intro'
        },
        'base_url': 'https://www.am-online.com'
    },
    {
        'name': 'Auto Express',
        'url': 'https://www.autoexpress.co.uk/used-cars',
        'selectors': {
            'article': 'article.article',
            'title': 'h3.article__title a',
            'link': 'h3.article__title a',
            'image': '.article__image img',
            'content': '.article__body',
            'excerpt': '.article__excerpt'
        },
        'base_url': 'https://www.autoexpress.co.uk'
    }
]

def get_ai_summary(content):
    try:
        url = "https://api.deepseek.com/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional automotive journalist specializing in the UK used car market. Create a concise summary of the article in 2-3 paragraphs, focusing on market insights, price trends, and key information for UK car buyers."
                },
                {
                    "role": "user",
                    "content": content
                }
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
        
    except Exception as e:
        print(f"Deepseek API Error: {str(e)}")
        print(f"Error type: {type(e)}")
        return None

def scrape_article(url, source_config):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.9',
            'Connection': 'keep-alive',
            'Referer': source_config['base_url']
        }
        
        print(f"\nFetching URL: {url}")
        
        if not url.startswith('http'):
            url = source_config['base_url'] + url
            print(f"Complete URL: {url}")

        response = requests.get(url, headers=headers, timeout=15, verify=False)
        print(f"Response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Error: HTTP {response.status_code}")
            return None

        soup = BeautifulSoup(response.text, 'html.parser')
        content_selector = source_config['selectors']['content']
        content_div = soup.select_one(content_selector)
        
        if not content_div:
            print("Content div not found!")
            return None
            
        # Clean unwanted elements
        for unwanted in content_div.select('script, style, .advertisement, .social-share, .related-posts, .widget, .sidebar, nav, header, footer, .newsletter, .subscription'):
            unwanted.decompose()
            
        paragraphs = []
        for p in content_div.find_all(['p', 'h2', 'h3', 'h4']):
            text = p.get_text().strip()
            if text and len(text) > 20:  # Minimum length check
                if not any(skip in text.lower() for skip in [
                    'related', 'advertisement', 'subscribe', 'newsletter',
                    'cookie', 'privacy', 'follow us', 'share this'
                ]):
                    paragraphs.append(text)
        
        if not paragraphs:
            print("No paragraphs found!")
            return None
            
        full_content = '\n\n'.join(paragraphs)
        print(f"Total content length: {len(full_content)} characters")
        
        return full_content
        
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {str(e)}")
        return None
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(f"Error type: {type(e)}")
        return None

def create_unique_slug(title):
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    base_slug = slugify(title)
    return f"{base_slug}-{timestamp}"

def save_to_supabase(article_data):
    try:
        data_to_insert = {
            'title': article_data['title'][:200],
            'slug': article_data['slug'][:200],
            'excerpt': article_data['excerpt'][:500] if article_data['excerpt'] else None,
            'image_url': article_data['image_url'],
            'source_url': article_data['source_url'][:500],
            'source_name': article_data['source_name'],
            'original_content': article_data['original_content'],
            'ai_summary': article_data['ai_summary'],
            'status': 'published',
            'created_at': datetime.now().isoformat(),
            'category': article_data.get('category', 'used-cars')
        }

        result = supabase.table('articles').insert(data_to_insert).execute()
        return bool(result.data)
            
    except Exception as e:
        print(f"Database Error: {str(e)}")
        return False

def main():
    print("\n=== Otomotiv Haber Botu Başlatılıyor ===")
    
    for source in NEWS_SOURCES:
        print(f"\n{'='*50}")
        print(f"Kaynak işleniyor: {source['name']}")
        print(f"URL: {source['url']}")
        print(f"{'='*50}\n")
        
        try:
            response = requests.get(
                source['url'], 
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
                }, 
                timeout=15,
                verify=False
            )
            response.raise_for_status()
            
            print(f"Ana sayfa yanıt durumu: {response.status_code}")
            
            soup = BeautifulSoup(response.text, 'html.parser')
            articles = soup.select(source['selectors']['article'])
            
            if not articles:
                print("Haber elementleri bulunamadı!")
                print("Sayfa HTML'i:")
                print(soup.prettify()[:500])
                continue
                
            print(f"Bulunan haber sayısı: {len(articles)}")
            processed_count = 0
            
            for article in articles[:7]:  # Her kaynaktan 7 haber işle
                try:
                    title_elem = article.select_one(source['selectors']['title'])
                    link_elem = article.select_one(source['selectors']['link'])
                    
                    if not title_elem or not link_elem:
                        continue
                        
                    title = title_elem.get_text().strip()
                    link = link_elem.get('href')
                    
                    # Haber zaten var mı kontrol et
                    existing = supabase.table('articles').select('id').eq('source_url', link).execute()
                    if existing.data:
                        print(f"Bu haber zaten mevcut: {title}")
                        continue
                    
                    content = scrape_article(link, source)
                    if not content:
                        continue
                        
                    # AI özeti al
                    ai_summary = get_ai_summary(content)
                    if not ai_summary:
                        ai_summary = content[:500] + "..."  # Yedek özet
                    
                    # Haber verisini hazırla
                    article_data = {
                        'title': title,
                        'slug': create_unique_slug(title),
                        'excerpt': content[:200] + "...",
                        'image_url': 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd',
                        'source_url': link,
                        'source_name': source['name'],
                        'original_content': content,
                        'ai_summary': ai_summary,
                        'category': 'ikinci-el'
                    }
                    
                    if save_to_supabase(article_data):
                        print(f"✓ Kaydedildi: {title}")
                        processed_count += 1
                    
                    time.sleep(2)  # Hız sınırlaması
                    
                except Exception as e:
                    print(f"Haber işlenirken hata: {str(e)}")
                    continue
            
            print(f"Başarıyla işlenen haber sayısı: {processed_count} - Kaynak: {source['name']}")
            
        except Exception as e:
            print(f"Kaynak işlenirken hata oluştu {source['name']}: {str(e)}")
            continue
            
        time.sleep(5)  # Kaynaklar arası bekleme
    
    print("\n=== Bot Tamamlandı ===")

if __name__ == "__main__":
    main() 