import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories (name),
          profiles (full_name),
          article_tags (
            tags (name)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function createArticle(articleData) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  return {
    articles,
    loading,
    error,
    createArticle
  }
} 