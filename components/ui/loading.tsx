type LoadingProps = {
  margin?: 0 | 1 | 2 | 3 | 4 | 5;
};

export default function Loading({ margin = 3 }: LoadingProps) {
  return (
    <div className={`text-center m-${margin}`}>
      <div className="spinner-grow spinner-grow-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow spinner-grow-sm mx-1" style={{ animationDelay: ".1s" }}></div>
      <div className="spinner-grow spinner-grow-sm" style={{ animationDelay: ".2s" }}></div>
    </div>
  );
}
