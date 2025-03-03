import Image from 'next/image'
import Link from 'next/link'

// Unsplash koleksiyonlarından araba fotoğrafları
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888', // Modern araba
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8', // Klasik araba
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d', // Lüks araba
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c', // Spor araba
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d', // Elektrikli araba
];

const CATEGORY_IMAGES = {
  'electric': '/images/placeholders/electric-cars.jpg',
  'suv': '/images/placeholders/suv.jpg',
  'luxury': '/images/placeholders/luxury-cars.jpg',
  'classic': '/images/placeholders/classic-cars.jpg',
  'default': '/images/placeholders/default-car.jpg'
};

// date-fns olmadan tarih formatlama
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

export default function ArticleDetail({ article }) {
  if (!article) return null

  // Makale içeriğine göre rastgele bir resim seç
  const getDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return `${DEFAULT_IMAGES[randomIndex]}?auto=format&fit=crop&w=1200&h=800`;
  };

  const getPlaceholderImage = () => {
    const category = article.categories?.name?.toLowerCase() || 'default';
    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {article.image_url ? (
        <div className="relative h-[50vh] rounded-2xl overflow-hidden mb-8">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 w-full p-8">
            <div className="max-w-3xl">
              {article.categories?.name && (
                <Link 
                  href={`/category/${article.categories.name.toLowerCase()}`}
                  className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 hover:bg-red-700 transition-colors"
                >
                  {article.categories.name}
                </Link>
              )}
              <h1 className="text-4xl font-bold text-white mb-4">
                {article.title}
              </h1>
              <div className="flex items-center text-gray-200 text-sm">
                <time>
                  {formatDate(article.created_at)}
                </time>
                <span className="mx-2">•</span>
                <span>{article.source_name}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[50vh] rounded-2xl mb-8 relative overflow-hidden bg-gradient-to-br from-red-600 via-gray-800 to-black">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Araba silueti SVG */}
              <path d="M10,50 C30,20 70,20 90,50" stroke="white" fill="none" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-6">
              {article.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Excerpt */}
          <div className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
            {article.excerpt}
          </div>

          {/* Article Content */}
          <div className="prose dark:prose-invert max-w-none">
            {article.original_content ? (
              typeof article.original_content === 'string' ? (
                article.original_content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {article.original_content}
                </p>
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No content available
              </p>
            )}
          </div>

          {/* Source Link */}
          {article.source_url && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Read original article
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* AI Summary */}
          {article.ai_summary && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Summary
              </h3>
              <div className="text-gray-600 dark:text-gray-300">
                {typeof article.ai_summary === 'string' ? (
                  article.ai_summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{article.ai_summary}</p>
                )}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Article
            </h3>
            <div className="flex space-x-4">
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
} 