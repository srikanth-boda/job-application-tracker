import { PlaceholderPanel } from "@/components/layout/placeholder-panel";

/** Resume upload (PDF only, <= 5 MB) - see schemas/resume.schema.ts and services/resumes. */
export function ResumeUploadPlaceholder() {
  return <PlaceholderPanel>Resume upload and version list.</PlaceholderPanel>;
}
