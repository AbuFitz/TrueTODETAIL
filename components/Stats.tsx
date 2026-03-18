import Image from 'next/image'

const stats = [
  {
    value: '500+',
    label: 'Cars Detailed This Year',
    bg: 'bg-site-light',
    textColor: 'text-site-black',
  },
  {
    value: '5★',
    label: 'Google & Facebook Rated',
    bg: 'bg-site-black',
    textColor: 'text-white',
  },
  {
    value: '10+',
    label: 'Years In The Industry',
    bg: 'bg-site-black',
    textColor: 'text-white',
  },
  {
    value: 'CERTIFIED',
    label: 'Professional Detailers',
    bg: 'bg-site-light',
    textColor: 'text-site-black',
  },
]

export default function Stats() {
  return (
    <section id="about" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: headline + image */}
        <div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase leading-none mb-12">
            THE REGION&apos;S
            <br />
            BEST MOBILE
            <br />
            DETAILER
          </h2>
          <div className="relative h-72 md:h-80 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
              alt="Professional detailer at work"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Right: 2x2 bento stat grid */}
        <div className="grid grid-cols-2 gap-0 border border-black/10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} ${stat.textColor} p-8 flex flex-col justify-between min-h-48 border border-black/10`}
            >
              <span
                className={`font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase leading-none ${
                  stat.bg === 'bg-site-black' ? 'text-white' : 'text-site-black'
                }`}
              >
                {stat.value}
              </span>
              <span
                className={`font-body text-xs tracking-widest uppercase mt-6 ${
                  stat.bg === 'bg-site-black' ? 'text-white/60' : 'text-site-black/50'
                }`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
