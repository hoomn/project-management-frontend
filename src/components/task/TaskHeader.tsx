export default function TaskHeader() {
  return (
    <thead>
      <tr className="fst-italic">
        <td className="text-muted">
          <small>Owner</small>
        </td>
        <td className="text-muted">
          <small>Title</small>
        </td>
        <td></td>
        <td className="text-muted">
          <small>Assigned to</small>
        </td>
        <td className="text-muted">
          <small>Start Date</small>
        </td>
        <td className="text-muted">
          <small>End Date</small>
        </td>
        <td className="text-muted">
          <small>Status</small>
        </td>
        <td className="text-muted">
          <small>Priority</small>
        </td>
        <td></td>
      </tr>
    </thead>
  );
}
