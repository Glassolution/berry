
import { Gender, ActivityLevel, DietPreference, FoodRestriction } from '../context/QuizContext';

export type DietFoodId =
  | 'chicken'
  | 'fish'
  | 'eggs'
  | 'tofu'
  | 'beans'
  | 'rice'
  | 'potato'
  | 'oats'
  | 'fruit_banana'
  | 'fruit_apple'
  | 'vegetables'
  | 'olive_oil'
  | 'nuts'
  | 'yogurt';

export type DietMealItemCategory = 'protein' | 'carb' | 'fat' | 'veg' | 'fruit' | 'other';

export type DietMacroKey = 'protein' | 'carbs' | 'fats';

export interface DietMealItem {
  category: DietMealItemCategory;
  foodId: DietFoodId;
  grams?: number;
  quantity?: number;
  label?: string;
  targetMacro?: DietMacroKey;
  targetMacroGrams?: number;
}

export interface DietPlanOptions {
  restrictions?: FoodRestriction[];
  restrictionOtherText?: string;
  dietPreference?: DietPreference;
  foodsLike?: string[];
  foodsDislike?: string[];
  mealsPerDay?: 3 | 4 | 5 | 6;
  budget?: 'baixo' | 'medio' | 'alto';
}

export interface DietPlan {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
  meals: {
    name: string;
    icon: string;
    foods: string[];
    approxCalories: number;
    macros?: {
      protein: number;
      carbs: number;
      fats: number;
      calories: number;
    };
    items?: DietMealItem[];
  }[];
  goalType: 'lose' | 'gain' | 'maintain';
  // New fields for Berry Engine compliance
  tmb?: number;
  tdee?: number;
  lists?: {
    prioritize: string[];
    avoid: string[];
  };
  disclaimer?: string;
  meta?: {
    restrictions: FoodRestriction[];
    restrictionOtherText?: string;
    dietPreference: DietPreference;
    foodsLike: string[];
    foodsDislike: string[];
    mealsPerDay: 3 | 4 | 5 | 6;
    budget?: 'baixo' | 'medio' | 'alto';
    createdAt: string;
    version: number;
  };
}

type DietFood = {
  id: DietFoodId;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
  tags: string[];
  allergens: FoodRestriction[];
  isAnimalProduct?: boolean;
  isFish?: boolean;
};

