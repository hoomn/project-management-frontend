import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import Icon from "../Icon";
import Loading from "../Loading";
import MultiSelect from "../form/MultiSelect";
import Select from "../form/Select";

import { fetchPriorityChoices, fetchStatusChoices } from "../../api/endpoints";
import { createTask, updateTask } from "../../api/task";
import { fetchUsers } from "../../api/user";

type TaskFormProps = {
  projectId?: number;
  task?: TaskProps;
};

export default function taskDetails({ projectId, task }: TaskFormProps) {
  const authHeader: string = useAuthHeader() || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: task
      ? (updatedTask: TaskProps) => updateTask(authHeader, updatedTask)
      : (newTask: TaskProps) => createTask(authHeader, newTask),
    onSuccess: () => {
      if (task) {
        queryClient.invalidateQueries({ queryKey: ["task", task.id] });
        navigate(`/tasks/${task.id.toString()}`);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["tasks", "project", projectId],
        });
        navigate(`/projects/${projectId}`);
      }
    },
  });

  const {
    isPending: isStatusPending,
    isError: isStatusError,
    data: statusOptions,
  } = useQuery({
    queryKey: ["status", "options"],
    queryFn: () => fetchStatusChoices(authHeader),
  });

  const {
    isPending: isPriorityPending,
    isError: isPriorityError,
    data: priorityOptions,
  } = useQuery({
    queryKey: ["priority", "options"],
    queryFn: () => fetchPriorityChoices(authHeader),
  });

  const {
    isPending: isUserPending,
    isError: isUserError,
    data: userOptions,
  } = useQuery({
    queryKey: ["user", "options"],
    queryFn: () => fetchUsers(authHeader),
    select(data) {
      return data.map(({ id, email }: { id: number; email: string }) => ({
        value: id,
        label: email,
      }));
    },
  });

  const onSubmit: SubmitHandler<TaskProps> = (data) => {
    data.project = task ? task.project! : projectId!;
    // If the date is an empty string, set it to null
    data.start_date = data.start_date || null;
    data.end_date = data.end_date || null;
    mutation.mutate(data);
  };
  // const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
    control,
  } = useForm<TaskProps>({ defaultValues: task });

  if (isStatusPending || isPriorityPending || isUserPending) return <Loading />;
  if (isStatusError || isPriorityError || isUserError) return <Alert variant={"danger"}>Error fetching</Alert>;

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            {...register("title", {
              required: "* Title is required.",
              maxLength: 128,
            })}
            className="form-control"
          />
          {errors.title && <p className="alert alert-danger mb-0 p-2">{errors.title?.message}</p>}
        </div>

        <div className="col-md-12">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea {...register("description")} rows={5} className="form-control" />
        </div>

        <div className="col-md-3">
          <label htmlFor="start_date" className="form-label">
            Start Date:
          </label>
          <input {...register("start_date")} type="date" className="form-control" />
        </div>

        <div className="col-md-3">
          <label htmlFor="end_date" className="form-label">
            End Date:
          </label>
          <input {...register("end_date")} type="date" className="form-control" />
        </div>

        <div className="col-md-3">
          <Select
            options={statusOptions}
            defaultValue={task?.status}
            isPending={isStatusPending}
            control={control}
            name="status"
            label="Status"
          />
        </div>

        <div className="col-md-3">
          <Select
            options={priorityOptions}
            defaultValue={task?.priority}
            isPending={isPriorityPending}
            control={control}
            name="priority"
            label="Priority"
          />
        </div>

        <div className="col-md-12">
          <MultiSelect
            options={userOptions}
            defaultValue={task?.assigned_to || []}
            isPending={isUserPending}
            control={control}
            name="assigned_to"
            label="Assigned To"
          />
        </div>

        <div className="col-md-12 text-end">
          {mutation.isPending ? (
            <Loading size={"sm"} />
          ) : (
            <button type="submit" className="btn btn-sm btn-outline-success" disabled={!isDirty}>
              {task ? (
                <>
                  <Icon icon="floppy" />
                  save
                </>
              ) : (
                <>
                  <Icon icon="plus-circle" />
                  add
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
