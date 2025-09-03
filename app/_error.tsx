import { NextPageContext } from 'next'
import { ErrorProps } from 'next/error'

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-red-500 mb-4">
            {statusCode || '500'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {statusCode === 404 ? 'Page Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-6">
            {statusCode === 404 
              ? 'The page you are looking for does not exist.'
              : 'An unexpected error occurred. Please try again later.'
            }
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
