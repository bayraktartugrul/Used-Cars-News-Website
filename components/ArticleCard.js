import Link from 'next/link'
import Image from 'next/image'

const ArticleCard = ({ article, className = "" }) => {
  // Varsayılan resim URL'si
  const defaultImage = '/images/placeholder.jpg'
  
  // Resim URL'sini kontrol et ve düzelt
  const imageUrl = article.image_url && article.image_url.startsWith('http') 
    ? article.image_url 
    : defaultImage

  return (
    <article 
      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.src = defaultImage
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2">
            {article.categories?.name || 'Uncategorized'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <time>{new Date(article.created_at).toLocaleDateString('en-GB')}</time>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {article.views || 0} views
          </span>
        </div>
        <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
          <Link 
            href={`/articles/${article.slug}`} 
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link 
            href={`/articles/${article.slug}`}
            className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
          >
            Read More 
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <button className="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard 