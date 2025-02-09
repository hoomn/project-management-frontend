"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { UserProps } from "@/types";

import Icon from "@/components/ui/icon";

import { Form } from "react-bootstrap";

import FloatingInput from "./floating-input";

type UserFormProps = {
  defaultValues?: UserProps;
  onSubmit: (data: UserProps) => void;
};

export default function UserForm({ defaultValues, onSubmit }: UserFormProps) {
  const {
    formState: { isDirty, errors },
    register,
    handleSubmit,
  } = useForm<UserProps>({ defaultValues });

  return (
    <div className="max-25 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FloatingInput type="email" label="First Name" register={register("first_name")} error={errors.first_name} />
        <FloatingInput type="email" label="Last Name" register={register("last_name")} error={errors.last_name} />
        <div className="mb-4">
          <Form.Check type="switch" label="Notification" id="notification" {...register("email_notification")} />
          <div id={"notification-help"} className="form-text" style={{ marginLeft: "2.5rem" }}>
            Receive email notifications.
          </div>
        </div>
        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-outline-success w-100 mb-2" disabled={!isDirty}>
            {defaultValues ? (
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
          </button>{" "}
          <Link href={"/auth/profile"} className="btn btn-outline-danger w-100">
            never mind
          </Link>
        </div>
      </form>
    </div>
  );
}
