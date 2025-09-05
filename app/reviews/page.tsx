'use client'

import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'

interface Review {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url: string
  type: 'customer' | 'rep'
  featured: boolean
  customer_name?: string
  rep_name?: string
  location: string
  date_recorded: string
  status: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'customer' | 'rep'>('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Review | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, filter, featuredOnly])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reviews')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    let filtered = reviews

    if (filter !== 'all') {
      filtered = filtered.filter(review => review.type === filter)
    }

    if (featuredOnly) {
      filtered = filtered.filter(review => review.featured)
    }

    setFilteredReviews(filtered)
  }

  const openVideoModal = (review: Review) => {
    setSelectedVideo(review)
    document.body.style.overflow = 'hidden'
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
    document.body.style.overflow = 'unset'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Customer & Rep Reviews
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our satisfied customers and successful sales representatives about their experiences with Aveyo
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter('customer')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'customer'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setFilter('rep')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === 'rep'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Reps
            </button>
          </div>
          
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              featuredOnly
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ⭐ Featured Only
          </button>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Video Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openVideoModal(review)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-700">
                  {review.thumbnail_url ? (
                    <img
                      src={review.thumbnail_url}
                      alt={review.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5-8-5z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {review.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ Featured
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                    review.type === 'customer' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {review.type === 'customer' ? 'Customer' : 'Rep'}
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {review.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {review.description}
                  </p>
                  
                  <div className="space-y-1 text-xs text-gray-500">
                    {review.customer_name && (
                      <p>👤 {review.customer_name}</p>
                    )}
                    {review.rep_name && (
                      <p>🏆 {review.rep_name}</p>
                    )}
                    <p>📍 {review.location}</p>
                    <p>📅 {formatDate(review.date_recorded)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Reviews Found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'No reviews available at the moment.' 
                : `No ${filter} reviews match your current filters.`}
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedVideo.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedVideo.type === 'customer' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {selectedVideo.type === 'customer' ? 'Customer Review' : 'Rep Review'}
                  </span>
                  {selectedVideo.featured && (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-white text-3xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Video Player */}
            <div className="p-6">
              <div className="aspect-video bg-black rounded-lg mb-4">
                <video
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                  src={selectedVideo.video_url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Details */}
              <div className="space-y-4">
                <p className="text-gray-300">{selectedVideo.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {selectedVideo.customer_name && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>👤</span>
                      <span>Customer: {selectedVideo.customer_name}</span>
                    </div>
                  )}
                  {selectedVideo.rep_name && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>🏆</span>
                      <span>Rep: {selectedVideo.rep_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>📍</span>
                    <span>Location: {selectedVideo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>📅</span>
                    <span>Recorded: {formatDate(selectedVideo.date_recorded)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
