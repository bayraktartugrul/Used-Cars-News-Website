import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useArticle(id) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    async function fetchArticle() {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError

        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const updateArticle = async (updates) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setArticle(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating article:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    article,
    loading,
    error,
    updateArticle
  }
} 