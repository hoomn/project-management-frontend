import Icon from "../Icon";

export default function UserDetails({ user }: { user: UserProps }) {
  return (
    <div>
      <p className="text-muted fst-italic fw-light mb-0">Email:</p>
      <div className="mb-4">{user.email}</div>
      <p className="text-muted fst-italic fw-light mb-0">First Name:</p>
      <div className="mb-4">{user.first_name}</div>
      <p className="text-muted fst-italic fw-light mb-0">Last Name:</p>
      <div className="mb-4">{user.last_name}</div>
      <p className="text-muted fst-italic fw-light mb-0">Notifications:</p>
      <div className="mb-4">
        {user.notification ? (
          <h3>
            <Icon icon="toggle-on" color="text-primary" />
          </h3>
        ) : (
          <h3>
            <Icon icon="toggle-off" color="text-secondary" />
          </h3>
        )}
      </div>
    </div>
  );
}
