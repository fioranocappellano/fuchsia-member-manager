
// This file is only to maintain compatibility during the transition
// Eventually this should be removed in favor of using the types from @/frontend/types/api
import { Member as ApiMember } from "@/frontend/types/api";

export interface Member extends ApiMember {
  // Ensure all fields from the API are required for backwards compatibility
  position: number;
}
