// =============================================================================
// NUMEROLOGY GROUPS KNOWLEDGE ARCHITECTURE (GROUPS 1 - 9)
// Deterministic scientific profiles, archetypes, characteristics, polarity dynamics,
// and health/illness vulnerability warnings per master numerological traditions.
// =============================================================================

export interface NumerologyGroupArticle {
  groupNumber: number;
  numbers: number[];
  numbersFormatted: string;
  title: string;
  meaningsAndSymbols: string;
  characteristics: string;
  shadowPolarity: string;
  illnesses: string[];
  illnessesFormatted: string;
  number?: number;
  lifeDescription?: string;
  exampleNames?: string;
  category?: string;
}

export const NUMEROLOGY_GROUPS: Record<number, NumerologyGroupArticle> = {
  1: {
    groupNumber: 1,
    numbers: [1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100],
    numbersFormatted: "1, 10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100",
    title: "THE LEADER",
    meaningsAndSymbols:
      "Energy, power, strength, stability, the start, originality, brilliance, creativity.",
    characteristics:
      "The number 1 person is very self-confident, has a sharp intellect, is decisive, a fast learner, steadfast, ambitious and original and they dislike being a subordinate or being forced, taught, nagged at, fussed at or complained at. They are gentle and sympathetic and like helping the weak and needy, with a tendency to take on the problems of others as their own, and they should take care to avoid these problems becoming their own and beware of putting energy into situations which yield only problems with no benefit. They like to talk and teach and are sometimes viewed as grumblers. They hold the concept of honour very seriously and are quick to take offence when affronted.",
    shadowPolarity:
      "When number 1 is connected to a bad number, it will influence one to be hot-tempered, conceited, arrogant, egocentric and to aspire to be remarkable. They may be, aristocratic making displays of wealth in a desire to be distinguished, never accepting inferior status, with an inclination to despise or look down upon others, a respectable and distasteful person at the same time.",
    illnesses: [
      "Blood circulation disorders",
      "Heart disease and cardiac stress",
      "Visual sickness and eye strain",
      "Spinal cord and hip pain",
    ],
    illnessesFormatted:
      "Sickness concerning blood circulation, heart disease, visual sickness, spinal cord and hip pain.",
  },
  2: {
    groupNumber: 2,
    numbers: [2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92],
    numbersFormatted: "2, 11, 20, 29, 38, 47, 56, 65, 74, 83, 92",
    title: "THE DIPLOMAT & MEDIATOR",
    meaningsAndSymbols:
      "Harmony, intuition, diplomacy, gentle persuasion, partnership, balance, emotional sensitivity, adaptability.",
    characteristics:
      "The number 2 person possesses remarkable emotional sensitivity, high intuition, and a gentle, cooperative disposition. They excel in mediation, finding common ground where others see irreconcilable division, and value peaceful collaboration above all else. They are thoughtful listeners, deeply loyal companions, and naturally tactful communicators who abhor cruelty, confrontation, and crude aggression. They thrive when working in supportive partnerships and possess a refined artistic and aesthetic appreciation. However, they must guard against excessive self-doubt, emotional dependency, and the urge to sacrifice their own legitimate boundaries merely to keep external tranquility.",
    shadowPolarity:
      "When number 2 is connected to a bad number, it will influence one to become oversensitive, indecisive, prone to chronic worry, moody, and easily offended by imagined slights. They may become manipulative or passive-aggressive, playing the victim, suffering from paralyzing timidness, or clinging desperately to unfulfilling associations out of fear of isolation.",
    illnesses: [
      "Digestive disturbances and stomach ulcers",
      "Lymphatic congestion and fluid retention",
      "Insomnia and nervous exhaustion",
      "Hormonal imbalances and chronic anxiety",
    ],
    illnessesFormatted:
      "Sickness concerning digestive disturbances, stomach ulcers, lymphatic congestion, insomnia, anxiety disorders, and hormonal imbalances.",
  },
  3: {
    groupNumber: 3,
    numbers: [3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93],
    numbersFormatted: "3, 12, 21, 30, 39, 48, 57, 66, 75, 84, 93",
    title: "THE COMMUNICATOR & CREATOR",
    meaningsAndSymbols:
      "Expression, enthusiasm, charisma, optimism, verbal brilliance, creative expansion, social magnetism, inspiration.",
    characteristics:
      "The number 3 person is vibrant, witty, socially magnetic, and endowed with exceptional communicative flair and creative imagination. They bring joy, optimism, and intellectual spark to any room they enter, learning quickly and expressing complex ideas with effortless charm. They dislike dull routines, monotony, and rigid dogmatism, preferring diverse interactions and dynamic artistic or verbal endeavors. They are generous and uplifting mentors who inspire confidence in others and possess natural theatrical and persuasive gifts.",
    shadowPolarity:
      "When number 3 is connected to a bad number, it will influence one to be scattered, boastful, superficial, gossip-prone, and excessively extravagant. They may squander their abundant gifts on trivial pursuits, suffer from volatile emotional swings, become deeply intolerant of constructive feedback, and constantly seek shallow flattery while avoiding real accountability.",
    illnesses: [
      "Throat and vocal cord inflammation",
      "Respiratory sensitivities and asthma",
      "Nervous system exhaustion",
      "Liver strain and skin eruptions",
    ],
    illnessesFormatted:
      "Sickness concerning throat and vocal cord disorders, respiratory sensitivities, nervous system exhaustion, skin eruptions, and liver or metabolic strains.",
  },
  4: {
    groupNumber: 4,
    numbers: [4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94],
    numbersFormatted: "4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94",
    title: "THE MASTER BUILDER & ARCHITECT",
    meaningsAndSymbols:
      "Order, foundation, practical discipline, systematic logic, perseverance, integrity, structural endurance, stability.",
    characteristics:
      "The number 4 person is grounded, dependable, pragmatic, and possesses an extraordinary capacity for sustained effort and systematic execution. They believe in tangible results achieved through integrity, rigorous logic, and meticulous preparation. They reject get-rich-quick illusions and ungrounded theories, serving as the bedrock of family, organization, or enterprise. They respect honest craftsmanship, exhibit unwavering loyalty to their commitments, and remain unshakeable in times of external crisis.",
    shadowPolarity:
      "When number 4 is connected to a bad number, it will influence one to become stubborn, inflexible, overly dogmatic, narrow-minded, and resentful of innovations. They may become tyrannical micro-managers, excessively frugal to the point of stinginess, cold in emotional exchanges, and prone to exhausting themselves through obsessive, joyless workaholism.",
    illnesses: [
      "Chronic joint stiffness and rheumatism",
      "Dental and skeletal deterioration",
      "Knee, lumbar and spinal compression pain",
      "Physical exhaustion from chronic overexertion",
    ],
    illnessesFormatted:
      "Sickness concerning chronic joint stiffness, rheumatism, dental and skeletal deterioration, knee and lumbar back pain, and physical burnout from overexertion.",
  },
  5: {
    groupNumber: 5,
    numbers: [5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95],
    numbersFormatted: "5, 14, 23, 32, 41, 50, 59, 68, 77, 86, 95",
    title: "THE CATALYST & INNOVATOR",
    meaningsAndSymbols:
      "Versatility, progressive freedom, resourcefulness, rapid adaptability, dynamic exploration, curiosity, courage.",
    characteristics:
      "The number 5 person is quick-minded, adventurous, highly resourceful, and thrives in environments of rapid evolution and diverse opportunities. They possess versatile talents, learn languages and technologies with ease, and communicate across disparate cultural horizons effortlessly. They possess an infectious passion for liberty, reject suffocating restrictions, and boldly pioneer modern solutions before others recognize the need.",
    shadowPolarity:
      "When number 5 is connected to a bad number, it will influence one to be chronically restless, reckless, irresponsible with commitments, and prone to sensory indulgence or dangerous gambles. They may abandon projects at the first sign of difficulty, rebel purely for the sake of defiance, cultivate instability in personal relationships, and waste extraordinary potential on ephemeral thrills.",
    illnesses: [
      "Central nervous system strain and tremors",
      "Adrenal fatigue and chronic sleep disturbances",
      "Erratic digestive and bowel sensitivities",
      "Respiratory challenges and sensory overload",
    ],
    illnessesFormatted:
      "Sickness concerning central nervous system strain, adrenal fatigue, insomnia, sensory overload, erratic digestive function, and stress-induced tremors.",
  },
  6: {
    groupNumber: 6,
    numbers: [6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96],
    numbersFormatted: "6, 15, 24, 33, 42, 51, 60, 69, 78, 87, 96",
    title: "THE GUARDIAN & NURTURER",
    meaningsAndSymbols:
      "Responsibility, unconditional care, aesthetic harmony, domestic sanctuary, protection, balance, compassion, community.",
    characteristics:
      "The number 6 person is deeply responsible, compassionate, fair-minded, and endowed with an innate gift for nurturing people and elevating surroundings. They treat family, community, and service with sacred reverence, often acting as the protective anchor of their circle. They possess an exceptional eye for beauty, proportion, and artistic harmony, providing comfort, hospitality, and wise counsel to those in distress.",
    shadowPolarity:
      "When number 6 is connected to a bad number, it will influence one to become intrusive, self-righteous, overbearing in domestic control, and susceptible to a martyr complex. They may worry obsessively over things beyond their control, demand unreasonable perfectionism from loved ones, and harbor bitter resentment when their unsolicited sacrifices are not endlessly celebrated.",
    illnesses: [
      "Cardiovascular tension and heart palpitation",
      "Throat, vocal cord, and neck inflammation",
      "Lymphatic congestion and fluid retention",
      "Thyroid irregularities and stress eating",
    ],
    illnessesFormatted:
      "Sickness concerning cardiovascular tension, throat and neck inflammation, lymphatic congestion, emotional weight fluctuations, and chronic thyroid or metabolic sensitivities.",
  },
  7: {
    groupNumber: 7,
    numbers: [7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97],
    numbersFormatted: "7, 16, 25, 34, 43, 52, 61, 70, 79, 88, 97",
    title: "THE SEEKER & PHILOSOPHER",
    meaningsAndSymbols:
      "Wisdom, analytical precision, introspection, philosophical depth, spiritual truth, contemplation, intellectual sovereignty.",
    characteristics:
      "The number 7 person possesses a profound, penetrating intellect, an acute faculty for scientific investigation, and an unquenchable thirst for fundamental truth. They are quiet, dignified, observant, and naturally aloof from superficial social chatter, preferring deep contemplation and rigorous study. They recognize patterns that elude the ordinary mind, possess strong intuitive perception, and uphold uncompromising standards of intellectual honesty.",
    shadowPolarity:
      "When number 7 is connected to a bad number, it will influence one to become cynical, misanthropic, emotionally detached, excessively secretive, and paralyzingly hyper-critical. They may retreat into bitter isolation, look down upon the world with sarcastic intellectual arrogance, distrust even those who love them, and suffer from debilitating mental anxiety.",
    illnesses: [
      "Neurological sensitivity and chronic migraines",
      "Psychosomatic gastrointestinal disorders",
      "Severe sleep disturbances and mental burnout",
      "Melancholy and depressive withdrawal",
    ],
    illnessesFormatted:
      "Sickness concerning neurological sensitivity, mental burnout, migraine headaches, psychosomatic digestive disturbances, and chronic insomnia.",
  },
  8: {
    groupNumber: 8,
    numbers: [8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98],
    numbersFormatted: "8, 17, 26, 35, 44, 53, 62, 71, 80, 89, 98",
    title: "THE SOVEREIGN & STRATEGIST",
    meaningsAndSymbols:
      "Executive power, capital mastery, material manifestation, sovereign authority, justice, monumental achievement, resilience.",
    characteristics:
      "The number 8 person is an authoritative, ambitious, and highly disciplined strategist capable of organizing vast resources, commercial enterprises, and complex operations. They understand the laws of cause and effect, respect practical power, and possess immense resilience in overcoming monumental setbacks. They are natural executives who demand excellence, reward competence generously, and strive to erect enduring legacies that outlive themselves.",
    shadowPolarity:
      "When number 8 is connected to a bad number, it will influence one to become ruthless, obsessed with material accumulation, tyrannical in command, and dismissive of moral or human considerations. They may treat relationships as cold financial transactions, suffer from ruinous arrogance, succumb to severe legal and financial reversals, and alienate all allies through unbridled dominance.",
    illnesses: [
      "Hypertension and cardiovascular strain",
      "Liver and gallbladder disorders",
      "Rheumatism and lower spinal compression",
      "Chronic stress-induced vascular headaches",
    ],
    illnessesFormatted:
      "Sickness concerning hypertension, cardiovascular disease, liver and gallbladder disorders, rheumatism, lower spinal compression, and stress-related tension.",
  },
  9: {
    groupNumber: 9,
    numbers: [9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99],
    numbersFormatted: "9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99",
    title: "THE HUMANITARIAN & SAGE",
    meaningsAndSymbols:
      "Universal compassion, completion, civilizational impact, artistic transcendence, philanthropy, global vision, forgiveness.",
    characteristics:
      "The number 9 person is expansive, charismatic, noble-minded, and driven by a genuine passion to elevate humanity and champion righteous causes. They possess a global outlook that transcends ethnic and national boundaries, naturally inspiring devotion through their generosity and moral courage. They are creative, intuitive mentors who see the divine spark in all people and strive to leave the world markedly more just and enlightened than they found it.",
    shadowPolarity:
      "When number 9 is connected to a bad number, it will influence one to become temperamental, overly dramatic, intolerant of dissent, and lost in impractical utopian fantasies. They may swing between intense emotional passions and cold bitterness, harbor deep grudges while preaching universal love, and waste energy on destructive crusades that damage themselves and their dependents.",
    illnesses: [
      "Autoimmune disorders and chronic systemic inflammation",
      "Pulmonary and bronchial sensitivities",
      "Kidney and urinary tract strain",
      "Nervous exhaustion from chronic altruistic stress",
    ],
    illnessesFormatted:
      "Sickness concerning autoimmune vulnerabilities, respiratory sensitivity, chronic inflammation, kidney and urinary tract stress, and nervous exhaustion.",
  },
};

