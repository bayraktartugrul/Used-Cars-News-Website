import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Articles</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">128</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">8</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">45.2K</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">892</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">New Article</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new article</p>
          </button>
          <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Categories</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Edit categories</p>
          </button>
          <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users</p>
          </button>
          <button className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View statistics</p>
          </button>
        </div>
      </div>
    </AdminLayout>
  )
} 