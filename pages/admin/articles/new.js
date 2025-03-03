import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import { supabase } from '../../../lib/supabaseClient'
import Image from 'next/image'
import LoadingSpinner from '../../../components/LoadingSpinner'

export default function NewArticle() {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    meta_title: '',
    meta_description: '',
    keywords: [],
    category_id: '',
    featured: false,
    status: 'draft',
    original_content: '',
    ai_summary: '',
    source_url: '',
    source_name: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setSaving(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('article-images')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setSaving(false)
    }
  }

  const generateWithAI = async () => {
    if (!formData.original_content) {
      alert('Please enter the original content first')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.original_content
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error generating content')
      }

      // Update form data with generated content
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        excerpt: data.excerpt || prev.excerpt,
        content: data.content || prev.content,
        meta_title: data.meta_title || prev.meta_title,
        meta_description: data.meta_description || prev.meta_description,
        keywords: data.keywords || prev.keywords,
        ai_summary: data.summary || prev.ai_summary
      }))

    } catch (error) {
      console.error('Error generating content:', error)
      alert(error.message || 'Error generating content with AI')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([formData])
        .select()
        .single()

      if (error) throw error
      router.push('/admin/articles')
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Error creating article')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Create New Article">
      <div className="max-w-5xl mx-auto pb-12">
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Article
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a new article with AI-powered content optimization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Original Content Section */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Original Content</h2>
              </div>
              
              <button
                type="button"
                onClick={generateWithAI}
                disabled={saving || !formData.original_content}
                className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate All Fields
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paste Original Content
                </label>
                <textarea
                  name="original_content"
                  value={formData.original_content}
                  onChange={handleChange}
                  rows={15}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Paste the original content here to generate optimized article fields..."
                />
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* Media Upload */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Featured Image</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-gray-600 dark:text-gray-400"
                    >
                      <span className="block mb-2">Click to upload image</span>
                      <span className="text-sm">or drag and drop</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Content Editor */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Main Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="input-field"
                  rows={10}
                  required
                />
              </div>
              <div>
                <label className="form-label">AI Summary</label>
                <textarea
                  name="ai_summary"
                  value={formData.ai_summary}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* SEO Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended length: 50-60 characters
                </p>
              </div>

              <div>
                <label className="form-label">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div>
                <label className="form-label">Keywords (comma separated)</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    keywords: e.target.value.split(',').map(k => k.trim())
                  }))}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* Source Information */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Source Information</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Source Name</label>
                <input
                  type="text"
                  name="source_name"
                  value={formData.source_name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="form-label">Source URL</label>
                <input
                  type="url"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* Publishing Options */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Publishing Options</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Feature this article
                </label>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <div className="space-x-4">
                <button
                  type="submit"
                  name="status"
                  value="draft"
                  disabled={saving}
                  className="px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  name="status"
                  value="published"
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
} 