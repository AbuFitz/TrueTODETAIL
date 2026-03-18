// Testimonials removed — new business, no reviews yet
export default function Testimonials() { return null }

  {
    name: 'JAMES T.',
    vehicle: 'BMW M3',
    pack: 'Elite Ceramic',
    stars: 5,
    text: 'Absolutely insane result. The paint looks better than when I bought the car new. These guys are proper professionals — worth every penny.',
    bg: 'bg-site-black',
    textColor: 'text-white',
  },
  {
    name: 'SARAH M.',
    vehicle: 'Toyota RAV4',
    pack: 'Premium Detail',
    stars: 5,
    text: "I've been to other detailers before but nothing compares. The interior steam clean removed a year's worth of kid mess. Couldn't be happier.",
    bg: 'bg-orange',
    textColor: 'text-site-black',
  },
  {
    name: 'MARCUS O.',
    vehicle: 'Mercedes C-Class',
    pack: 'Deep Clean',
    stars: 5,
    text: 'Fast booking, they came to my house, done in 5 hours. The car looks brand new. I have already booked my second session.',
    bg: 'bg-site-black',
    textColor: 'text-white',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
            WHAT
            <br />
            CUSTOMERS
            <br />
            SAY
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-orange text-xl">★</span>
              ))}
            </div>
            <span className="font-display font-black text-sm tracking-widest">
              5.0 — GOOGLE RATED
            </span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/10">
          {reviews.map((review, i) => (
            <div key={i} className={`${review.bg} ${review.textColor} p-10 border border-black/10 flex flex-col justify-between min-h-72`}>
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <span
                    key={j}
                    className={`text-lg ${
                      review.bg === 'bg-orange' ? 'text-site-black' : 'text-orange'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p
                className={`font-body text-base leading-relaxed flex-1 mb-8 ${
                  review.bg === 'bg-orange' ? 'text-site-black/80' : 'text-white/80'
                }`}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-white/15 pt-6">
                <p className={`font-display font-black text-lg uppercase ${review.textColor}`}>
                  {review.name}
                </p>
                <p
                  className={`font-body text-xs tracking-wider mt-1 ${
                    review.bg === 'bg-orange' ? 'text-site-black/50' : 'text-white/50'
                  }`}
                >
                  {review.vehicle} — {review.pack}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
