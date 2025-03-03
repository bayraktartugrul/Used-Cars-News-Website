import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useRandomArticles({ limit = 3, category = null } = {}) {
  const [articles, setArticles] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRandomArticles() {
      try {
        setLoading(true)
        let query = supabase
          .from('articles')
          .select(`
            *,
            categories (name)
          `)
          .eq('status', 'published')

        // Eğer kategori belirtilmişse filtrele
        if (category) {
          query = query.eq('category', category)
        }

        const { data, error: fetchError } = await query
          .limit(100) // Önce daha fazla makale çek
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        // Makaleleri karıştır ve istenen sayıda al
        const shuffled = data.sort(() => 0.5 - Math.random())
        const randomArticles = shuffled.slice(0, limit)

        setArticles(randomArticles)
      } catch (error) {
        console.error('Error fetching random articles:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomArticles()
  }, [limit, category])

  return { articles, loading, error }
} 