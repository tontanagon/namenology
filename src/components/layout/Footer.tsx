"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  X,
  Orbit,
} from "lucide-react";

interface FooterProps {
  variant?: "default" | "cosmic";
}

interface ModalItem {
  groupTitle: string;
  title: string;
  body: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ variant = "default" }) => {
  const isCosmic = variant === "cosmic";
  const [activeModal, setActiveModal] = useState<ModalItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  // Handle smooth scroll to section if on current page
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* =========================================================================
     GROUP 1: ALL ABOUT NAMENOLOGY ITEMS
     ========================================================================= */
  const c1Items = [
    {
      title: "The History of Namenology",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The science of names traces back thousands of years across ancient civilizations — from the numerical astronomy of Chaldea and Babylonia to the sacred phonetic traditions of the Vedas and Pythagorean harmonic theory.
          </p>
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
            <h5 className="font-semibold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider mb-1">
              Ancient Vibrational Roots
            </h5>
            <p className="text-xs text-blue-800/90 dark:text-blue-300/90">
              Ancient scholars discovered that vocal sounds are not merely arbitrary letters, but active frequencies that interact with the human mind, emotions, and life trajectory. Ancient numerological systems were employed by prominent leaders and dynasties to calibrate official names.
            </p>
          </div>
          <p>
            <strong>NAMENOLOGY</strong> transforms these classical principles into a deterministic modern science. By coupling ancient numerical matrices with Unicode phonetic standards and computational linguistics, Namenology analyzes identity not through superstition or subjective intuition, but through reproducible mathematical harmonics.
          </p>
        </div>
      ),
    },
    {
      title: "The Relationship Between Planets, Numbers & Names",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            In astronomical and vibrational harmonics, each single digit (1 to 9) corresponds directly to the electromagnetic and gravitational vectors of celestial bodies:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">1 — The Sun (Surya):</span> Leadership, executive authority, vitality, confidence.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">2 — The Moon (Chandra):</span> Fluidity, intuition, emotional depth, diplomacy.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">3 — Jupiter (Guru):</span> Wisdom, strategic vision, ethics, intellectual growth.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">4 — Rahu (North Node):</span> Unconventional intellect, innovation, disruptive momentum.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">5 — Mercury (Budha):</span> Communication, commercial acumen, linguistic agility.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">6 — Venus (Shukra):</span> Charisma, aesthetics, luxury, harmony, attraction.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">7 — Ketu (South Node):</span> Research, spiritual depth, analytical insight, introspection.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-blue-600 dark:text-blue-400">8 — Saturn (Shani):</span> Discipline, perseverance, institutional structure, endurance.
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 sm:col-span-2">
              <span className="font-bold text-blue-600 dark:text-blue-400">9 — Mars (Mangala):</span> Pioneering drive, courage, decisive action, leadership.
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            When a name is vocalized, its acoustic frequency activates energetic resonance patterns aligned with the celestial governors of those numbers.
          </p>
        </div>
      ),
    },
    {
      title: "How Letters Are Converted into Numbers",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Every letter in human phonetic language carries a distinct acoustic frequency. NAMENOLOGY utilizes deterministic Unicode decomposition calibrated to standard phonetic vibrational matrices.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
            <h5 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Deterministic Conversion Framework
            </h5>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <li>• <strong>English Letters:</strong> Converted via acoustic vibrational groupings (A, I, J, Q, Y = 1; B, K, R = 2; C, G, L, S = 3; D, M, T = 4; E, H, N, X = 5; U, V, W = 6; O, Z = 7; F, P = 8).</li>
              <li>• <strong>Thai Alphabet:</strong> Every consonant, vowel, and tone mark is indexed according to its native articulatory vocal acoustic base with zero omission.</li>
              <li>• <strong>Deterministic Standard:</strong> 100% computational execution without human calculation error or subjective guesswork.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "How Names Are Combined into Numbers",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            A person’s energetic signature is decoded through three primary computational pillars:
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20">
              <strong className="text-indigo-900 dark:text-indigo-300 block mb-1">First Name Value</strong>
              Reflects inner drive, personal soul vibration, innate behavioral traits, and everyday self-expression.
            </div>
            <div className="p-3 rounded-lg border border-purple-100 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20">
              <strong className="text-purple-900 dark:text-purple-300 block mb-1">Surname / Family Name Value</strong>
              Reflects lineage heritage, genetic foundation, familial support, and inherited societal backing.
            </div>
            <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20">
              <strong className="text-blue-900 dark:text-blue-300 block mb-1">Combined Synergy Score</strong>
              Synthesizes both names to define life trajectory, harmonic resonance, and effortless momentum toward goals.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Positive & Negative Influences of Numbers",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Compound numbers (ranging from 10 to 100) are classified into distinct vibrational brackets based on their harmonic influence:
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                Auspicious Harmonic Numbers
              </span>
              <p className="text-emerald-700 dark:text-emerald-400">
                Examples: 14, 15, 19, 24, 36, 41, 45, 50, 54, 59, 63, 65 — Projecting high intellect, executive capability, mentorship support, fluid financial prosperity, and enduring achievement.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                Specialized Resonance Numbers
              </span>
              <p className="text-amber-700 dark:text-amber-400">
                Examples: 22, 28, 38, 52 — Catalysts for specialized professions requiring decisive judgment, international ventures, or high-stakes leadership.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
              <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">
                Friction & Challenge Numbers
              </span>
              <p className="text-rose-700 dark:text-rose-400">
                Examples: 13, 18, 27, 29, 31, 33, 43, 48, 67, 76 — Generating recurring fluctuations, heightened stress, or obstacles unless consciously harmonized.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Miracle of Numbers",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Mathematics is the universal language of reality. From the Fibonacci sequence in nature and the helical structure of human DNA to the precise frequencies of musical octaves, numbers dictate form, resonance, and momentum.
          </p>
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <h5 className="font-semibold text-xs text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
              Harmonic Synchronization
            </h5>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Your name is not merely an arbitrary tag; it is an acoustic mantra spoken thousands of times throughout your life. When the numerical vibrations of your name synchronize with universal harmonic laws, friction diminishes, opportunities align, and latent potential is unlocked.
            </p>
          </div>
        </div>
      ),
    },
  ];

  /* =========================================================================
     GROUP 2: EXPLORE NAMENOLOGY ITEMS
     ========================================================================= */
  const c2Items = [
    {
      title: "HOW NAMENOLOGY WORKS",
      isAnchor: true,
      href: "/#how-namenology-works",
      targetId: "how-namenology-works",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            NAMENOLOGY operates through a deterministic 5-stage computational pipeline:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-xs">
            <li><strong>Unicode Script Normalization:</strong> Decomposing Thai and English characters into clean linguistic components.</li>
            <li><strong>Acoustic Conversion:</strong> Transforming letters and vowels into deterministic numerical base units.</li>
            <li><strong>Planetary Alignment:</strong> Mapping numerical chords to celestial electromagnetic vectors.</li>
            <li><strong>Synergy Synthesis:</strong> Calculating interaction harmony between First Name and Surname.</li>
            <li><strong>Destiny Dossier Generation:</strong> Producing actionable career, wellness, and relationship guidance.</li>
          </ol>
        </div>
      ),
    },
    {
      title: "WHAT IS NAMENOLOGY",
      isAnchor: true,
      href: "/#what-is-namenology",
      targetId: "what-is-namenology",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            NAMENOLOGY is the deterministic science of name vibrational frequencies. It decodes personal and business identities using mathematical harmonics, acoustic phonetics, and planetary resonances.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            It replaces superstitious fortune-telling with transparent mathematical algorithms, ensuring 100% reproducible results for every analysis.
          </p>
        </div>
      ),
    },
    {
      title: "WHY NAMENOLOGY IS DIFFERENT",
      isAnchor: true,
      href: "/#why-different",
      targetId: "why-different",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Traditional naming systems rely on arbitrary birth-date charts and vague guesswork. NAMENOLOGY stands apart by evaluating the active spoken name as a living vibrational frequency.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <li>Zero superstition — 100% reproducible computational mathematics.</li>
            <li>Stateless, privacy-first processing — your name data is never sold or retained.</li>
            <li>Comprehensive compound synergy analysis covering both First Name and Surname.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "WHO IS NAMENOLOGY FOR",
      isAnchor: false,
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            NAMENOLOGY is engineered for anyone seeking scientific clarity into the vibrational power of their identity:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <strong className="block text-slate-900 dark:text-white mb-1">Leaders & Executives</strong>
              Align your official name with executive authority, clear vision, and commercial momentum.
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <strong className="block text-slate-900 dark:text-white mb-1">Founders & Entrepreneurs</strong>
              Name businesses, products, and brand identities with maximum resonance and market appeal.
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <strong className="block text-slate-900 dark:text-white mb-1">Parents of Newborns</strong>
              Bestow an auspicious, harmonious name that sets an empowering life path foundation.
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <strong className="block text-slate-900 dark:text-white mb-1">Individuals at Crossroads</strong>
              Understand whether recurring life friction stems from conflicting phonetic compound numbers.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "WHEN DID NAMENOLOGY BEGIN",
      isAnchor: false,
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            The foundational principles of name harmonics originated in ancient Mediterranean, Babylonian, and Vedic scholarship over 2,500 years ago.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            The contemporary deterministic discipline of <strong>NAMENOLOGY</strong> was architected over the past decade, combining ancient numerical manuscripts with modern Unicode NFC digital signal processing and computational linguistics to create the world's most accurate name analysis matrix.
          </p>
        </div>
      ),
    },
    {
      title: "WHERE DID NAMENOLOGY BEGIN",
      isAnchor: false,
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            NAMENOLOGY began at the intersection of classical Asian phonetic sciences and Western mathematical harmonic theory.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Developed by an international collective of linguists, software architects, and astronomical scholars, NAMENOLOGY bridges eastern phonetic mastery with silicon-grade deterministic computation.
          </p>
        </div>
      ),
    },
  ];

  /* =========================================================================
     GROUP 3: LEARN & DISCOVER ITEMS
     ========================================================================= */
  const c3Items = [
    {
      title: "FAQ (Frequently Asked Questions)",
      content: (
        <div className="space-y-3.5 text-sm leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <h6 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
              Is Namenology a form of fortune-telling?
            </h6>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              No. Namenology does not predict supernatural events. It measures mathematical and phonetic vibrational frequencies to explain energetic resonance patterns.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <h6 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
              Do I need to know my exact time of birth?
            </h6>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              No. Unlike birth-chart astrology, Namenology analyzes the active spoken frequency of your name. You only need your official First Name and Surname.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <h6 className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
              Can I analyze both Thai and English names?
            </h6>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Yes! Our engine natively supports full multi-language Unicode decomposition for both English and Thai scripts.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Did You Know",
      content: (
        <div className="space-y-3 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Fascinating empirical facts about the vibrational impact of personal names:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20">
              <strong>Cognitive Brain Activation:</strong> Neurological fMRI studies show that hearing your own name spoken activates distinct functional areas in your brain’s left hemisphere, causing immediate subconscious shifts in attention and emotion.
            </li>
            <li className="p-3 rounded-lg border border-purple-100 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20">
              <strong>Historical Calibrated Naming:</strong> Royal dynasties and prominent merchant houses throughout history systematically calibrated heirs' names to solar harmonic numbers to protect stability.
            </li>
            <li className="p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20">
              <strong>Phonetic Resonance Across Tongues:</strong> Identical vowel sounds across completely different languages carry nearly identical Hertz acoustic resonance peaks.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Have You Ever Wondered",
      content: (
        <div className="space-y-3 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Reflections on the unseen influences shaping your daily trajectory:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              • <strong>Why certain names command instant respect:</strong> The acoustic phonetics of plosive consonants (such as D, B, T) create immediate energetic presence, while open vowels evoke warmth.
            </li>
            <li className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              • <strong>Why changing surnames alters your trajectory:</strong> Adopting a new surname introduces an entirely new foundational compound number, altering your synergistic life path score.
            </li>
            <li className="p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              • <strong>Why recurring obstacles repeat themselves:</strong> If a name contains high-friction compound numbers, it creates subtle recurring resistance patterns until harmonized.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "A Guide to Understanding the Analysis",
      content: (
        <div className="space-y-3.5 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            How to interpret your official NAMENOLOGY Dossier:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10">
              <strong className="text-blue-600 dark:text-blue-400 block">Soul Vector (First Name Sum)</strong>
              Evaluates your internal motivation, authentic personality traits, and interpersonal communication style.
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10">
              <strong className="text-purple-600 dark:text-purple-400 block">Foundation Vector (Surname Sum)</strong>
              Reveals your ancestral support, inherited tendencies, and structural security.
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10">
              <strong className="text-emerald-600 dark:text-emerald-400 block">Synergy Matrix Score (Combined Total)</strong>
              Measures the compatibility between your soul and foundation on a calibrated scale from 0 to 100.
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-white/10">
              <strong className="text-amber-600 dark:text-amber-400 block">Actionable Harmonization</strong>
              Practical advice for capitalizing on favorable life cycles and mitigating friction.
            </div>
          </div>
        </div>
      ),
    },
  ];

  /* =========================================================================
     GROUP 4: LEGAL ITEMS
     ========================================================================= */
  const c4Items = [
    {
      title: "Disclaimer",
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            The mathematical analyses, scores, and destiny dossiers provided by NAMENOLOGY are intended strictly for educational enrichment, self-discovery, and cultural linguistic exploration.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <strong>Important Notice:</strong>
            <p>
              NAMENOLOGY does not provide medical, legal, mental health, or financial advisory services. Decisions regarding legal name changes or major life decisions remain the sole discretion and responsibility of the user.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Privacy Policy",
      content: (
        <div className="space-y-3.5 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            We hold your identity and personal data in the strictest confidence:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Stateless Processing:</strong> Names submitted for public preview analysis are computed in transient memory and never sold to data brokers.
            </li>
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Zero Third-Party Advertising:</strong> We do not sell user data or embed intrusive third-party commercial tracker cookies.
            </li>
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>256-Bit TLS Encryption:</strong> All server transmissions are secured with industry-grade SSL protocols.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Refund Policy",
      content: (
        <div className="space-y-3.5 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Our transparent refund terms ensure fair and transparent transactions:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Unused Credit Bundles:</strong> You may request a 100% refund on unutilized credit packages within 14 days of purchase.
            </li>
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Delivered Dossiers:</strong> Once an instant computational report has been generated and redeemed, the digital delivery is complete and non-refundable.
            </li>
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Technical Errors:</strong> In the unlikely event of system disruption during generation, full credit replenishment will be processed immediately.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Term & Conditions",
      content: (
        <div className="space-y-3.5 text-sm leading-relaxed">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            By accessing or utilizing the NAMENOLOGY platform, you agree to these Terms of Service:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Intellectual Property:</strong> All mathematical formulas, Unicode algorithms, and visual graphic assets are the proprietary intellectual property of NAMENOLOGY.
            </li>
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>Fair Usage Policy:</strong> Automated scraping, botting, or reverse engineering of the analysis API is strictly prohibited.
            </li>
            <li className="p-2.5 rounded-lg border border-slate-200 dark:border-white/10">
              • <strong>User Accounts:</strong> Account holders are responsible for maintaining the confidentiality of their credentials and generated dossiers.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      <footer
        className={`border-t transition-colors duration-300 relative overflow-hidden ${isCosmic
            ? "border-white/10 bg-[#040612] text-slate-400"
            : "border-slate-200/80 bg-[#F8FAFD] text-slate-600"
          }`}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          {/* ================================================================= */}
          {/* TOP BRAND & TRUST HEADER BAR                                      */}
          {/* ================================================================= */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 mb-12 border-b border-slate-200/70 dark:border-white/10">
            {/* Brand Logo & Tagline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                {/* Orbital logo mark */}
                <svg viewBox="0 0 28 28" fill="none" className="w-8 h-8">
                  <circle cx="14" cy="14" r="12" stroke="url(#ft-grad-z)" strokeWidth="1" opacity="0.4" />
                  <circle cx="14" cy="14" r="8" stroke="url(#ft-grad-z)" strokeWidth="1.2" opacity="0.6" />
                  <circle cx="14" cy="14" r="4.5" fill="url(#ft-grad-z)" opacity="0.9" />
                  <circle cx="14" cy="14" r="1.5" fill="white" opacity="0.8" />
                  <defs>
                    <linearGradient id="ft-grad-z" x1="0" y1="0" x2="28" y2="28">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex items-baseline">
                  <span className={`text-xl font-black font-outfit tracking-tight ${isCosmic ? "text-white" : "text-blue-600"}`}>
                    NAME
                  </span>
                  <span className={`text-xl font-black font-outfit tracking-tight ${isCosmic ? "gradient-text-cosmic-bright" : "gradient-text-brand"}`}>
                    NOLOGY
                  </span>
                </div>
              </div>
              <p className={`text-xs max-w-xl leading-relaxed ${isCosmic ? "text-slate-400" : "text-slate-600"}`}>
                The Science of Name. The Power of Destiny. Deterministic mathematical harmonics and phonetic intelligence for leaders and individuals worldwide.
              </p>
            </div>

            {/* Trust Badges */}
            {/* <div className="flex flex-wrap items-center gap-3 text-xs">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium ${
                  isCosmic
                    ? "bg-white/5 border-white/10 text-slate-300"
                    : "bg-white border-slate-200 text-slate-700 shadow-2xs"
                }`}
              >
                <Orbit className="w-3.5 h-3.5 text-blue-500" />
                <span>Deterministic Solar Science</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium ${
                  isCosmic
                    ? "bg-white/5 border-white/10 text-slate-300"
                    : "bg-white border-slate-200 text-slate-700 shadow-2xs"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-500" />
                <span>Unicode NFC Compliant</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium ${
                  isCosmic
                    ? "bg-white/5 border-white/10 text-slate-300"
                    : "bg-white border-slate-200 text-slate-700 shadow-2xs"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Stateless & Encrypted</span>
              </div>
            </div> */}
          </div>

          {/* ================================================================= */}
          {/* 4 COLUMNS (LEFT TO RIGHT)                                         */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-16">
            {/* --------------------------------------------------------------- */}
            {/* Group 1: All About Namenology                                   */}
            {/* --------------------------------------------------------------- */}
            <div className="space-y-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-slate-900"}`}>
                All About Namenology
              </h4>

              <ul className="space-y-2.5 text-xs">
                {c1Items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          groupTitle: "All About Namenology",
                          title: item.title,
                          body: item.content,
                        })
                      }
                      className={`cursor-pointer transition-colors text-left block w-full ${isCosmic
                          ? "text-slate-400 hover:text-cyan-300"
                          : "text-slate-600 hover:text-blue-600"
                        }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* Group 2: Explore Namenology                                     */}
            {/* --------------------------------------------------------------- */}
            <div className="space-y-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-slate-900"}`}>
                Explore Namenology
              </h4>

              <ul className="space-y-2.5 text-xs">
                {c2Items.map((item, idx) => (
                  <li key={idx}>
                    {item.isAnchor && item.href ? (
                      <Link
                        href={item.href}
                        onClick={(e) => item.targetId && handleScrollTo(e, item.targetId)}
                        className={`cursor-pointer transition-colors block text-left ${isCosmic
                            ? "text-slate-400 hover:text-cyan-300"
                            : "text-slate-600 hover:text-blue-600"
                          }`}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveModal({
                            groupTitle: "Explore Namenology",
                            title: item.title,
                            body: item.content,
                          })
                        }
                        className={`cursor-pointer transition-colors text-left block w-full ${isCosmic
                            ? "text-slate-400 hover:text-cyan-300"
                            : "text-slate-600 hover:text-blue-600"
                          }`}
                      >
                        {item.title}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* Group 3: Learn & Discover                                       */}
            {/* --------------------------------------------------------------- */}
            <div className="space-y-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-slate-900"}`}>
                Learn & Discover
              </h4>

              <ul className="space-y-2.5 text-xs">
                {c3Items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          groupTitle: "Learn & Discover",
                          title: item.title,
                          body: item.content,
                        })
                      }
                      className={`cursor-pointer transition-colors text-left block w-full ${isCosmic
                          ? "text-slate-400 hover:text-cyan-300"
                          : "text-slate-600 hover:text-blue-600"
                        }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* Group 4: Legal                                                  */}
            {/* --------------------------------------------------------------- */}
            <div className="space-y-4">
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-slate-900"}`}>
                Legal
              </h4>

              <ul className="space-y-2.5 text-xs">
                {c4Items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal({
                          groupTitle: "Legal",
                          title: item.title,
                          body: item.content,
                        })
                      }
                      className={`cursor-pointer transition-colors text-left block w-full ${isCosmic
                          ? "text-slate-400 hover:text-cyan-300"
                          : "text-slate-600 hover:text-blue-600"
                        }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================================================================= */}
          {/* BOTTOM BAR: COPYRIGHT & RESILIENCE BADGE                          */}
          {/* ================================================================= */}
          <div
            className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${isCosmic ? "border-white/10 text-slate-500" : "border-slate-200/80 text-slate-500"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p>&copy; {new Date().getFullYear()} NAMENOLOGY. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Deterministic Solar Name Science</span>
              <span>•</span>
              <span>Computational Linguistics Platform</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* INTERACTIVE KNOWLEDGE & LEGAL MODAL DIALOG                          */}
      {/* =================================================================== */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
        >
          {/* Backdrop blur */}
          <div
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-[#0B0F29] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-white/[0.02]">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {activeModal.groupTitle}
                </p>
                <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white leading-snug">
                  {activeModal.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="px-6 py-6 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-200">
              {activeModal.body}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Deterministic Verified Dossier</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
