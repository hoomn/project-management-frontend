import FormLabel from "@/components/form/form-label";
import Icon from "@/components/ui/icon";

type ProjectFilterProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProjectFilter({ searchTerm, setSearchTerm, handleSearchChange }: ProjectFilterProps) {
  return (
    <div className="row g-3 bg-secondary-subtle pb-3 mt-2 mb-4">
      <div className="col-md-3">
        <FormLabel label="Search" htmlFor="search" />
        <input
          type="search"
          id="search"
          placeholder="search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
          autoComplete="off"
        />
      </div>
      <div className="col d-flex justify-content-end align-items-end">
        <div>
          <button className="btn btn-outline-dark" onClick={() => setSearchTerm("")}>
            <Icon icon="arrow-clockwise" me={0} />
          </button>
        </div>
      </div>
    </div>
  );
}
