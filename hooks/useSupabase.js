import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export function useArticles({ limit = 10 } = {}) {
  const [articles, setArticles] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error

        setArticles(data)
      } catch (error) {
        console.error('Error fetching articles:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [limit])

  return { articles, loading, error }
}

// Tekil makale için hook
export function useArticle(slug) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            categories (
              name,
              slug
            )
          `)
          .eq('slug', slug)
          .single()

        if (error) throw error
        
        // Görüntülenme sayısını artır
        if (data) {
          await supabase
            .from('articles')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id)
        }

        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  return { article, loading, error }
}

// Market istatistikleri için yeni hook ekliyoruz
export function useMarketStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const { data, error } = await supabase
        .from('market_stats')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStats(data || [])
    } catch (error) {
      setError(error.message)
      console.error('Error fetching market stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error
  }
} 