import Layout from '../components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  async function fetchNews() {
    try {
      console.log('Fetching news...')
      const { data, error } = await supabase
        .from('articles')
        .select('*, categories(*)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError(error.message)
        throw error
      }

      console.log('Fetched articles:', data)
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
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

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600">Error loading news</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Latest News
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest news and insights from the used car market
          </p>
        </div>

        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="relative h-48">
                  <Image
                    src={item.image_url || 'https://placehold.co/800x400/e63946/ffffff?text=News'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.created_at)}
                    </time>
                    {item.categories?.name && (
                      <>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {item.categories.name}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    <Link href={`/news/${item.id}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              No articles found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Check back later for new content
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
} 