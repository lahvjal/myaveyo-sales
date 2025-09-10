'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import VideoCard from '@/components/VideoCard'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

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
  const [pageReady, setPageReady] = useState(false)

  const headerAnimation = useScrollAnimation<HTMLDivElement>({ delay: 200, disabled: false })
  const descriptionAnimation = useScrollAnimation<HTMLDivElement>({ delay: 400, disabled: false })
  const filtersAnimation = useScrollAnimation<HTMLDivElement>({ delay: 600, disabled: false })
  const gridAnimation = useScrollAnimation<HTMLDivElement>({ delay: 800, disabled: false })

  useEffect(() => {
    fetchReviews()
    setPageReady(true)
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
    <div className="bg-[#0d0d0d] min-h-screen">
      <Navbar />
      
      <div className="px-[50px] py-[130px]">
        <div className="max-w-[1480px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center pb-10">
            {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/10 rounded-full px-6 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 font-telegraf text-sm font-semibold">COMING SOON</span>
            </div> */}

            {/* Title */}
            <div className='flex flex-col items-center justify-center'>
              <div className="flex items-start justify-center gap-3 mb-8">
                <span className="text-white/60 text-[16px] font-telegraf mt-4">(E)</span>
                <h1 className="text-[60px] sm:text-[80px] md:text-[120px] font-telegraf font-extrabold uppercase leading-[0.8] text-white text-center">
                  Reviews
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-[20px] sm:text-[24px] md:text-[32px] max-w-[700px] font-telegraf text-white/80 mb-6 leading-relaxed text-center">
              Hear from our satisfied customers and successful sales representatives about their experiences with Aveyo.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div 
            ref={filtersAnimation.ref}
            className="flex items-center justify-center gap-2.5 mb-12 opacity-100 translate-y-0"
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-gradient-to-b from-[#232323] to-[#171717] text-white'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter('customer')}
              className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                filter === 'customer'
                  ? 'bg-white text-black'
                  : 'bg-gradient-to-b from-[#232323] to-[#171717] text-white'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setFilter('rep')}
              className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                filter === 'rep'
                  ? 'bg-white text-black'
                  : 'bg-gradient-to-b from-[#232323] to-[#171717] text-white'
              }`}
            >
              Reps
            </button>
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-[15px] py-[7px] rounded-[60px] text-[14px] font-inter font-semibold transition-colors ${
                featuredOnly
                  ? 'bg-white text-black'
                  : 'bg-gradient-to-b from-[#232323] to-[#171717] text-white'
              }`}
            >
              ⭐ Featured Only
            </button>
          </div>

          {/* Results Count */}
          <div className="text-center mb-12">
            <p className="text-[rgba(255,255,255,0.6)] text-[14px] font-telegraf">
              Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Video Grid */}
          {!loading && (
            <div 
              ref={gridAnimation.ref}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 opacity-100 translate-y-0"
            >
              {filteredReviews.map((review) => (
                <VideoCard
                  key={review.id}
                  thumbnailUrl={review.thumbnail_url}
                  title={review.title}
                  description={review.description}
                  customerName={review.customer_name}
                  repName={review.rep_name}
                  location={review.location}
                  dateRecorded={review.date_recorded}
                  type={review.type}
                  featured={review.featured}
                  onClick={() => openVideoModal(review)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredReviews.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-[24px] font-telegraf font-bold text-white mb-4">No Reviews Found</h3>
              <p className="text-[rgba(255,255,255,0.6)] text-[16px] font-telegraf">
                {filter === 'all' 
                  ? 'No reviews available at the moment.' 
                  : `No ${filter} reviews match your current filters.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#171717] to-[#0d0d0d] rounded-[3px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[rgba(255,255,255,0.1)]">
              <div>
                <h2 className="text-[24px] font-telegraf font-bold text-white">{selectedVideo.title}</h2>
                <div className="flex items-center gap-4 mt-3">
                  <span className={`px-3 py-1 rounded-full text-[12px] font-telegraf font-bold ${
                    selectedVideo.type === 'customer' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {selectedVideo.type === 'customer' ? 'Customer Review' : 'Rep Review'}
                  </span>
                  {selectedVideo.featured && (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[12px] font-telegraf font-bold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="text-[rgba(255,255,255,0.6)] hover:text-white text-3xl font-telegraf font-bold"
              >
                ×
              </button>
            </div>

            {/* Video Player */}
            <div className="p-6">
              <div className="aspect-video bg-black rounded-[3px] mb-6">
                <video
                  controls
                  autoPlay
                  className="w-full h-full rounded-[3px]"
                  src={selectedVideo.video_url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Details */}
              <div className="space-y-6">
                <p className="text-[rgba(255,255,255,0.8)] text-[16px] font-telegraf">{selectedVideo.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px] font-telegraf">
                  {selectedVideo.customer_name && (
                    <div className="flex items-center gap-2 text-[rgba(255,255,255,0.6)]">
                      <span>👤</span>
                      <span>Customer: {selectedVideo.customer_name}</span>
                    </div>
                  )}
                  {selectedVideo.rep_name && (
                    <div className="flex items-center gap-2 text-[rgba(255,255,255,0.6)]">
                      <span>🏆</span>
                      <span>Rep: {selectedVideo.rep_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[rgba(255,255,255,0.6)]">
                    <span>📍</span>
                    <span>Location: {selectedVideo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[rgba(255,255,255,0.6)]">
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
