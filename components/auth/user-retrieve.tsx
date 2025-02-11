"use client";

import React from "react";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { UserProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";

import api from "@/lib/api";

import { FloatingLabel, Form } from "react-bootstrap";

export default function UserRetrieve() {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => api.get<UserProps>("/auth/users/me"),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      <FloatingLabel label="Email Address" className="mb-2">
        <Form.Control type="text" placeholder="Email Address" value={user?.email} disabled />
      </FloatingLabel>
      <FloatingLabel label="First Name" className="mb-2">
        <Form.Control type="text" placeholder="First Name" value={user?.first_name} disabled />
      </FloatingLabel>
      <FloatingLabel label="Last Name" className="mb-2">
        <Form.Control type="text" placeholder="Last Name" value={user?.last_name} disabled />
      </FloatingLabel>
      <div className="mb-4">
        <Form.Check type="switch" label="Notification" checked={user?.email_notification} disabled />
        <div className="form-text" style={{ marginLeft: "2.5rem" }}>
          Receive email notifications.
        </div>
      </div>
      <Link href="/auth/profile/update" className="btn btn-outline-secondary w-100 mb-2">
        Update profile
      </Link>
      <Link href="/auth/password/update" className="btn btn-outline-secondary w-100">
        Change password
      </Link>
    </>
  );
}
