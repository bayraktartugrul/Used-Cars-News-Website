import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import { supabase } from '../../../lib/supabaseClient'
import LoadingSpinner from '../../../components/LoadingSpinner'

export default function ArticlesAdmin() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    category_id: 'all',
    search: ''
  })

  useEffect(() => {
    fetchArticles()
  }, [filters])

  async function fetchArticles() {
    try {
      setLoading(true)
      let query = supabase
        .from('articles')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.category_id !== 'all') {
        query = query.eq('category_id', filters.category_id)
      }
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      setArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
      alert('Error fetching articles')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id)

        if (error) throw error
        fetchArticles()
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Error deleting article')
      }
    }
  }

  return (
    <AdminLayout title="Article Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Articles</h2>
          <button 
            onClick={() => router.push('/admin/articles/new')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Add New Article
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              className="input-field"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={filters.category_id}
              onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {/* Categories will be mapped here */}
            </select>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="table-header">Title</th>
                    <th className="table-header">Category</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Views</th>
                    <th className="table-header">Created At</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="table-cell font-medium">{article.title}</td>
                      <td className="table-cell">{article.categories?.name || '-'}</td>
                      <td className="table-cell">
                        <span className={`status-badge ${article.status}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="table-cell">{article.views || 0}</td>
                      <td className="table-cell">
                        {new Date(article.created_at).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 