import React, { useEffect, useRef, useState, useCallback } from "react"
import { Link } from "react-router-dom"

const SLIDE_INTERVAL = 5000 // ms

const slides = [
  {
    id: 1,
    title: "Laboratorio Clínico Sarmiento",
    desc: "Análisis clínicos para la detección, diagnóstico y seguimiento de enfermedades, con atención profesional y confiable.",
    ctaLabel: "Nuestros servicios",
    ctaTo: "/servicios",
    image: "/banners/banner1.jpg",
  },
  {
    id: 2,
    title: "Atención por orden de llegada",
    desc: "Atendemos sin turno previo. Lunes a viernes por la mañana y por la tarde, con atención personalizada.",
    ctaLabel: "Ver horarios",
    ctaTo: "/nosotros",
    image: "/banners/banner2.jpg",
  },
  {
    id: 3,
    title: "Portal de pacientes",
    desc: "Consultá tus resultados de laboratorio de forma segura usando tu DNI o número de protocolo.",
    ctaLabel: "Ingresar al portal",
    ctaTo: "/pacientes/portal",
    image: "/banners/banner3.jpg",
  },
  {
    id: 4,
    title: "Resultados confiables y validados",
    desc: "Los estudios atraviesan distintas etapas hasta ser validados y entregados con respaldo profesional.",
    ctaLabel: "Cómo entregamos resultados",
    ctaTo: "/pacientes/preguntas",
    image: "/banners/banner4.jpg",
  },
  {
    id: 5,
    title: "Equipo profesional",
    desc: "Bioquímicos, técnicas y personal capacitado trabajan cada día para cuidar tu salud.",
    ctaLabel: "Conocé nuestro equipo",
    ctaTo: "/nosotros/equipo",
    image: "/banners/banner5.jpg",
  },
]


function CTALink({ to, className, children }) {
  const isExternal = /^https?:\/\//i.test(to || "")
  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

export default function Hero() {
  const [featured, setFeatured] = useState(0) // índice destacado
  const timerRef = useRef(null)
  const reduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      : false

  const next = useCallback(() => {
    setFeatured((i) => (i + 1) % slides.length)
  }, [])

  const start = useCallback(() => {
    if (reduceMotion) return
    clear()
    timerRef.current = setInterval(next, SLIDE_INTERVAL)
  }, [next, reduceMotion])

  const clear = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    start()
    return clear
  }, [start])

  const featuredSlide = slides[featured]
  const sideSlides = slides
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => i !== featured)
    .slice(0, 4) // hasta 4 sub-noticias

  return (
    <section
      className="relative z-10"
      onMouseEnter={clear}
      onMouseLeave={start}
      role="region"
      aria-label="Destacados"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-3">
        {/* Columna izquierda: destacado grande */}
        <article className="relative md:col-span-2 h-[55vh] md:h-[60vh] overflow-hidden rounded-xl">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === featured ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex h-full items-end p-6 md:p-10">
                <div className="max-w-2xl text-white">
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-white/90 md:text-lg">{s.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <CTALink
                      to={s.ctaTo}
                      className="inline-flex rounded-full bg-[#A63A3A] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#8F2F2F]"
                    >
                      {s.ctaLabel}
                    </CTALink>
                    <CTALink
                      to="/pacientes/preparaciones"
                      className="inline-flex rounded-full border border-white/80 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
                    >
                      Ver preparaciones
                    </CTALink>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </article>


        {/* Columna derecha: sub-noticias en mosaico */}
        <div className="grid grid-cols-2 gap-4">
          {sideSlides.map(({ s, i }) => (
            <button
              key={s.id}
              onClick={() => setFeatured(i)}
              className="group relative h-40 md:h-[28vh] overflow-hidden rounded-xl text-left"
              aria-label={`Ver destacado: ${s.title}`}
            >
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
              <div className="relative z-10 flex h-full items-end p-3">
                <div className="text-white">
                  <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/85 line-clamp-2">{s.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dots de estado (opcional) */}
      <div className="mt-2 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setFeatured(i)}
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={i === featured}
            className={[
              "h-2.5 rounded-full transition-all",
              i === featured ? "w-8 bg-black/70" : "w-5 bg-black/30 hover:bg-black/50",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  )
}
