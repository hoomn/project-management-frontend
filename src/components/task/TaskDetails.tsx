import DateTime from "../DateTime";
import Description from "../Description";
import Priority from "../Priority";
import Status from "../Status";
import UserAvatarList from "../user/UserAvatarList";

export default function taskDetails({ task }: { task: TaskProps }) {
  return (
    <div className="row">
      <div className="col-md-12">
        <p className="text-muted fst-italic fw-light mb-0">Title:</p>
        <div className="mb-4">{task.title}</div>
      </div>
      <div className="col-md-12 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Description:</p>
        <Description content={task.description} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Start Date:</p>
        <DateTime dateString={task.start_date} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">End Date:</p>
        <DateTime dateString={task.end_date} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Status:</p>
        <Status level={task.status} description={task.get_status_display} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Priority:</p>
        <Priority level={task.priority} description={task.get_priority_display} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-1 me-1">Assigned to:</p>
        <UserAvatarList userIds={task.assigned_to} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-1 me-1">Owner:</p>
        <UserAvatarList userIds={[task.created_by]} />
      </div>
      <div className="col-md-12 d-flex">
        <small className="fst-italic fw-light mb-0 text-muted me-auto">Created {task.time_since_creation}</small>
        <small className="fst-italic fw-light mb-0 text-muted">Last modified {task.time_since_update}</small>
      </div>
    </div>
  );
}