const FOOD_DB: Record<DietFoodId, DietFood> = {
  chicken: { id: 'chicken', name: 'Frango', protein: 31, carbs: 0, fat: 3.6, kcal: 165, tags: ['frango', 'carne', 'proteina', 'ave'], allergens: [], isAnimalProduct: true },
  fish: { id: 'fish', name: 'Peixe', protein: 22, carbs: 0, fat: 2.5, kcal: 115, tags: ['peixe', 'salmao', 'tilapia', 'proteina', 'frutos do mar'], allergens: ['frutos_do_mar'], isAnimalProduct: true, isFish: true },
  eggs: { id: 'eggs', name: 'Ovo', protein: 13, carbs: 1.1, fat: 11, kcal: 155, tags: ['ovo', 'ovos', 'proteina'], allergens: ['ovo'], isAnimalProduct: true },
  tofu: { id: 'tofu', name: 'Tofu', protein: 12, carbs: 2, fat: 6, kcal: 120, tags: ['tofu', 'soja', 'vegano', 'proteina'], allergens: [], isAnimalProduct: false },
  beans: { id: 'beans', name: 'Feijão', protein: 8.9, carbs: 22.8, fat: 0.5, kcal: 127, tags: ['feijao', 'feijão', 'leguminosa', 'carbo', 'proteina'], allergens: [], isAnimalProduct: false },
  rice: { id: 'rice', name: 'Arroz cozido', protein: 2.5, carbs: 28, fat: 0.3, kcal: 130, tags: ['arroz', 'carbo'], allergens: [], isAnimalProduct: false },
  potato: { id: 'potato', name: 'Batata cozida', protein: 2, carbs: 17, fat: 0.1, kcal: 77, tags: ['batata', 'carbo'], allergens: [], isAnimalProduct: false },
  oats: { id: 'oats', name: 'Aveia', protein: 16.9, carbs: 66, fat: 6.9, kcal: 389, tags: ['aveia', 'cafe', 'café', 'carbo'], allergens: ['gluten'], isAnimalProduct: false },
  fruit_banana: { id: 'fruit_banana', name: 'Banana', protein: 1.1, carbs: 23, fat: 0.3, kcal: 96, tags: ['banana', 'fruta'], allergens: [], isAnimalProduct: false },
  fruit_apple: { id: 'fruit_apple', name: 'Maçã', protein: 0.3, carbs: 14, fat: 0.2, kcal: 52, tags: ['maca', 'maçã', 'fruta'], allergens: [], isAnimalProduct: false },
  vegetables: { id: 'vegetables', name: 'Vegetais variados', protein: 2, carbs: 5, fat: 0, kcal: 30, tags: ['salada', 'vegetais', 'legumes'], allergens: [], isAnimalProduct: false },
  olive_oil: { id: 'olive_oil', name: 'Azeite de oliva', protein: 0, carbs: 0, fat: 100, kcal: 884, tags: ['azeite', 'gordura'], allergens: [], isAnimalProduct: false },
  nuts: { id: 'nuts', name: 'Castanhas', protein: 20, carbs: 21, fat: 54, kcal: 650, tags: ['castanhas', 'oleaginosas', 'gordura'], allergens: ['amendoim'], isAnimalProduct: false },
  yogurt: { id: 'yogurt', name: 'Iogurte natural', protein: 10, carbs: 4, fat: 3, kcal: 90, tags: ['iogurte', 'lactose', 'proteina'], allergens: ['lactose'], isAnimalProduct: true },
};

const calcGrams = (targetVal: number, nutrientPer100: number) => {
  if (nutrientPer100 <= 0) return 0;
  return Math.max(0, Math.round((targetVal / nutrientPer100) * 100));
};

const normalizeText = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

const buildFoodRules = (options?: DietPlanOptions) => {
  const restrictions = options?.restrictions ?? [];
  const dietPreference = options?.dietPreference ?? 'sem_restricao';
  const likes = new Set((options?.foodsLike ?? []).map(normalizeText).filter(Boolean));
  const dislikes = new Set((options?.foodsDislike ?? []).map(normalizeText).filter(Boolean));

  const hasRestriction = (r: FoodRestriction) => restrictions.includes(r);
  const isVegan = dietPreference === 'vegana';
  const isVegetarian = dietPreference === 'vegetariana';
  const isPescetarian = dietPreference === 'pescetariana';

  const isFoodAllowed = (food: DietFood) => {
    if (food.allergens.some((a) => hasRestriction(a))) return false;
    if (hasRestriction('lactose') && food.id === 'yogurt') return false;
    if (hasRestriction('gluten') && food.id === 'oats') return false;
    if (hasRestriction('amendoim') && food.id === 'nuts') return false;
    if (hasRestriction('frutos_do_mar') && food.isFish) return false;
    if (hasRestriction('ovo') && food.id === 'eggs') return false;
    if (isVegan && food.isAnimalProduct) return false;
    if (isVegetarian && (food.id === 'chicken' || food.id === 'fish')) return false;
    if (isPescetarian && food.id === 'chicken') return false;
    if (dislikes.size > 0) {
      const foodTags = food.tags.map(normalizeText);
      if (foodTags.some((t) => dislikes.has(t))) return false;
    }
    return true;
  };

  const score = (food: DietFood) => food.tags.map(normalizeText).filter((t) => likes.has(t)).length;

  return { isFoodAllowed, score };
};

