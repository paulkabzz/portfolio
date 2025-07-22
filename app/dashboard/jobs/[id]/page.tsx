import { JobDetailPage } from "@/components/job-details/job-details-page";

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetail({ params }: JobDetailPageProps) {
  const { id } = await params
  return <JobDetailPage jobId={id} />
}
