import Image from 'next/image'

export default function Hero({ onBookNow }: { onBookNow: () => void }) {
  return (
    <section className="pt-[88px] min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT — full-bleed image + orange headline block */}
      <div className="relative overflow-hidden min-h-[65vh] md:min-h-screen">
        <Image
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1600&q=90"
          alt="Glossy detailed car"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-site-black/40 via-transparent to-transparent" />

        {/* Orange headline band — positioned like Sanders & Young reference */}
        <div className="absolute inset-0 flex items-center">
          <div className="bg-orange ml-0 mr-8 px-8 py-10 max-w-[280px] md:max-w-[320px]">
            <h1 className="font-display text-[52px] md:text-[62px] lg:text-[72px] uppercase leading-[0.92] text-site-black">
              DETAILING
              <br />
              YOU CAN
              <br />
              TRUST.
            </h1>
          </div>
        </div>
      </div>

      {/* RIGHT — white panel with editorial layout */}
      <div className="flex flex-col bg-white">

        {/* Top: black header strip — mirrors nav style */}
        <div className="bg-site-black px-8 md:px-12 py-6 flex items-center justify-between flex-shrink-0">
          <p className="font-body text-[10px] tracking-[0.22em] uppercase text-white/40">
            100% Mobile Service
          </p>
          <span className="flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-orange" />
            Hemel Hempstead &amp; Surrounding Areas
          </span>
        </div>

        {/* Middle: tagline + CTA */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-10">
          <p className="font-body text-sm text-black/40 tracking-wider uppercase mb-5">
            — We come to you
          </p>
          <p className="font-body text-base md:text-lg text-black/65 max-w-sm leading-relaxed mb-10">
            Professional mobile detailing packs delivered to your door. We use
            pro-grade products and precision techniques to give your car the
            finish it deserves.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBookNow}
              className="bg-site-black text-white px-8 py-5 font-body font-bold text-[11px] tracking-[0.15em] flex items-center justify-between gap-6 hover:bg-orange transition-colors duration-200"
            >
              SHOP PACKS
              <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
            </button>
            <a
              href="#services"
              className="border-2 border-black/20 text-site-black px-8 py-5 font-body font-bold text-[11px] tracking-[0.15em] flex items-center justify-center hover:border-site-black transition-colors duration-200"
            >
              SEE SERVICES
            </a>
          </div>
        </div>

        {/* Bottom: secondary car image with badge */}
        <div className="relative h-60 md:h-72 flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1547245324-d777c6f05e80?w=900&q=80"
            alt="Car paint perfection close-up"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-site-black/30" />
          {/* Bottom info strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-site-black px-6 py-4 flex items-center justify-between">
            <span className="font-body font-semibold text-white text-[10px] tracking-[0.2em] uppercase">
              Schedule &amp; Get Same-Day Slots
            </span>
            <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />
          </div>
        </div>
      </div>

    </section>
  )
}
