import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type GolferId = Principal;
export interface CallawayResult {
    net: bigint;
    adjustment: bigint;
    deduction: bigint;
    gross: bigint;
}
export interface EventResult {
    results: Array<[GolferId, CallawayResult]>;
    coursePar: bigint;
}
export interface backendInterface {
    getLatestResult(): Promise<EventResult | null>;
    submitEvent(golferId: GolferId, coursePar: bigint, holeScores: Array<bigint>): Promise<void>;
    updateEvent(golferId: GolferId, holeScores: Array<bigint>): Promise<void>;
}
