import { User } from "@supabase/supabase-js";
import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
  user: User | null;
}
