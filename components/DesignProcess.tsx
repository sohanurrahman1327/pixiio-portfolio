"use client";

import Image from "next/image";
import { designProcessSteps } from "@/lib/images";
import { useState, useEffect, useRef } from "react";

export default function DesignProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Auto-play progression
  useEffect(() => {
    if (!isAutoPlay) return;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((prev) => (prev + 1) % designProcessSteps.length);
          return 0;
        }
        return prev + (100 / 30); // 3 seconds total
      });
    }, 100);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isAutoPlay]);

  // Scroll animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScrolled) {
          setHasScrolled(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasScrolled]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const handleStepHover = (index: number) => {
    setActiveStep(index);
    setProgress(0);
    setIsAutoPlay(false);
  };

  return (
    <section id="process" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold tracking-[0.25em] text-primary mb-3">
            DESIGN PROCESS
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-gray-900 tracking-wide">
            INNOVATIVE PROCESS
          </h2>
        </div>

        {/* Main Layout */}
        <div ref={containerRef} className="hidden lg:grid lg:grid-cols-2 gap-12">
          {/* Left Side - Steps */}
          <div className="space-y-0">
            {designProcessSteps.map((step, index) => {
              const isActive = activeStep === index;
              const staggerDelay = hasScrolled ? index * 0.1 : 0;

              return (
                <div
                  key={step.step}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => handleStepHover(index)}
                  onClick={() => handleStepClick(index)}
                >
                  {/* Step Label and Title Row */}
                  <div className="flex items-start gap-3 mb-6">
                    {/* Dot */}
                    <span className={`w-2 h-2 rounded-full transition-colors duration-500 flex-shrink-0 mt-1 ${
                      isActive ? "bg-primary" : "bg-primary/50"
                    }`} />
                    
                    {/* Step Label - Fixed Position */}
                    <span
                      className={`text-xs font-bold tracking-[0.15em] transition-colors duration-500 flex-shrink-0 mt-1 ${
                        isActive ? "text-primary" : "text-primary/50"
                      }`}
                    >
                      STEP {step.step}
                    </span>

                    {/* Step Title - Animated */}
                    <div
                      className="transition-all duration-700 ease-out"
                      style={{
                        transform: hasScrolled
                          ? `translateX(${index * 60}px)`
                          : "translateX(0)",
                        transitionDelay: `${staggerDelay}s`,
                      }}
                    >
                      <h3 className={`font-display text-4xl md:text-5xl tracking-wide whitespace-nowrap transition-colors duration-500 leading-tight ${
                        isActive ? "text-primary" : "text-gray-900"
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Horizontal Line - Dotted, Fill on Active */}
                  <div className="relative h-px mb-8 overflow-hidden">
                    {/* Dotted line background */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "repeating-linear-gradient(90deg, #D1D5DB 0px, #D1D5DB 2px, transparent 2px, transparent 8px)",
                      }}
                    />
                    
                    {/* Fill animation for active state */}
                    {isActive && (
                      <div
                        className="absolute inset-y-0 left-0 transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundImage: "repeating-linear-gradient(90deg, #5B5FEF 0px, #5B5FEF 2px, transparent 2px, transparent 8px)",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Image Preview */}
          <div className="relative flex justify-end">
            <div className="relative w-full max-w-[400px]" style={{ height: 'calc(100% - 0px)' }}>
              {designProcessSteps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <div
                    key={step.step}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                      top: 0,
                      right: 0,
                      left: 'auto',
                      bottom: 'auto',
                    }}
                  >
                    <div
                      className="relative w-full overflow-hidden rounded-lg"
                      style={{
                        clipPath: isActive
                          ? "inset(0% 0% 0% 0%)"
                          : "inset(100% 0% 0% 0%)",
                        transition: "clip-path 0.8s ease-out",
                        height: '100%',
                      }}
                    >
                      <Image
                        src={step.image}
                        alt={step.alt}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {designProcessSteps.map((step) => (
            <article
              key={step.step}
              className="group rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <figure className="relative overflow-hidden aspect-[4/3]">
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={400}
                  height={500}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary text-white font-display text-lg flex items-center justify-center">
                  {step.step}
                </span>
              </figure>
              <div className="p-6">
                <h3 className="font-display text-lg text-gray-900 tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
