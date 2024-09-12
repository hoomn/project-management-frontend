// import ProjectDashBox from "../components/project/ProjectDashBox";
// import TaskDashBox from "../components/TaskDashBox";
// import SubtaskDashBox from "../components/SubtaskDashBox";
// import DomainDashBox from "../components/DomainDashBox";
// import Notifications from "../components/Notifications";
import ActivityDashBox from "../components/activity/ActivityDashBox";

export default function Dashboard() {
  return (
    <>
      <div className="mt-4">{/* <Notifications /> */}</div>
      <div className="row row-cols-1 row-cols-lg-2 g-3 mt-2">
        <div className="col">{/* <ProjectDashBox /> */}</div>
        <div className="col">{/* <TaskDashBox /> */}</div>
        <div className="col">{/* <SubtaskDashBox /> */}</div>
        <div className="col">{/* <DomainDashBox /> */}</div>
      </div>
      <div className="row g-3 mt-0">
        <div className="col">
          <ActivityDashBox />
        </div>
      </div>
    </>
  );
}
