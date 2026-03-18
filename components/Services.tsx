import Image from 'next/image'

const services = [
  {
    title: 'Exterior Detail',
    desc: 'Hand wash, clay bar, machine polish and paint sealant for a showroom-grade finish.',
    bg: 'bg-orange',
    textColor: 'text-site-black',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1000&q=80',
    imageAlt: 'Car exterior detailing',
    size: 'col-span-1 md:col-span-2 row-span-2',
  },
  {
    title: 'Interior Detail',
    desc: 'Steam clean, leather care, carpet shampoo and ozone treatment for a like-new interior.',
    bg: 'bg-site-black',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    imageAlt: 'Car interior clean',
    size: 'col-span-1 row-span-1',
  },
  {
    title: 'Paint Correction',
    desc: 'Remove swirl marks, scratches and oxidation with multi-stage machine polishing.',
    bg: 'bg-site-black',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1611566026373-c6c8da0be2eb?w=800&q=80',
    imageAlt: 'Paint correction polishing',
    size: 'col-span-1 row-span-1',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
            COMPLETE
            <br />
            DETAILING
            <br />
            SERVICES
          </h2>
          <p className="font-body text-base text-black/50 max-w-xs">
            From a quick wash to a full ceramic coating — we handle every level of
            care your vehicle needs.
          </p>
        </div>

        {/* Main service cards — bento-style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/10">
          {services.map((svc, i) => (
            <div key={i} className={`relative overflow-hidden group ${i === 0 ? 'md:row-span-1' : ''}`}>
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={svc.image}
                  alt={svc.imageAlt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 ${svc.bg === 'bg-orange' ? 'bg-orange/80' : 'bg-site-black/75'}`} />
              </div>

              {/* Content */}
              <div className={`relative z-10 p-8 md:p-10 flex flex-col justify-end min-h-72 md:min-h-80 ${svc.textColor}`}>
                <h3 className="font-display font-black text-3xl md:text-4xl uppercase leading-none mb-3">
                  {svc.title}
                </h3>
                <p className="font-body text-sm leading-relaxed opacity-80 max-w-xs">
                  {svc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ceramic coating full-width card */}
        <div className="relative overflow-hidden group border border-t-0 border-black/10 mt-0">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80"
              alt="Ceramic coated car"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-site-black/60" />
          </div>
          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row md:items-end justify-between gap-6 min-h-64">
            <div className="text-white">
              <span className="font-body text-xs tracking-widest uppercase text-orange block mb-3">
                — Flagship Service
              </span>
              <h3 className="font-display font-black text-4xl md:text-6xl uppercase leading-none">
                CERAMIC COATING
              </h3>
              <p className="font-body text-sm mt-3 text-white/70 max-w-md">
                Industry-leading paint protection that bonds to your clear coat for up to 2 years of hydrophobic, scratch-resistant gloss.
              </p>
            </div>
            <a
              href="#packages"
              className="bg-orange text-white px-8 py-5 font-display font-black text-sm tracking-widest flex items-center gap-4 hover:bg-white hover:text-site-black transition-colors duration-200 flex-shrink-0"
            >
              VIEW CERAMIC PACK
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
