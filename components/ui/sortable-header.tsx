import { SortableColumn } from "@/types";

type SortableHeaderProps = {
  sortField: string;
  sortOrder: string;
  onSort: (field: string) => void;
  columns: SortableColumn[];
};

export default function SortableHeader({ sortField, sortOrder, onSort, columns }: SortableHeaderProps) {
  return (
    <thead>
      <tr className="fst-italic">
        {columns.map((column) => (
          <td
            key={column.key}
            className={`text-muted ${column.sortable ? "hoverable" : ""}`}
            onClick={() => column.sortable && onSort(column.key)}
          >
            <div className="d-flex align-items-center gap-1">
              <small>{column.label}</small>
              {column.sortable && column.key === sortField && (sortOrder === "asc" ? " ↑" : " ↓")}
            </div>
          </td>
        ))}
      </tr>
    </thead>
  );
}
