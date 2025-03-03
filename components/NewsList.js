import Link from 'next/link'
import Image from 'next/image'

export default function NewsList() {
  const news = [
    {
      id: 1,
      title: "Tesla Model 3 İkinci El Pazarında Yükseliş",
      excerpt: "İngiltere'de ikinci el Tesla Model 3 fiyatları son 6 ayda %15 artış gösterdi. Elektrikli araçlara olan talep artışı devam ediyor.",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3",
      date: "2024-03-20",
      category: "Elektrikli"
    },
    {
      id: 2,
      title: "Range Rover Sport: 2024'ün En Çok Aranan SUV'u",
      excerpt: "İkinci el lüks SUV pazarında Range Rover Sport, değerini en iyi koruyan modellerden biri olmaya devam ediyor.",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3",
      date: "2024-03-19",
      category: "SUV"
    },
    {
      id: 3,
      title: "£5000 Altı En İyi 5 İkinci El Araç",
      excerpt: "Düşük bütçeyle kaliteli bir ikinci el araç almak isteyenler için en iyi seçenekleri derledik.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3",
      date: "2024-03-18",
      category: "Ekonomik"
    },
    {
      id: 4,
      title: "BMW M4 Competition İkinci El Analizi",
      excerpt: "Lüks performans segmentinde BMW M4 Competition'ın ikinci el piyasasındaki durumunu inceledik.",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3",
      date: "2024-03-17",
      category: "Lüks"
    },
    {
      id: 5,
      title: "Klasik Mini Cooper Değerleri Artıyor",
      excerpt: "İngiliz klasiği Mini Cooper'ın koleksiyon değeri son bir yılda %25 artış gösterdi.",
      image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?ixlib=rb-4.0.3",
      date: "2024-03-16",
      category: "Klasik"
    },
    {
      id: 6,
      title: "2024 İkinci El Alım Rehberi",
      excerpt: "İkinci el araç alırken dikkat edilmesi gereken püf noktaları ve güncel piyasa analizi.",
      image: "https://images.unsplash.com/photo-1562519819-016930ada31c?ixlib=rb-4.0.3",
      date: "2024-03-15",
      category: "Rehber"
    }
  ]

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Son <span className="text-red-600">Haberler</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <time className="text-sm text-gray-500 font-medium">{item.date}</time>
                <h3 className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors duration-200">
                  <Link href={`/haber/${item.id}`}>
                    {item.title}
                  </Link>
                </h3>
                <p className="text-gray-600 line-clamp-3">{item.excerpt}</p>
                <Link 
                  href={`/haber/${item.id}`}
                  className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors duration-200"
                >
                  Devamını Oku
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
} 