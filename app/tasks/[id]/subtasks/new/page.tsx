import SubtaskCreate from "@/components/subtask/subtask-create";
import PageHeader from "@/components/ui/page-header";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  return (
    <>
      <PageHeader title="New Subtask" />
      <SubtaskCreate taskId={id} />
    </>
  );
}
