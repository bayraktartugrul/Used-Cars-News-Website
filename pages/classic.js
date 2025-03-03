import Layout from '../components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function ClassicPage() {
  const news = [
    {
      id: 1,
      title: "Classic Car Market Trends 2024",
      excerpt: "Analysis of classic car market trends, including which models are gaining value and investment opportunities.",
      image: "https://images.unsplash.com/photo-1566274360936-69fae8dc1700",
      date: "2024-03-20",
      category: "Classic"
    },
    {
      id: 2,
      title: "Restoring Classic Cars: Expert Guide",
      excerpt: "Professional tips and insights on restoring classic cars, from finding parts to maintaining authenticity.",
      image: "https://images.unsplash.com/photo-1536700503339-1e4b06520771",
      date: "2024-03-19",
      category: "Classic"
    }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Classic Cars
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Explore timeless classics and vintage automobiles
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
                <time className="text-sm text-gray-500 dark:text-gray-400">{item.date}</time>
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