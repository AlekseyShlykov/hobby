import type { UserScores, UserContext, Hobby, OceanTrait, RiasecTrait } from '@/types';

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// Calculate hobby match score
export function calculateHobbyScore(
  hobby: Hobby,
  userScores: UserScores
): number {
  // RIASEC similarity (70% weight)
  const riasecKeys: RiasecTrait[] = ['R', 'I', 'Art', 'S', 'Ent', 'Con'];
  const userRiasec = riasecKeys.map(k => userScores.riasec[k]);
  const hobbyRiasec = riasecKeys.map(k => hobby.riasec[k] * 10); // Scale to 0-10

  const riasecScore = cosineSimilarity(userRiasec, hobbyRiasec);

  // OCEAN boost (30% weight)
  let oceanBoost = 0;
  const oceanKeys: OceanTrait[] = ['O', 'C', 'E', 'A', 'N'];
  let boostCount = 0;

  oceanKeys.forEach(key => {
    if (hobby.oceanBoost[key] !== undefined) {
      const boost = hobby.oceanBoost[key]!;
      const userValue = userScores.ocean[key] / 10; // Normalize to 0-1
      oceanBoost += userValue * boost;
      boostCount++;
    }
  });

  if (boostCount > 0) {
    oceanBoost = oceanBoost / boostCount;
  }

  return riasecScore * 0.7 + oceanBoost * 0.3;
}

// Filter hobbies by context
export function filterHobbiesByContext(
  hobbies: Hobby[],
  context: UserContext
): Hobby[] {
  return hobbies.filter(hobby => {
    // Time filter
    if (context.time && !hobby.time.includes(context.time)) {
      return false;
    }

    // Budget filter
    if (context.budget && context.budget !== 'high') {
      const budgetOrder = ['free', 'small', 'medium', 'high'];
      const userBudgetIndex = budgetOrder.indexOf(context.budget);
      const hasAffordableOption = hobby.budget.some(
        b => budgetOrder.indexOf(b) <= userBudgetIndex
      );
      if (!hasAffordableOption) return false;
    }

    // Activity filter
    if (context.activity && context.activity !== 'any') {
      if (hobby.activity !== context.activity) return false;
    }

    return true;
  });
}

// Get top N hobbies
export function getRecommendedHobbies(
  hobbies: Hobby[],
  userScores: UserScores,
  context: UserContext,
  count: number = 5
): { hobby: Hobby; score: number; reasons: string[] }[] {
  // Filter by context
  const filteredHobbies = filterHobbiesByContext(hobbies, context);

  // Score each hobby
  const scoredHobbies = filteredHobbies.map(hobby => ({
    hobby,
    score: calculateHobbyScore(hobby, userScores),
    reasons: generateReasons(hobby, userScores),
  }));

  // Sort by score and return top N
  return scoredHobbies
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// Generate reasons why hobby fits user
function generateReasons(hobby: Hobby, userScores: UserScores): string[] {
  const reasons: string[] = [];
  const riasecKeys: RiasecTrait[] = ['R', 'I', 'Art', 'S', 'Ent', 'Con'];
  const riasecNames: Record<RiasecTrait, string> = {
    R: 'hands-on',
    I: 'analytical',
    Art: 'creative',
    S: 'social',
    Ent: 'leadership',
    Con: 'organized'
  };

  // Find top 2 matching RIASEC traits
  const riasecMatches = riasecKeys
    .map(key => ({
      key,
      match: (hobby.riasec[key] * userScores.riasec[key]) / 10,
    }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 2);

  riasecMatches.forEach(({ key }) => {
    if (hobby.riasec[key] > 0.5) {
      reasons.push(riasecNames[key]);
    }
  });

  // Check OCEAN boosts
  const oceanNames: Record<OceanTrait, string> = {
    O: 'exploratory',
    C: 'structured',
    E: 'social',
    A: 'collaborative',
    N: 'emotional'
  };

  Object.entries(hobby.oceanBoost).forEach(([key, boost]) => {
    if (boost && boost > 0.4 && userScores.ocean[key as OceanTrait] > 6) {
      reasons.push(oceanNames[key as OceanTrait]);
    }
  });

  return [...new Set(reasons)].slice(0, 3);
}

// Get OCEAN level (high, medium, low)
export function getOceanLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}
