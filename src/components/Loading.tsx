type LoadingProps = {
  size?: null | "sm";
  margin?: 0 | 1 | 2 | 3 | 4 | 5;
};

export default function Loading({ size = null, margin = 3 }: LoadingProps) {
  return (
    <div className="text-center">
      <div
        className={`spinner-border m-${margin} ${
          size ? " spinner-border-sm" : ""
        }`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
