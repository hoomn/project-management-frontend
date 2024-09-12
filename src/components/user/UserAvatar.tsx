import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { UserProps } from "../../types";

import { fetchUsers } from "../../api/user";
import Loading from "../Loading";

type UserAvatarProps = {
  userId: number;
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

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  /* eslint-enable no-bitwise */
  hash = Math.abs(hash) % colors.length;
  return colors[hash];
}

export default function UserAvatar({ userId, me = 1 }: UserAvatarProps) {
  const authHeader: string = useAuthHeader() || "";

  const {
    isPending,
    isError,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(authHeader),
  });

  if (isPending)
    return (
      <div style={{ height: 29, width: 29 }}>
        <Loading size={"sm"} />
      </div>
    );

  if (!userId || isError) {
    return (
      <div className={`avatar text-dark me-${me}`} style={{ backgroundColor: stringToColor("unknown") }}>
        <span>--</span>
      </div>
    );
  }

  const user = users.find((user: UserProps) => user.id === userId);

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
        className={`avatar text-dark me-${me}`}
        style={{ backgroundColor: stringToColor(user.first_name + user.last_name), cursor: "pointer" }}
      >
        <span>{user.initial}</span>
      </div>
    </OverlayTrigger>
  );
}
