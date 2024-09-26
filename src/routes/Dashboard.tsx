import ActivityDashBox from "../components/activity/ActivityDashBox";
import Notifications from "../components/notification/Notifications";

export default function Dashboard() {
  return (
    <>
      <div className="mt-4">
        <Notifications />
      </div>
      <div className="mt-3">
        <ActivityDashBox />
      </div>
    </>
  );
}
