import Image from 'next/image'

export default function BookingCTA({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1800&q=80"
          alt="Luxury car ready to be detailed"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-site-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 md:py-40">
        <div className="max-w-3xl">
          <p className="font-body text-xs tracking-widest uppercase text-orange mb-6">
            — Ready to transform your ride?
          </p>
          <h2 className="font-display font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-none text-white mb-8">
            YOUR CAR
            <br />
            <span className="text-orange">DESERVES</span>
            <br />
            THE BEST.
          </h2>
          <p className="font-body text-base text-white/60 max-w-md mb-12 leading-relaxed">
            We come to you. No drop-offs, no waiting rooms — just a professional
            mobile detailer arriving at your door and leaving your car looking
            better than the day you bought it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBookNow}
              className="bg-orange text-white px-10 py-6 font-display font-black text-sm tracking-widest flex items-center justify-between gap-8 hover:bg-white hover:text-site-black transition-colors duration-200"
            >
              BOOK YOUR PACK
              <span className="w-2.5 h-2.5 rounded-full bg-white group-hover:bg-orange flex-shrink-0" />
            </button>
            <a
              href="tel:+447984237149"
              className="border-2 border-white/30 text-white px-10 py-6 font-display font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:border-white transition-colors duration-200"
            >
              CALL&nbsp;&nbsp;07984 237149
            </a>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10 border-t border-white/10 bg-site-black/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 font-body text-xs tracking-wider">
          <span>100% Mobile — We come to your door, driveway or office</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange" />
            Same-week slots available
          </span>
        </div>
      </div>
    </section>
  )
}
