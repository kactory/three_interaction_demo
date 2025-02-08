import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Three.js Interaction Demo</h1>

      <div className="flex gap-4">
        <Link
          href="/cube"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          View Cube
        </Link>

        <Link
          href="/oval"
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          View Sphere
        </Link>
      </div>
    </main>
  )
}