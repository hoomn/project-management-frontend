export default function Loading() {
  return (
    <div className="progress fixed-top" style={{ top: "65px", height: "5px" }}>
      <div
        className="progress-bar bg-danger progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: "100%" }}
      ></div>
    </div>
  );
}
