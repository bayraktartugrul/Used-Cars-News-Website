import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import Layout from '../../components/Layout'

export default function ArticlePage() {
  const router = useRouter()
  const { id } = router.query
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  async function fetchArticle() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setArticle(data)
    } catch (error) {
      console.error('Error fetching article:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    )
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600">Article not found</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <Link 
              href="/news"
              className="mt-4 inline-block text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ← Back to news
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>{article.title} | Used Cars</title>
        <meta name="description" content={article.excerpt} />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gray-900">
        <Image
          src={article.image_url || 'https://placehold.co/1200x800/e63946/ffffff?text=News+Article'}
          alt={article.title}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        <div className="absolute bottom-0 w-full">
          <div className="max-w-4xl mx-auto px-4 pb-12">
            {/* Category and Date */}
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
              {article.categories?.name && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full">
                  {article.categories.name}
                </span>
              )}
              <time>{formatDate(article.created_at)}</time>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {article.content ? (
                typeof article.content === 'string' ? (
                  article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>{article.content}</p>
                )
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No content available
                </p>
              )}
            </article>

            {/* Share Buttons */}
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
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Source Info */}
            {article.source_name && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Source
                </h3>
                <span className="text-gray-600 dark:text-gray-300">
                  {article.source_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
} 