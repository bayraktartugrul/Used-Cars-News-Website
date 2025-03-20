import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const featuredNews = {
    id: 1,
    title: "Most Sought-After Used Cars of 2024",
    excerpt: "Detailed market analysis and most preferred models in the used car market",
    image: "/hero-image.jpg",
    category: "Featured",
    date: "2024-03-20"
  }

  return (
    <div className="relative bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              <span className="block">The Most Up-to-Date</span>
              <span className="block text-red-600">Used Car News</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stay informed with market analysis, price trends, and the latest automotive news to make the best decisions in your car buying journey.
            </p>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {featuredNews.category}
                  </span>
                  <time className="text-sm text-gray-500 font-medium">{featuredNews.date}</time>
                </div>
                <Link 
                  href={`/news/${featuredNews.id}`}
                  className="block group"
                >
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                    {featuredNews.title}
                  </h2>
                  <p className="mt-3 text-gray-600">{featuredNews.excerpt}</p>
                  <div className="mt-4 flex items-center text-red-600 font-medium group-hover:text-red-700">
                    Read More
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            <Image
              src="/hero-image.jpg"
              alt="Used Cars"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 