export const listDietFoodOptions = (category: DietMealItemCategory, options?: DietPlanOptions) => {
  const { isFoodAllowed, score } = buildFoodRules(options);

  const ids: DietFoodId[] =
    category === 'protein'
      ? ['chicken', 'fish', 'eggs', 'tofu', 'beans', 'yogurt']
      : category === 'carb'
        ? ['rice', 'potato', 'oats', 'beans']
        : category === 'fat'
          ? ['nuts', 'olive_oil']
          : category === 'fruit'
            ? ['fruit_banana', 'fruit_apple']
            : category === 'veg'
              ? ['vegetables']
              : [];

  return ids
    .map((id) => FOOD_DB[id])
    .filter(isFoodAllowed)
    .map((food) => ({ id: food.id, name: food.name, score: score(food) }))
    .sort((a, b) => (b.score - a.score) || a.name.localeCompare(b.name))
    .map(({ id, name }) => ({ id, name }));
};

export const formatDietMealItem = (item: DietMealItem) => {
  if (item.label) return item.label;
  const food = FOOD_DB[item.foodId];
  if (item.quantity) return `${item.quantity} ${food.name}`;
  if (typeof item.grams === 'number') return `${item.grams}g ${food.name}`;
  return food.name;
};

export const replaceDietPlanItem = (
  plan: DietPlan,
  mealIndex: number,
  itemIndex: number,
  newFoodId: DietFoodId
): DietPlan => {
  const meals = plan.meals.map((m) => ({ ...m, foods: [...m.foods], items: m.items ? m.items.map((it) => ({ ...it })) : undefined }));
  const meal = meals[mealIndex];
  if (!meal?.items || !meal.items[itemIndex]) return plan;

  const current = meal.items[itemIndex];
  const food = FOOD_DB[newFoodId];

  const next: DietMealItem = {
    ...current,
    foodId: newFoodId,
    label: undefined,
    quantity: undefined,
  };

  if (next.targetMacro && typeof next.targetMacroGrams === 'number') {
    const per100 =
      next.targetMacro === 'protein'
        ? food.protein
        : next.targetMacro === 'carbs'
          ? food.carbs
          : food.fat;

    const grams = calcGrams(next.targetMacroGrams, per100);
    next.grams = grams;
  }

  if (newFoodId === 'eggs' && typeof next.grams === 'number') {
    const quantity = Math.max(1, Math.round(next.grams / 50));
    next.quantity = quantity;
    next.label = `${quantity} ovos`;
  }

  meal.items[itemIndex] = next;
  meal.foods = meal.items.map(formatDietMealItem);
  meals[mealIndex] = meal;

  return { ...plan, meals };
};

