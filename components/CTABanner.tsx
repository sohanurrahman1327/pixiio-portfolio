'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Reorder } from 'framer-motion';
import { useState } from 'react';

const serviceChips = [
  { id: 1, label: 'Pay as you Go', color: 'bg-cyan-400' },
  { id: 2, label: 'eCOMMERCEDEV', color: 'bg-purple-400' },
  { id: 3, label: 'Figma to Webflow', color: 'bg-purple-500' },
  { id: 4, label: 'Web Animation', color: 'bg-white' },
  { id: 5, label: 'Migration', color: 'bg-lime-400' },
  { id: 6, label: 'Motion Design', color: 'bg-lime-400' },
  { id: 7, label: 'White Label', color: 'bg-cyan-300' },
  { id: 8, label: 'Webflow Development', color: 'bg-cyan-400' },
  { id: 9, label: 'Integration', color: 'bg-pink-400' },
  { id: 10, label: 'WordPress to Webflow', color: 'bg-purple-500' },
  { id: 11, label: 'UI/UX Design', color: 'bg-lime-400' },
  { id: 12, label: 'SaaS', color: 'bg-gray-300' },
  { id: 13, label: 'Webflow Library', color: 'bg-purple-400' },
];

/* ─── Animated button ─── */
function AnimatedButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
}) {
  if (variant === 'primary') {
    return (
      <Link
        href={href}
        className="group inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-[0.12em] uppercase pl-2 pr-7 py-2 rounded-full hover:bg-primary-dark transition-colors overflow-hidden"
      >
        <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 bg-white text-[#0f1a3d] text-[13px] font-bold tracking-[0.12em] uppercase pl-6 pr-2 py-2 rounded-full border border-gray-200 hover:border-primary transition-colors overflow-hidden"
    >
      {children}
      <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 group-hover:border-primary shrink-0 overflow-hidden transition-colors">
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#0f1a3d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#5b5fef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

/* ─── Trusted badge ─── */
function TrustedBadge() {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f1a3d] overflow-hidden">
            <Image src={`/image-0${i}.jpg`} alt={`Client ${i}`} width={40} height={40} className="object-cover w-full h-full" />
          </div>
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-[#0f1a3d] bg-primary flex items-center justify-center text-white text-[10px] font-bold">
          +10
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">Since 2025</p>
        <p className="text-sm text-gray-300">Trusted by 10+ Successful Clients.</p>
      </div>
    </div>
  );
}

export default function CTABanner() {
  const [chips, setChips] = useState(serviceChips);

  return (
    <section className="bg-[#0f1a3d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col justify-center items-center text-center py-20">
          <TrustedBadge />

          <h1 className="font-display text-[clamp(3.8rem,7.5vw,6.5rem)] leading-[0.92] tracking-wide text-white mb-6">
            READY TO BUILD
            <br />
            YOUR NEXT{' '}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              DIGITAL PRODUCT?
            </span>
          </h1>

          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto mb-8">
            We help ambitious brands launch websites, landing pages, SaaS products & digital
            experiences that generate measurable business growth.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <AnimatedButton href="/contact" variant="primary">
              BOOK A DISCOVERY CALL
            </AnimatedButton>
            <AnimatedButton href="/work" variant="outline">
              VIEW WORK
            </AnimatedButton>
          </div>

          {/* Service Chips - Draggable */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <Reorder.Group
              axis="x"
              values={chips}
              onReorder={setChips}
              className="flex flex-wrap gap-3 justify-center"
            >
              {chips.map((chip) => (
                <Reorder.Item
                  key={chip.id}
                  value={chip}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    drag
                    dragElastic={0.2}
                    dragTransition={{ power: 0.3, restDelta: 0.001 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileDrag={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className={`${chip.color} px-4 py-2 rounded-full font-bold text-sm md:text-base tracking-wide ${
                      chip.color === 'bg-white'
                        ? 'text-[#0f1a3d]'
                        : 'text-[#0f1a3d]'
                    } whitespace-nowrap`}
                  >
                    {chip.label}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
