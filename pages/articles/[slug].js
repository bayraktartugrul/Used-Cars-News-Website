import Head from 'next/head'
import Layout from '../../components/Layout'
import ArticleDetail from '../../components/ArticleDetail'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useArticle } from '../../hooks/useSupabase'

export default function ArticlePage({ slug }) {
  const { article, loading, error } = useArticle(slug)

  if (loading) return <LoadingSpinner />
  if (error) return <div>Error loading article</div>
  if (!article) return <div>Article not found</div>

  return (
    <Layout>
      <Head>
        <title>{article.title} | Used Cars</title>
        <meta name="description" content={article.excerpt} />
        {article.keywords?.length > 0 && (
          <meta name="keywords" content={article.keywords.join(', ')} />
        )}
      </Head>

      <ArticleDetail article={article} />
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      slug: params.slug
    }
  }
} 