import Layout from '../components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function BudgetPage() {
  const news = [
    {
      id: 1,
      title: "Best Budget Cars Under $10,000",
      excerpt: "A comprehensive guide to finding reliable used cars that won't break the bank, featuring top picks under $10,000.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      date: "2024-03-20",
      category: "Budget"
    },
    {
      id: 2,
      title: "Maintaining Your Budget Car: Cost-Saving Tips",
      excerpt: "Expert advice on how to keep your budget-friendly used car running smoothly while minimizing maintenance costs.",
      image: "https://images.unsplash.com/photo-1562519819-016930ada31c",
      date: "2024-03-19",
      category: "Budget"
    }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Budget-Friendly Cars
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Discover affordable used cars that offer great value for money
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