/**
 * Derives a root single digit (1-9) from any compound number using recursive digit summation.
 */
export function reduceToRootNumber(num: number): number {
  if (!num || num <= 0) return 1;
  const digits = num.toString().split("").map(Number);
  const sum = digits.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
  if (sum > 9) {
    return reduceToRootNumber(sum);
  }
  return sum;
}

import { getNumerologyMeaningByNumber } from "./numerology-meanings";

/**
 * Returns the Numerology Group Article corresponding to any total compound number (1-100) or root number (1-9).
 * If a compound number between 1 and 100 is provided, returns the specific number's article,
 * life predictions, and health vulnerabilities.
 */
export function getNumerologyGroup(numberOrRoot: number): NumerologyGroupArticle {
  const root = reduceToRootNumber(numberOrRoot);
  const baseGroup = NUMEROLOGY_GROUPS[root] || NUMEROLOGY_GROUPS[1];

  if (numberOrRoot && numberOrRoot >= 1 && numberOrRoot <= 100) {
    const meaning = getNumerologyMeaningByNumber(numberOrRoot);
    if (meaning) {
      return {
        groupNumber: meaning.groupNumber,
        numbers: baseGroup.numbers,
        numbersFormatted: baseGroup.numbersFormatted,
        title: meaning.title,
        meaningsAndSymbols:
          meaning.meaningsAndSymbols || baseGroup.meaningsAndSymbols,
        characteristics:
          meaning.groupCharacteristics || baseGroup.characteristics,
        shadowPolarity:
          meaning.shadowPolarity || baseGroup.shadowPolarity,
        illnesses: meaning.illnesses
          ? [meaning.illnesses]
          : baseGroup.illnesses,
        illnessesFormatted:
          meaning.illnesses || baseGroup.illnessesFormatted,
        number: meaning.number,
        lifeDescription: meaning.lifeDescription,
        exampleNames: meaning.exampleNames,
        category: meaning.category,
      };
    }
  }

  return baseGroup;
}

