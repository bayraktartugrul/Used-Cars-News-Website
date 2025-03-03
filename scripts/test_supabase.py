from supabase import create_client
from dotenv import load_dotenv
import os
from datetime import datetime
from slugify import slugify

# .env dosyasını yükle
load_dotenv('.env.local')

# Supabase yapılandırması
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

print("Supabase URL:", SUPABASE_URL)
print("Supabase Key:", SUPABASE_KEY[:10] + "...")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Benzersiz bir başlık ve slug oluştur
timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
test_title = f"Test Article {timestamp}"
test_slug = slugify(test_title)

# Test verisi
test_article = {
    'title': test_title,
    'slug': test_slug,
    'excerpt': 'This is a test article',
    'image_url': None,  # Varsayılan resim kullanılacak
    'source_url': f'https://cardealermagazine.co.uk/test-{timestamp}',
    'source_name': 'Test Source',
    'original_content': 'Test content',
    'ai_summary': 'Test summary',
    'status': 'published',
    'created_at': datetime.now().isoformat()
}

try:
    # Tablo yapısını kontrol et
    print("\nChecking table structure...")
    response = supabase.table('articles').select("*").limit(1).execute()
    print("Table columns:", response.data[0].keys() if response.data else "No data")
    
    print("\nTrying to insert test article...")
    print("Title:", test_title)
    print("Slug:", test_slug)
    
    response = supabase.table('articles').insert([test_article]).execute()
    print("Insert Response:", response)
    
    if response.data:
        print("\nArticle inserted successfully!")
        print("Article ID:", response.data[0].get('id'))
    else:
        print("\nFailed to insert article")
        print("Response:", response)
    
except Exception as e:
    print("\nError:", str(e))
    print("Error type:", type(e)) 