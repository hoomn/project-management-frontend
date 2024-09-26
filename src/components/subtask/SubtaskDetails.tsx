import DateTime from "../DateTime";
import Description from "../Description";
import Priority from "../Priority";
import Status from "../Status";
import UserAvatarList from "../user/UserAvatarList";

export default function subtaskDetails({ subtask }: { subtask: SubtaskProps }) {
  return (
    <div className="row mt-5">
      <div className="col-md-12">
        <p className="text-muted fst-italic fw-light mb-0">Title:</p>
        <div className="mb-4">{subtask.title}</div>
      </div>
      <div className="col-md-12 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Description:</p>
        <Description content={subtask.description} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Start Date:</p>
        <DateTime dateString={subtask.start_date} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">End Date:</p>
        <DateTime dateString={subtask.end_date} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Status:</p>
        <Status level={subtask.status} description={subtask.get_status_display} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Priority:</p>
        <Priority level={subtask.priority} description={subtask.get_priority_display} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-1 me-1">Assigned to:</p>
        <UserAvatarList userIds={subtask.assigned_to} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-1 me-1">Owner:</p>
        <UserAvatarList userIds={[subtask.created_by]} />
      </div>
      <div className="col-md-12 d-flex">
        <small className="fst-italic fw-light mb-0 text-muted me-auto">Created at: {subtask.created_at}</small>
        <small className="fst-italic fw-light mb-0 text-muted">Modified at: {subtask.updated_at}</small>
      </div>
    </div>
  );
}
