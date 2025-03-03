import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useArticle } from '../../hooks/useSupabase'
import LoadingSpinner from '../../components/LoadingSpinner'
import Layout from '../../components/Layout'

export default function ArticlePage({ slug }) {
  const router = useRouter()
  const { article, loading } = useArticle(slug)

  if (loading) return <LoadingSpinner />
  if (!article) return <div>Haber bulunamadı</div>

  return (
    <Layout>
      <Head>
        <title>{article.title} | Used Cars UK</title>
        <meta name="description" content={article.excerpt} />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900">
        {article.image_url && (
          <>
            <Image
              src={article.image_url}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              priority
              className="opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </>
        )}
        
        <div className="absolute bottom-0 w-full">
          <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* Kategori ve Tarih */}
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
              {article.categories?.name && (
                <Link 
                  href={`/category/${article.categories.slug}`}
                  className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                >
                  {article.categories.name}
                </Link>
              )}
              <time>
                {new Date(article.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>

            {/* Başlık */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {article.title}
            </h1>

            {/* Özet */}
            <p className="text-xl text-gray-300">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* İçerik Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Ana İçerik */}
          <div className="md:col-span-2">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {article.content}
            </article>

            {/* Paylaşım Butonları */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{article.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Kaynak Bilgisi */}
            {article.source_url && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Source
                </h3>
                <a 
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                >
                  <span>{article.source_name}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* İlgili Kategoriler */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Electric', 'SUV', 'Luxury', 'Budget'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      slug: params.slug
    }
  }
} 