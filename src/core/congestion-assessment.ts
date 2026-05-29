import { CongestionLevel } from '../types';

/**
 * Congestion Assessment Tool
 * Guided questionnaire for objective congestion level determination
 */

export interface CongestionQuestion {
  id: string;
  question: string;
  type: 'number' | 'select';
  options?: string[];
  thresholds: Array<{ value: number | string; rating: CongestionLevel }>;
}

const congestionQuestions: CongestionQuestion[] = [
  {
    id: 'pipe_density',
    question: 'Berapa banyak pipa per meter persegi luas area?',
    type: 'number',
    thresholds: [
      { value: 0.5, rating: 'low' },
      { value: 2.0, rating: 'medium' },
      { value: Infinity, rating: 'high' }
    ]
  },
  {
    id: 'equipment_density',
    question: 'Berapa persen volume yang terisi oleh equipment (volumetric ratio equipment/area)?',
    type: 'number',
    thresholds: [
      { value: 10, rating: 'low' },
      { value: 30, rating: 'medium' },
      { value: Infinity, rating: 'high' }
    ]
  },
  {
    id: 'obstacle_spacing',
    question: 'Berapa jarak rata-rata antar obstacle (meter)?',
    type: 'number',
    thresholds: [
      { value: 10, rating: 'low' },
      { value: 3, rating: 'medium' },
      { value: Infinity, rating: 'high' }
    ]
  },
  {
    id: 'obstacle_layers',
    question: 'Berapa banyak lapisan obstacle dalam jalur flame?',
    type: 'number',
    thresholds: [
      { value: 1, rating: 'low' },
      { value: 3, rating: 'medium' },
      { value: Infinity, rating: 'high' }
    ]
  },
  {
    id: 'confined_volumes',
    question: 'Apakah ada volume terconfine (gedung, culverts, dll)?',
    type: 'select',
    options: ['Tidak ada', 'Sebagian', 'Sepenuhnya terenclose'],
    thresholds: [
      { value: 'Tidak ada', rating: 'low' },
      { value: 'Sebagian', rating: 'medium' },
      { value: 'Sepenuhnya terenclose', rating: 'high' }
    ]
  }
];

/**
 * Get rating from value based on thresholds
 */
function getRatingFromValue(value: number | string, thresholds: Array<{ value: number | string; rating: CongestionLevel }>): CongestionLevel {
  if (typeof value === 'string') {
    const match = thresholds.find(t => t.value === value);
    return match?.rating || 'medium';
  }

  for (const threshold of thresholds) {
    if (value <= (threshold.value as number)) {
      return threshold.rating;
    }
  }
  return 'medium';
}

/**
 * Calculate overall congestion rating
 */
export function assessCongestion(responses: Record<string, number | string>): {
  ratings: Record<string, { value: number | string; rating: CongestionLevel }>;
  overallRating: CongestionLevel;
  confidence: 'high' | 'medium' | 'low';
  justification: string;
} {
  const ratings: Record<string, { value: number | string; rating: CongestionLevel }> = {};
  const ratingValues: number[] = [];

  // Process each question
  for (const question of congestionQuestions) {
    const value = responses[question.id];
    if (value === undefined) continue;

    const rating = getRatingFromValue(value, question.thresholds);
    ratings[question.id] = { value, rating };

    // Convert rating to number for averaging
    if (rating === 'low') ratingValues.push(1);
    else if (rating === 'medium') ratingValues.push(2);
    else if (rating === 'high') ratingValues.push(3);
  }

  // Calculate overall rating
  const avgRating = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;
  let overallRating: CongestionLevel;
  if (avgRating < 1.5) overallRating = 'low';
  else if (avgRating < 2.5) overallRating = 'medium';
  else overallRating = 'high';

  // Determine confidence based on answer consistency
  const ratingRange = Math.max(...ratingValues) - Math.min(...ratingValues);
  let confidence: 'high' | 'medium' | 'low';
  if (ratingRange <= 1) confidence = 'high';
  else if (ratingRange <= 2) confidence = 'medium';
  else confidence = 'low';

  // Generate justification
  const justificationParts: string[] = [];

  if (ratings.pipe_density) {
    justificationParts.push(`Kerapatan pipa ${typeof ratings.pipe_density.value === 'number' ? ratings.pipe_density.value : ratings.pipe_density.value} pipa/m² → ${ratings.pipe_density.rating}`);
  }
  if (ratings.equipment_density) {
    justificationParts.push(`Kerapatan equipment ${ratings.equipment_density.value}% → ${ratings.equipment_density.rating}`);
  }
  if (ratings.obstacle_spacing) {
    justificationParts.push(`Jarak obstacle ${ratings.obstacle_spacing.value} m → ${ratings.obstacle_spacing.rating}`);
  }
  if (ratings.obstacle_layers) {
    justificationParts.push(`Lapisan obstacle ${ratings.obstacle_layers.value} → ${ratings.obstacle_layers.rating}`);
  }
  if (ratings.confined_volumes) {
    justificationParts.push(`Volume terconfine ${ratings.confined_volumes.value} → ${ratings.confined_volumes.rating}`);
  }

  const justification = `Berdasarkan penilaian: ${justificationParts.join(', ')}. Rating keseluruhan: ${overallRating} (${confidence} confidence).`;

  return {
    ratings,
    overallRating,
    confidence,
    justification
  };
}

export { congestionQuestions };