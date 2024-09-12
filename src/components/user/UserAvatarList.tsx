import UserAvatar from "./UserAvatar";

type UserAvatarList = {
  userIds: number[];
};

export default function UserAvatarList({ userIds }: UserAvatarList) {
  return <div className="d-flex">{userIds?.map((userId) => <UserAvatar key={userId} userId={userId} />)}</div>;
}
