'use client'

import { ReactNode } from 'react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSave?: () => void
  onCancel?: () => void
  saveText?: string
  cancelText?: string
}

export default function EditModal({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  saveText = 'Save Changes',
  cancelText = 'Cancel'
}: EditModalProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleSave = () => {
    onSave?.()
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#0d0d0d] border border-[#333] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
          <h2 className="text-xl font-telegraf font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#888d95] hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-[#333]">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-sm font-medium text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium text-white"
          >
            {saveText}
          </button>
        </div>
      </div>
    </div>
  )
}
