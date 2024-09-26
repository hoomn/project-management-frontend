import { Link } from "react-router-dom";

export type Path = {
  name: string;
  url: string;
};

type BreadcrumbProps = {
  paths: Path[];
};

export default function Breadcrumb({ paths }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {paths.map((path, index) => (
          <li key={index} className={`breadcrumb-item${index === paths.length - 1 ? " active" : ""}`}>
            {index === paths.length - 1 ? path.name : <Link to={path.url}>{path.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
