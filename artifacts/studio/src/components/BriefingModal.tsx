import { useEffect, useRef, useState } from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useSubmitBriefingRequest } from "@workspace/api-client-react";
import { programOutcomes } from "@/data/outcomes";

const PROGRAM_OPTIONS = [
  { value: "general", label: "General inquiry" },
  ...TRUNCATED_FOR_TOOL...