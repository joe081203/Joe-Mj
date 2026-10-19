import React, { useState, useEffect, useRef } from 'react';
import { HERO_SLIDES } from '../data/products';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowDown } from 'lucide-react';

interface HeroCarouselProps {
  onShopClick: () => void;
  onNFTClick: () => void;
  onStoryClick: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onShopClick,
  onNFTClick,
  onStoryClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt parallax for 3D backdrop and text
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Autoplay timer
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  const handleCtaClick = () => {
    if (activeSlide.ctaAction === 'shop') onShopClick();
    else if (activeSlide.ctaAction === 'nft') onNFTClick();
    else if (activeSlide.ctaAction === 'story') onStoryClick();
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen min-h-[640px] max-h-[1040px] overflow-hidden bg-[#070b12] text-white select-none perspective-1000 flex items-center"
      aria-label="Hero Showcase"
    >
      {/* 3D Parallax Backdrop Images */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        const transform = isActive
          ? `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0) scale(1.06) rotateX(${
              -mousePos.y * 2.5
            }deg) rotateY(${mousePos.x * 2.5}deg)`
          : 'scale(1.0)';

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out will-change-opacity ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Image layer */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
              style={{ transform }}
            >
              <img
                src={slide.bgImage}
                alt={slide.heading}
                className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.04]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Clean minimal lighting scrim: dark vignette with crisp contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/40 to-[#070b12]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b12]/80 via-transparent to-[#070b12]/40" />
          </div>
        );
      })}

      {/* Hero Content Stage */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 flex flex-col justify-center">
        <div
          className="max-w-2xl transform-style-3d transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 20px)`,
          }}
        >
          {/* Minimal Kicker (Clean unboxed metadata) */}
          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.25em] text-sky-400 mb-5">
            <span className="w-6 h-px bg-sky-400/80" />
            <span>{activeSlide.kicker}</span>
          </div>

          {/* Minimalist Headline / Quote */}
          {activeSlide.quote ? (
            <div className="mb-5">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light font-display tracking-tight text-white leading-[1.1]">
                “{activeSlide.quote.split(', ')[0] ? activeSlide.quote.split(', ')[0] + ',' : activeSlide.quote}”
                {activeSlide.quote.includes(', ') && (
                  <span className="block font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-white">
                    {activeSlide.quote.split(', ')[1]}
                  </span>
                )}
              </h1>
            </div>
          ) : (
            /* Slide 1: 3D Minimal Hero Title */
            <div className="mb-5">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-[0.95]">
                CONSCIOUS
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-white">
                  FIRE.
                </span>
              </h1>
            </div>
          )}

          {/* Short, Poetic Body Copy */}
          <p className="text-sm sm:text-base text-slate-300/90 font-light leading-relaxed max-w-lg mb-8">
            {activeSlide.description}
          </p>

          {/* Single Minimal Primary Action */}
          <div>
            <button
              onClick={handleCtaClick}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide bg-white/10 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md border border-white/20 hover:border-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/20"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-sky-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Indicators & Controls */}
      <div className="absolute z-30 bottom-10 inset-x-0 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-end justify-between pointer-events-none">
        
        {/* Minimal Numerical Slide Progress */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className="group py-2 cursor-pointer focus:outline-none"
              >
                <div
                  className={`h-0.5 transition-all duration-500 rounded-full ${
                    idx === currentSlide
                      ? 'w-10 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                      : 'w-4 bg-white/30 group-hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-mono tracking-widest text-slate-400">
            0{currentSlide + 1} / 0{HERO_SLIDES.length}
          </span>
        </div>

        {/* Minimal Scroll Prompt */}
        <button
          onClick={onShopClick}
          className="hidden md:flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-slate-400 hover:text-white transition-colors pointer-events-auto cursor-pointer"
        >
          <span>SCROLL</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-sky-400" />
        </button>

        {/* Minimal Prev / Next Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-2.5 rounded-full border border-white/10 hover:border-white/40 text-slate-300 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-2.5 rounded-full border border-white/10 hover:border-white/40 text-slate-300 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-xs transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
