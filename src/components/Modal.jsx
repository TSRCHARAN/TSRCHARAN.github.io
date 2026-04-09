export default function Modal({ isOpen, onClose, title, message, type = 'info', onConfirm, showConfirm = false }) {
  if (!isOpen) return null

  const typeStyles = {
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
  }

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 border-gray-200 dark:border-gray-700">
        <div className={`px-6 py-4 rounded-t-lg border-b-2 ${typeStyles[type]}`}>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{iconMap[type]}</span>
            {title}
          </h3>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message}</p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg flex gap-3 justify-end">
          {showConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm?.()
                  onClose()
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
