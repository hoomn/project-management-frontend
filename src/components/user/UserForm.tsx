import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Icon from "../Icon";

import { updateUser } from "../../api/user";
import Loading from "../Loading";

export default function UserForm({ user }: { user: UserProps }) {
  const authHeader: string = useAuthHeader() || "";

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser: UserProps) => updateUser(authHeader, updatedUser),
    onSuccess: () => {
      // Invalidate every query with a key that starts with `users`
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/profile?view=view");
    },
  });

  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
  } = useForm<UserProps>({ defaultValues: user });

  const onSubmit: SubmitHandler<UserProps> = (data) => mutation.mutate(data);

  return (
    <>
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title" className="form-label">
          Email:
        </label>
        <input {...register("email")} readOnly disabled className="form-control" />

        <label htmlFor="first_name" className="form-label mt-2">
          First Name:
        </label>
        <input
          {...register("first_name", {
            required: "* First Name is required.",
            maxLength: 150,
          })}
          className="form-control"
        />
        {errors.first_name && <p className="alert alert-danger mb-0 p-2">{errors.first_name?.message}</p>}

        <label htmlFor="last_name" className="form-label mt-2">
          Last Name:
        </label>
        <input
          {...register("last_name", {
            required: "* Last Name is required.",
            maxLength: 150,
          })}
          className="form-control"
        />
        {errors.last_name && <p className="alert alert-danger mb-0 p-2">{errors.last_name?.message}</p>}

        <div className="form-check form-switch my-4">
          <label className="form-check-label" htmlFor="notification">
            Notifications
          </label>
          <input {...register("notification")} id="notification" type="checkbox" className="form-check-input" />
        </div>
        <div className="col-md-12 text-end">
          {mutation.isPending ? (
            <Loading size={"sm"} />
          ) : (
            <button type="submit" className="btn btn-sm btn-outline-success" disabled={!isDirty}>
              <Icon icon="floppy" />
              save
            </button>
          )}
        </div>
      </form>
    </>
  );
}
