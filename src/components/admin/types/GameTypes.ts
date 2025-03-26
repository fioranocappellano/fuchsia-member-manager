
// This file is only to maintain compatibility during the transition
// Eventually this should be removed in favor of using the types from @/frontend/types/api
import { Game as ApiGame } from "@/frontend/types/api";

export interface Game extends ApiGame {
  // Ensure all fields from the API are required for backwards compatibility
  updated_at: string;
  winner: string;
}
