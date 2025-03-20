import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'
import HeroSection from '../components/HeroSection'
import { useRandomArticles } from '../hooks/useRandomArticles'
import LoadingSpinner from '../components/LoadingSpinner'
import ArticleCard from '../components/ArticleCard'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeaturedArticle()
  }, [])

  async function fetchFeaturedArticle() {
    try {
      // Önce featured olan haberleri kontrol et
      let { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Eğer featured haber yoksa, en son eklenen haberi getir
      if (!data) {
        const { data: latestArticle, error: latestError } = await supabase
          .from('articles')
          .select(`
            *,
            categories (
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (latestError) throw latestError
        data = latestArticle
      }

      if (error) throw error
      setFeaturedArticle(data)
    } catch (error) {
      console.error('Error fetching featured article:', error)
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

  // Farklı bölümler için farklı sayıda random makale getir
  const { articles: featuredArticles, loading: featuredLoading } = useRandomArticles({ limit: 3 })
  const { articles: latestArticles, loading: latestLoading } = useRandomArticles({ limit: 6 })
  const { articles: electricArticles } = useRandomArticles({ limit: 3, category: 'Electric' })
  const { articles: suvArticles } = useRandomArticles({ limit: 3, category: 'SUV' })

  if (featuredLoading || latestLoading) return <LoadingSpinner />

  return (
    <Layout>
      {/* Hero Section */}
      {featuredArticle ? (
        <div className="relative h-[70vh] bg-gray-900">
          <Image
            src={featuredArticle.image_url || 'https://placehold.co/1920x1080/e63946/ffffff?text=Featured+News'}
            alt={featuredArticle.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          <div className="absolute bottom-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              {/* Category and Date */}
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                {featuredArticle.categories?.name && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full">
                    {featuredArticle.categories.name}
                  </span>
                )}
                <time>{formatDate(featuredArticle.created_at)}</time>
                {featuredArticle.is_featured && (
                  <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
                <Link href={`/news/${featuredArticle.id}`} className="hover:text-red-400 transition-colors duration-200">
                  {featuredArticle.title}
                </Link>
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-300 max-w-3xl mb-8">
                {featuredArticle.excerpt}
              </p>

              {/* Read More Button */}
              <Link
                href={`/news/${featuredArticle.id}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                Read More
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="h-[70vh] bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : error ? (
        <div className="h-[70vh] bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Error loading featured article</h2>
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      {/* Featured Articles */}
      {featuredArticles && featuredArticles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Featured <span className="text-red-600">Insights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Latest Articles */}
      {latestArticles && latestArticles.length > 0 && (
        <div className="bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Latest <span className="text-red-600">Updates</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Specific Sections */}
      {electricArticles && electricArticles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Electric <span className="text-red-600">Vehicles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {electricArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
} 