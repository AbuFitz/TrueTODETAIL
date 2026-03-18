const reasons = [
  {
    number: '01',
    title: 'Precision Detailing',
    desc: "We don't cut corners. Every pack is executed with professional-grade products and meticulous techniques that make a visible difference.",
  },
  {
    number: '02',
    title: 'Fully Mobile Service',
    desc: 'We come to you — driveway, office, car park, anywhere. No drop-offs, no waiting. You keep your day, we transform your car.',
  },
  {
    number: '03',
    title: 'Results Guaranteed',
    desc: "Not satisfied? We come back and make it right. No questions, no hassle. That's our promise to every single customer.",
  },
  {
    number: '04',
    title: 'Transparent Pricing',
    desc: 'Pick a pack, pick your vehicle. Your price is fixed and visible before you book. Zero surprises — ever.',
  },
]

export default function HowItWorks({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
            WHY CHOOSE
            <br />
            TRUE TO DETAIL
          </h2>
          <p className="font-body text-sm text-black/40 max-w-xs md:text-right leading-relaxed">
            Four reasons our customers keep coming back — and telling everyone they know.
          </p>
        </div>

        {/* Numbered rows */}
        <div className="border-t border-black/10">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[72px_1fr] md:grid-cols-[120px_260px_1fr] items-stretch border-b border-black/10 ${
                i % 2 === 0 ? 'bg-site-black text-white' : 'bg-site-light text-site-black'
              }`}
            >
              {/* Number + dot */}
              <div
                className={`flex flex-col items-center justify-center px-4 py-8 border-r ${
                  i % 2 === 0 ? 'border-white/10' : 'border-black/10'
                }`}
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-orange mb-2" />
                <span className="font-display text-4xl md:text-5xl leading-none">{r.number}</span>
              </div>

              {/* Title */}
              <div
                className={`flex items-center px-6 md:px-8 py-8 border-r ${
                  i % 2 === 0 ? 'border-white/10' : 'border-black/10'
                }`}
              >
                <span className="font-body font-bold text-base md:text-lg leading-snug">{r.title}</span>
              </div>

              {/* Description — hidden on smallest screens */}
              <div className="hidden md:flex items-center px-8 py-8">
                <p
                  className={`font-body text-sm leading-relaxed ${
                    i % 2 === 0 ? 'text-white/55' : 'text-black/55'
                  }`}
                >
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below rows */}
        <div>
          <button
            onClick={onBookNow}
            className="flex items-center gap-3 bg-site-black text-white px-8 py-5 font-body font-bold text-[11px] tracking-[0.15em] uppercase hover:bg-orange transition-colors duration-150"
          >
            BOOK YOUR PACK
            <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
          </button>
        </div>
      </div>
    </section>
  )
}
