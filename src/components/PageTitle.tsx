type PageTitleProps = {
  title: string;
  borderColor?: string;
};

export default function PageTitle({
  title = "PM",
  borderColor = "gray",
}: PageTitleProps) {
  return (
    <div
      className={`d-flex border-bottom border-4 mb-1 mt-5 mb-1 border-${borderColor}`}
    >
      <h1 className="h2 fw-light me-auto">{title}</h1>
    </div>
  );
}
