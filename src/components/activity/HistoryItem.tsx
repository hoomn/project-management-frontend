import UserAvatar from "../user/UserAvatar";
import Icon from "../Icon";

export default function HistoryItem({ activity }: { activity: ActivityProps }) {
  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div>
          <UserAvatar userId={activity.created_by} />
        </div>
        <p className="me-auto mb-0">{activity.get_action_display}</p>
        <small>{activity.time_since_creation}</small>
      </div>

      {activity.description?.map((description: ActivityDescriptionProps, index: number) => (
        <ul key={index}>
          {Array.isArray(description.new_value) && Array.isArray(description.old_value) ? (
            <>
              <li className="text-muted">{description.verbose_name}</li>
              <ul className="mb-0">
                {description.new_value.map((item: string, index: number) => (
                  <li key={`new-${index}`}>
                    <span className="bg-success-subtle text-success">[+] {item}</span>
                  </li>
                ))}
                {description.old_value.map((item: string, index: number) => (
                  <li key={`old-${index}`}>
                    <span className="bg-danger-subtle text-danger">[-] {item}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <li className="text-muted">
              {description.verbose_name}:
              <span className="bg-danger-subtle text-danger ms-2">[-] {description.old_value}</span>
              <Icon icon="arrow-right-short" ms={2} me={2} />
              <span className="bg-success-subtle text-success">[+] {description.new_value}</span>
            </li>
          )}
        </ul>
      ))}
    </div>
  );
}
