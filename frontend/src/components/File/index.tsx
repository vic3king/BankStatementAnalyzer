import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaRegFileAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { SlOptions } from "react-icons/sl"
import { getFileExt, truncateFileName } from "../../lib/utilities"
import { RxText } from "react-icons/rx"
import { UploadJob } from "../../types/types"

interface IFile {
  fileName: string
  job?: UploadJob
  uploadStatus?: 'uploading' | 'queued' | 'processing' | 'completed' | 'failed'
}

const File = ({ fileName, job, uploadStatus }: IFile) => {
  const getStatusIcon = () => {
    if (uploadStatus === 'uploading' || job?.status === 'active') {
      return (
        <div className="flex justify-center items-center animate-spin text-purple-700">
          <AiOutlineLoading3Quarters />
        </div>
      )
    }

    if (job?.status === 'completed') {
      return <FaCheckCircle className="text-green-600" />
    }

    if (job?.status === 'failed') {
      return <FaExclamationCircle className="text-red-600" />
    }

    if (uploadStatus === 'queued' || job?.status === 'queued' || job?.status === 'delayed') {
      return (
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
      )
    }

    return <SlOptions />
  }

  const getStatusText = () => {
    if (uploadStatus === 'uploading') return 'Uploading...'
    if (job?.status === 'queued' || job?.status === 'delayed') return 'Queued'
    if (job?.status === 'active') return `Processing... ${job.progress}%`
    if (job?.status === 'completed') return 'Completed'
    if (job?.status === 'failed') return `Failed: ${job.error?.message || 'Unknown error'}`
    return ''
  }

  return (
    <div className="p-6 bg-gray-100 flex justify-between items-center rounded">
      <div className="flex gap-2 items-center flex-1">
        <div className="p-1 border rounded border-gray-200">
          {getFileExt(fileName) === 'pdf' ? <FaRegFileAlt /> : <RxText />}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900" title={fileName}>
            {truncateFileName(fileName)}
          </p>
          {getStatusText() && (
            <p className="text-xs text-gray-500 mt-1">{getStatusText()}</p>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {getStatusIcon()}
      </div>
    </div>
  )
}

export default File