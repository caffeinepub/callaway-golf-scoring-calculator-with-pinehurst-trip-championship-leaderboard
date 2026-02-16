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
export type GrossToDeduction = [bigint, bigint, number, bigint];
export interface RawEvent {
    par: bigint;
    scores: Array<[GolferId, Array<bigint>]>;
}
export interface SharedChartEntry {
    adjustment: bigint;
    deduction: number;
    grossScoreFrom: bigint;
    grossScoreTo: bigint;
}
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
    /**
     * / Get backend chart in shared format
     */
    getCallawayChart(): Promise<Array<SharedChartEntry>>;
    getEventsForPrincipal(_principal: Principal): Promise<Array<[GolferId, RawEvent]>>;
    /**
     * / Returns the entire gross to deduction conversion data from the chart.
     */
    getGrossToDeductionTable(): Promise<Array<GrossToDeduction>>;
    /**
     * / Get latest results
     */
    getLatestResult(): Promise<EventResult | null>;
    /**
     * / Returns whether all validation tests pass for backend calculations
     */
    isValidBackendCalculations(): Promise<boolean>;
    /**
     * / Submit new event (scores)
     */
    submitEvent(golferId: GolferId, coursePar: bigint, holeScores: Array<bigint>): Promise<void>;
    /**
     * / Update previously submitted event by golferId
     */
    updateEvent(golferId: GolferId, holeScores: Array<bigint>): Promise<void>;
}
