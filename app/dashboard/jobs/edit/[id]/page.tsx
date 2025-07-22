import { EditJobApplicationPage } from "@/components/edit-job/edit-job";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  return <EditJobApplicationPage jobId={id} />;
};
