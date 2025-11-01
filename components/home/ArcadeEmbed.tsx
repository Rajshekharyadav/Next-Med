"use client";

export function ArcadeEmbed() {
  return (
    <div className="relative py-8 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl text-white">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold text-white text-center mb-4" style={{textShadow: '0 0 15px rgba(78, 78, 231, 0.5)'}}>
          See NextMed in Action
        </h2>
        <p className="text-lg text-blue-100 text-center mb-8">
          Watch our interactive demo to see how easy it is to use AI diagnosis and book doctor appointments
        </p>
      </div>
      <div className="dark-glass mx-auto max-w-5xl" style={{ position: 'relative', paddingBottom: 'calc(52.45833333333333% + 41px)', height: '0', width: '90%', overflow: 'hidden' }}>
      <iframe
        src="https://demo.arcade.software/JbFMPFhPk0AVB6BH8rJr?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Use AI Diagnosis and Book a Doctor Appointment Online"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light', scrollbarWidth: 'none', msOverflowStyle: 'none', overflowX: 'hidden' }}
      />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
    </div>
  )
}