export const calculateDietPlan = (
  gender: Gender,
  age: number,
  height: number,
  weight: number,
  goalWeight: number,
  activityLevel: ActivityLevel,
  options?: DietPlanOptions
): DietPlan => {
  const normalizedOptions: Required<Pick<
    DietPlanOptions,
    'restrictions' | 'restrictionOtherText' | 'dietPreference' | 'foodsLike' | 'foodsDislike' | 'mealsPerDay'
  >> & Pick<DietPlanOptions, 'budget'> = {
    restrictions: options?.restrictions ?? [],
    restrictionOtherText: options?.restrictionOtherText ?? '',
    dietPreference: options?.dietPreference ?? 'sem_restricao',
    foodsLike: options?.foodsLike ?? [],
    foodsDislike: options?.foodsDislike ?? [],
    mealsPerDay: options?.mealsPerDay ?? 4,
    budget: options?.budget,
  };

  // 1. BMR Calculation (Mifflin-St Jeor)
  // P = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + s
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'homem') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  bmr = Math.round(bmr);

  // 2. TDEE Calculation
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  // 3. Goal Adjustment & Safety Lock
  let targetCalories = tdee;
  let goalType: 'lose' | 'gain' | 'maintain' = 'maintain';

  if (weight > goalWeight + 1) {
    goalType = 'lose';
    targetCalories = tdee - 400; // Cutting rule
  } else if (weight < goalWeight - 1) {
    goalType = 'gain';
    targetCalories = tdee + 300; // Bulking rule
  }

  // Safety Lock
  const minCalories = gender === 'homem' ? 1500 : 1200;
  if (targetCalories < minCalories) targetCalories = minCalories;

  targetCalories = Math.round(targetCalories);

  // 4. Macro Calculation (Gram/Kg Method)
  // Protein Rule: Cut=2.0, Maint=1.6, Bulk=1.8
  let proteinFactor = 1.6;
  if (goalType === 'lose') proteinFactor = 2.0;
  if (goalType === 'gain') proteinFactor = 1.8;
  
  let proteinGrams = Math.round(weight * proteinFactor);
  
  // Fat Rule: 0.8g/kg (Min 45g)
  let fatGrams = Math.round(weight * 0.8);
  if (fatGrams < 45) fatGrams = 45;

  // Carb Rule: Remaining calories
  // Calories used so far
  const proteinCals = proteinGrams * 4;
  const fatCals = fatGrams * 9;
  let remainingCals = targetCalories - (proteinCals + fatCals);

  // Constraint: Never zero carb. If negative or too low, adjust.
  // We'll enforce at least 50g carbs approx (200kcal)
  if (remainingCals < 200) {
    remainingCals = 200;
    // We must increase total calories to accommodate this, OR reduce fat/protein if they are high?
    // The prompt says "se ficar baixo demais, ajustar carbs e manter proteína e gordura mínimas".
    // "Manter proteína e gordura mínimas" implies we shouldn't cut them below their calculated minimums.
    // So we increase total calories slightly (Safety Lock logic essentially).
    targetCalories = proteinCals + fatCals + remainingCals;
  }

  const carbGrams = Math.round(remainingCals / 4);
  let adjustedCarbGrams = carbGrams;
  let adjustedFatGrams = fatGrams;
  let adjustedTargetCalories = targetCalories;

  if (normalizedOptions.dietPreference === 'low_carb') {
    const reducedCarb = Math.max(60, Math.round(carbGrams * 0.75));
    const carbDeltaCals = (carbGrams - reducedCarb) * 4;
    const extraFat = Math.round(carbDeltaCals / 9);
    adjustedCarbGrams = reducedCarb;
    adjustedFatGrams = fatGrams + extraFat;
    adjustedTargetCalories = proteinGrams * 4 + adjustedCarbGrams * 4 + adjustedFatGrams * 9;
  }

  // Water Rule: 35ml/kg
  const waterLiters = Math.round((weight * 0.035) * 10) / 10;

  // 5. Meal Plan Generation (Grams Calculation)
  const { isFoodAllowed, score } = buildFoodRules(normalizedOptions);
  const isVegan = normalizedOptions.dietPreference === 'vegana';

  const pickFood = (candidates: DietFoodId[]) => {
    const allowed = candidates.map((id) => FOOD_DB[id]).filter(isFoodAllowed);
    if (allowed.length === 0) {
      const fallback = Object.values(FOOD_DB).filter(isFoodAllowed);
      return fallback[0] ?? FOOD_DB.rice;
    }

    const scored = allowed
      .map((f) => {
        return { food: f, score: score(f) };
      })
      .sort((a, b) => b.score - a.score);

    return scored[0].food;
  };

  const getMealTemplates = (mealsPerDay: 3 | 4 | 5 | 6) => {
    if (mealsPerDay === 3) {
      return [
        { name: 'Café da Manhã', icon: 'coffee', ratio: 0.28, type: 'breakfast' as const },
        { name: 'Almoço', icon: 'silverware-fork-knife', ratio: 0.38, type: 'main' as const },
        { name: 'Jantar', icon: 'weather-night', ratio: 0.34, type: 'main' as const },
      ];
    }
    if (mealsPerDay === 5) {
      return [
        { name: 'Café da Manhã', icon: 'coffee', ratio: 0.24, type: 'breakfast' as const },
        { name: 'Almoço', icon: 'silverware-fork-knife', ratio: 0.32, type: 'main' as const },
        { name: 'Lanche 1', icon: 'food-apple', ratio: 0.14, type: 'snack' as const },
        { name: 'Lanche 2', icon: 'food-apple', ratio: 0.12, type: 'snack' as const },
        { name: 'Jantar', icon: 'weather-night', ratio: 0.18, type: 'main' as const },
      ];
    }
    if (mealsPerDay === 6) {
      return [
        { name: 'Café da Manhã', icon: 'coffee', ratio: 0.22, type: 'breakfast' as const },
        { name: 'Lanche 1', icon: 'food-apple', ratio: 0.10, type: 'snack' as const },
        { name: 'Almoço', icon: 'silverware-fork-knife', ratio: 0.28, type: 'main' as const },
        { name: 'Lanche 2', icon: 'food-apple', ratio: 0.10, type: 'snack' as const },
        { name: 'Lanche 3', icon: 'food-apple', ratio: 0.10, type: 'snack' as const },
        { name: 'Jantar', icon: 'weather-night', ratio: 0.20, type: 'main' as const },
      ];
    }
    return [
      { name: 'Café da Manhã', icon: 'coffee', ratio: 0.25, type: 'breakfast' as const },
      { name: 'Almoço', icon: 'silverware-fork-knife', ratio: 0.35, type: 'main' as const },
      { name: 'Lanche da Tarde', icon: 'food-apple', ratio: 0.15, type: 'snack' as const },
      { name: 'Jantar', icon: 'weather-night', ratio: 0.25, type: 'main' as const },
    ];
  };

  const buildMeal = (mealType: 'breakfast' | 'main' | 'snack', ratio: number) => {
    const calories = Math.round(adjustedTargetCalories * ratio);
    const proteinTarget = proteinGrams * ratio;
    const carbTarget = adjustedCarbGrams * ratio;
    const fatTarget = adjustedFatGrams * ratio;

    const items: DietMealItem[] = [];

    const fruitFood = pickFood(['fruit_banana', 'fruit_apple']);
    const oilFood = FOOD_DB.olive_oil;
    const nutsFood = FOOD_DB.nuts;

    const proteinFood = pickFood(['chicken', 'fish', 'eggs', 'tofu', 'beans']);
    const carbFood = pickFood(['rice', 'potato', 'oats', 'beans']);

    if (mealType === 'breakfast') {
      const breakfastProtein = pickFood(isVegan ? ['tofu', 'beans'] : ['eggs', 'tofu', 'yogurt', 'beans']);
      const breakfastCarb = pickFood(['oats', 'rice', 'potato']);

      if (breakfastProtein.id === 'eggs') {
        const grams = calcGrams(proteinTarget, breakfastProtein.protein);
        const quantity = Math.max(1, Math.round(grams / 50));
        items.push({ category: 'protein', foodId: 'eggs', quantity, label: `${quantity} ovos`, targetMacro: 'protein', targetMacroGrams: proteinTarget });
      } else {
        const grams = calcGrams(proteinTarget, breakfastProtein.protein);
        items.push({ category: 'protein', foodId: breakfastProtein.id, grams, targetMacro: 'protein', targetMacroGrams: proteinTarget });
      }

      const carbAllowance = Math.max(0, carbTarget - 12);
      const carbGramsForFood = calcGrams(carbAllowance, breakfastCarb.carbs);
      items.push({ category: 'carb', foodId: breakfastCarb.id, grams: carbGramsForFood, targetMacro: 'carbs', targetMacroGrams: carbAllowance });
      items.push({ category: 'fruit', foodId: fruitFood.id, quantity: 1, label: `1 ${fruitFood.name}` });
      return { calories, proteinTarget, carbTarget, fatTarget, items };
    }

    if (mealType === 'snack') {
      items.push({ category: 'fruit', foodId: fruitFood.id, quantity: 1, label: `1 ${fruitFood.name}` });
      const nutsGrams = calcGrams(fatTarget, nutsFood.fat);
      if (isFoodAllowed(nutsFood)) {
        items.push({ category: 'fat', foodId: 'nuts', grams: nutsGrams, targetMacro: 'fats', targetMacroGrams: fatTarget });
      } else {
        const oilGrams = calcGrams(fatTarget, oilFood.fat);
        items.push({ category: 'fat', foodId: 'olive_oil', grams: oilGrams, targetMacro: 'fats', targetMacroGrams: fatTarget });
      }

      const yogurtFood = FOOD_DB.yogurt;
      if (proteinTarget > 10 && isFoodAllowed(yogurtFood)) {
        const grams = calcGrams(Math.max(8, proteinTarget * 0.6), yogurtFood.protein);
        items.push({ category: 'protein', foodId: 'yogurt', grams, targetMacro: 'protein', targetMacroGrams: Math.max(8, proteinTarget * 0.6) });
      } else if (proteinTarget > 10) {
        const grams = calcGrams(Math.max(8, proteinTarget * 0.6), proteinFood.protein);
        items.push({ category: 'protein', foodId: proteinFood.id, grams, targetMacro: 'protein', targetMacroGrams: Math.max(8, proteinTarget * 0.6) });
      }

      return { calories, proteinTarget, carbTarget, fatTarget, items };
    }

    const proteinGramsForFood = calcGrams(proteinTarget, proteinFood.protein);
    items.push({ category: 'protein', foodId: proteinFood.id, grams: proteinGramsForFood, targetMacro: 'protein', targetMacroGrams: proteinTarget });

    const carbGramsForFood = calcGrams(carbTarget, carbFood.carbs);
    if (carbGramsForFood > 0) {
      items.push({ category: 'carb', foodId: carbFood.id, grams: carbGramsForFood, targetMacro: 'carbs', targetMacroGrams: carbTarget });
    }

    items.push({ category: 'veg', foodId: 'vegetables', grams: 150, label: 'Salada/legumes livre' });

    const oilGrams = calcGrams(fatTarget, oilFood.fat);
    if (oilGrams > 5) {
      items.push({ category: 'fat', foodId: 'olive_oil', grams: oilGrams, targetMacro: 'fats', targetMacroGrams: fatTarget });
    }

    return { calories, proteinTarget, carbTarget, fatTarget, items };
  };

  const mealTemplates = getMealTemplates(normalizedOptions.mealsPerDay);
  const generatedMeals = mealTemplates.map((meal) => {
    const built = buildMeal(meal.type, meal.ratio);
    const foods = built.items.map(formatDietMealItem);
    return {
      name: meal.name,
      icon: meal.icon,
      foods,
      approxCalories: built.calories,
      macros: {
        protein: Math.round(built.proteinTarget),
        carbs: Math.round(built.carbTarget),
        fats: Math.round(built.fatTarget),
        calories: built.calories,
      },
      items: built.items,
    };
  });

  return {
    calories: adjustedTargetCalories,
    macros: { 
      protein: proteinGrams, 
      carbs: adjustedCarbGrams, 
      fats: adjustedFatGrams, 
      water: waterLiters 
    },
    meals: generatedMeals,
    goalType,
    // Berry Engine Extras
    tmb: bmr,
    tdee: tdee,
    lists: {
      prioritize: ['Proteínas magras', 'Vegetais fibrosos', 'Água', 'Comida de verdade'],
      avoid: ['Açúcar refinado', 'Frituras em excesso', 'Alimentos ultraprocessados'],
    },
    disclaimer: 'Plano inicial geral. Não substitui profissional.',
    meta: {
      restrictions: normalizedOptions.restrictions,
      restrictionOtherText: normalizedOptions.restrictionOtherText || undefined,
      dietPreference: normalizedOptions.dietPreference,
      foodsLike: normalizedOptions.foodsLike,
      foodsDislike: normalizedOptions.foodsDislike,
      mealsPerDay: normalizedOptions.mealsPerDay,
      budget: normalizedOptions.budget,
      createdAt: new Date().toISOString(),
      version: 1,
    },
  };
};
