import Link from 'next/link';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';

export default function ArticleSlider({ articles }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Slider {...settings} className="article-slider">
        {articles.map((article) => (
          <div key={article.id} className="p-2">
            <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="relative h-48">
                <Image
                  src={article.image_url || '/placeholder.jpg'}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2">
                    {article.categories?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <time>{new Date(article.created_at).toLocaleDateString('en-GB')}</time>
                  <span className="mx-2">•</span>
                  <span>{article.views || 0} views</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  <Link 
                    href={`/articles/${article.slug}`} 
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-4">
                  <Link 
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Read More 
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        ))}
      </Slider>
    </div>
  );
}