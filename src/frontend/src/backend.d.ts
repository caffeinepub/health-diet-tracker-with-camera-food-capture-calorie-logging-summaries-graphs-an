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
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFoodEntry(day: bigint, foodLabel: string, calories: number, macros: {
        fat: number;
        carbs: number;
        protein: number;
    }, micronutrients: {
        fiber: number;
        sodium: number;
        sugar: number;
    }, portionSize: number, confidenceLevel: number): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFoodEntriesForCaller(startDay: bigint, endDay: bigint): Promise<Array<FoodEntry>>;
    getPortionAdjusterGuidance(): Promise<string>;
    getSuggestedQuestions(): Promise<Array<QuestionSuggestion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
