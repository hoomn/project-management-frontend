import Link from "next/link";

import { ActivityProps } from "@/types";

import UserAvatar from "@/components/ui/user-avatar";

export default function Activity({ activity }: { activity: ActivityProps }) {
  const title = `${activity.get_action_display}d a ${activity.content_type}`;
  return (
    <div className="d-flex align-items-center border-bottom pb-1 mb-1" key={activity.id}>
      <div className="d-flex text-muted align-items-center me-auto">
        <UserAvatar userId={activity.created_by} me={2} />
        {activity.url ? (
          <Link href={activity.url} className="text-decoration-none">
            {title}
          </Link>
        ) : (
          <em>{title}</em>
        )}
      </div>
      <small className="fst-italic p-2">{activity.time_since_creation}</small>
    </div>
  );
}
