import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuestionSuggestion {
    relatedQuestions: Array<string>;
    question: string;
    answer: string;
    citations: Array<string>;
}
export interface FoodEntry {
    id: bigint;
    day: bigint;
    owner: Principal;
    calories: number;
    description: string;
    confidenceLevel: number;
    portionSize: number;
    micronutrients: {
        fiber: number;
        sodium: number;
        sugar: number;
    };
    macros: {
        fat: number;
        carbs: number;
        protein: number;
    };
    foodLabel: string;
}
export interface HealthMetrics {
    bmi: number;
    bmr: number;
    bmiCategory: string;
    tdee: number;
}
export interface BodyGoalDetails {
    goalType: GoalType;
    weeklyGoalSpeed: number;
    targetWeight: number;
    currentWeight: number;
}
export interface WeeklyFeedback {
    totalCarbs: number;
    feedbackType: FeedbackType;
    avgCalories: number;
    totalFat: number;
    entriesChecked: bigint;
    totalProtein: number;
    entriesPerDay: number;
}
export interface UserProfile {
    age?: bigint;
    sex?: Sex;
    activityLevel?: ActivityLevel;
    heightCm?: number;
    name: string;
    bodyGoal?: BodyGoalDetails;
}
export enum ActivityLevel {
    lightlyActive = "lightlyActive",
    extraActive = "extraActive",
    veryActive = "veryActive",
    moderatelyActive = "moderatelyActive",
    sedentary = "sedentary"
}
export enum FeedbackType {
    offBalance = "offBalance",
    goodJob = "goodJob",
    notEnoughData = "notEnoughData",
    overrange = "overrange",
    underrange = "underrange",
    partialFocus = "partialFocus"
}
export enum GoalType {
    gainMuscle = "gainMuscle",
    maintain = "maintain",
    gainWeight = "gainWeight",
    loseWeight = "loseWeight"
}
export enum Sex {
    female = "female",
    male = "male"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFoodEntry(day: bigint, foodLabel: string, description: string, calories: number, macros: {
        fat: number;
        carbs: number;
        protein: number;
    }, micronutrients: {
        fiber: number;
        sodium: number;
        sugar: number;
    }, portionSize: number, confidenceLevel: number): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerHealthMetrics(): Promise<HealthMetrics>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFoodEntriesForCaller(startDay: bigint, endDay: bigint): Promise<Array<FoodEntry>>;
    getPortionAdjusterGuidance(): Promise<string>;
    getSuggestedQuestions(): Promise<Array<QuestionSuggestion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyFeedback(): Promise<WeeklyFeedback>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBodyGoal(details: BodyGoalDetails): Promise<void>;
}
