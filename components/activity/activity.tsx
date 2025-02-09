import Link from "next/link";

import { ActivityProps } from "@/types";

import UserAvatar from "@/components/ui/user-avatar";

export default function Activity({ activity }: { activity: ActivityProps }) {
  return (
    <div className="d-flex align-items-center border-bottom pb-1 mb-1" key={activity.id}>
      <div className="d-flex text-muted align-items-center me-auto">
        <UserAvatar userId={activity.created_by} />
        <Link href={`/${activity.content_type}s/${activity.object_id}`} className="text-decoration-none ms-1">
          {activity.get_action_display}d a {activity.content_type}
        </Link>
      </div>
      <small className="fst-italic p-2">{activity.time_since_creation}</small>
    </div>
  );
}
