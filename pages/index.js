import Layout from '../components/Layout'
import HeroSection from '../components/HeroSection'
import { useRandomArticles } from '../hooks/useRandomArticles'
import LoadingSpinner from '../components/LoadingSpinner'
import ArticleCard from '../components/ArticleCard'

export default function Home() {
  // Farklı bölümler için farklı sayıda random makale getir
  const { articles: featuredArticles, loading: featuredLoading } = useRandomArticles({ limit: 3 })
  const { articles: latestArticles, loading: latestLoading } = useRandomArticles({ limit: 6 })
  const { articles: electricArticles } = useRandomArticles({ limit: 3, category: 'Electric' })
  const { articles: suvArticles } = useRandomArticles({ limit: 3, category: 'SUV' })

  if (featuredLoading || latestLoading) return <LoadingSpinner />

  return (
    <Layout>
      <HeroSection />

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