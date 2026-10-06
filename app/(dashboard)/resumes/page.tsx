import { PageHeader } from "@/components/layout/page-header";
import { ResumeUploadPlaceholder } from "@/components/resumes/resume-upload-placeholder";

export const metadata = { title: "Resumes" };

export default function ResumesPage() {
  return (
    <>
      <PageHeader title="Resume Vault" description="Every upload is an immutable version." />
      <ResumeUploadPlaceholder />
    </>
  );
}
