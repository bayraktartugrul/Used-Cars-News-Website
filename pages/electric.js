import Layout from '../components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function ElectricPage() {
  const news = [
    {
      id: 1,
      title: "Tesla Model 3 Prices Rising in Used Car Market",
      excerpt: "Used Tesla Model 3 prices have increased by 15% over the last 6 months, showing strong demand for electric vehicles.",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89",
      date: "2024-03-20",
      category: "Electric"
    },
    {
      id: 2,
      title: "BMW i4 vs Tesla Model 3: Used Market Comparison",
      excerpt: "A detailed comparison of two popular electric vehicles in the used car market: BMW i4 and Tesla Model 3.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      date: "2024-03-19",
      category: "Electric"
    }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Electric Vehicles
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Latest developments and opportunities in the used electric vehicle market
          </p>
        </div>

        {/* News Grid */}
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