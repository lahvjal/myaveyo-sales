'use client'

interface GoogleDriveVideoProps {
  videoUrl: string
  title?: string
}

export default function GoogleDriveVideo({ videoUrl, title }: GoogleDriveVideoProps) {
  // Extract the file ID from various Google Drive URL formats
  const extractFileId = (url: string): string | null => {
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const match1 = url.match(/\/file\/d\/([^\/]+)/)
    if (match1) return match1[1]

    // Format 2: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/[?&]id=([^&]+)/)
    if (match2) return match2[1]

    // If already an embed URL or just an ID
    const match3 = url.match(/\/embed\/([^?]+)/)
    if (match3) return match3[1]

    // Assume it's just the file ID
    return url
  }

  const fileId = extractFileId(videoUrl)
  const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : videoUrl

  return (
    <div className="relative w-full aspect-video bg-black rounded-[3px] overflow-hidden">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={title || 'Video lesson'}
      />
    </div>
  )
}

