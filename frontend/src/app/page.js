import Dropzonebox from '@/components/Dropzonebox'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      {/* Heading Section */}
      <section className="text-center max-w-4xl mt-10 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow-sm">
          Resume Analyzer
        </h1>
        <p className="text-lg md:text-xl text-gray-700 font-medium mb-10 px-4">
          Upload your resume to get instant insights, skill matches, and personalized tips — all powered by smart analysis.
        </p>
      </section>

      {/* Upload Box */}
      <Dropzonebox />

    </main>
  )
}
