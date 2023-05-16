import { MatchData } from "../types/MatchData"

export interface Analyzer{
    run(matches: MatchData[]): string
}