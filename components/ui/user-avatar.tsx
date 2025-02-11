"use client";

import { useQuery } from "@tanstack/react-query";

import { UserProps } from "@/types";

import api from "@/lib/api";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

type UserAvatarProps = {
  userId: string;
  me?: 0 | 1 | 2 | 3 | 4 | 5;
};

function stringToColor(string: string) {
  const colors = [
    "#3aa8c1",
    "#ab274f",
    "#fb607f",
    "#e23d28",
    "#ed2939",
    "#ffbf00",
    "#ffd700",
    "#f94d00",
    "#3b3c36",
    "#e1a95f",
    "#ffef00",
    "#8db600",
    "#ace1af",
    "#ff004f",
    "#004953",
    "#00bfff",
    "#0d98ba",
    "#7b68ee",
    "#ccccff",
    "#ff2400",
    "#5a4fcf",
    "#72a0c1",
    "#e44d2e",
    "#ff5800",
  ];
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  hash = Math.abs(hash) % colors.length;
  return colors[hash];
}

export default function UserAvatar({ userId, me = 1 }: UserAvatarProps) {
  const {
    isPending,
    isError,
    data: user,
  } = useQuery<UserProps>({
    queryKey: ["users", userId],
    queryFn: () => api.get<UserProps>(`/auth/users/${userId}`),
  });

  if (isPending)
    return (
      <div className={`spinner-border me-${me}`} style={{ height: 28, width: 28 }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );

  if (!userId || isError) {
    return (
      <div className={`avatar text-dark me-${me}`} style={{ backgroundColor: stringToColor("unknown") }}>
        <span>--</span>
      </div>
    );
  }

  const bgColor = stringToColor(user.first_name + user.last_name);

  return (
    <OverlayTrigger
      overlay={
        <Popover id={user.id.toString()}>
          <Popover.Header>
            {user.first_name} {user.last_name}
          </Popover.Header>
          <Popover.Body>{user.email}</Popover.Body>
        </Popover>
      }
    >
      <div
        className={`d-inline-flex justify-content-center align-items-center rounded-circle me-${me}`}
        style={{ width: "2rem", height: "2rem", backgroundColor: bgColor }}
      >
        {user.initials}
      </div>
    </OverlayTrigger>
  );
}
