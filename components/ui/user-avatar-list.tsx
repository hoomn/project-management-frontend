import UserAvatar from "./user-avatar";

type UserAvatarList = {
  userIds: string[];
};

export default function UserAvatarList({ userIds }: UserAvatarList) {
  return <div className="d-flex">{userIds?.map((userId) => <UserAvatar key={userId} userId={userId} />)}</div>;
}
