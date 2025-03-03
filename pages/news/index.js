import Layout from '../../components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: "Latest Trends in Used Car Market",
      excerpt: "Comprehensive overview of current market trends, including price changes and popular models.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      date: "2024-03-20",
      category: "Market"
    },
    {
      id: 2,
      title: "Electric Vehicle Resale Value Study",
      excerpt: "New research reveals how electric vehicles are holding their value in the used car market.",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
      date: "2024-03-19",
      category: "Electric"
    },
    {
      id: 3,
      title: "Luxury Cars: Best Time to Buy Used",
      excerpt: "Expert analysis on the optimal timing for purchasing used luxury vehicles.",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935",
      date: "2024-03-18",
      category: "Luxury"
    }
  ]

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article 
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <time className="text-sm text-gray-500 dark:text-gray-400">{item.date}</time>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {item.category}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  <Link href={`/news/${item.id}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
} 