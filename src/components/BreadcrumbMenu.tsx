import PageTitle from "./PageTitle";
import { MenuItem } from "./Menu";

import Menu from "./Menu";

type BreadcrumbMenuProps = {
  title: string;
  items?: MenuItem[];
  borderColor?: string;
};

export default function BreadcrumbMenu({
  title,
  items = [],
  borderColor = "gray",
}: BreadcrumbMenuProps) {
  return (
    <>
      <PageTitle title={title} borderColor={borderColor} />
      <div className="d-flex">
        <div className="flex-grow-1">
          <div className="my-3 py-3"></div>
        </div>
        <div className="">{items.length !== 0 && <Menu items={items} />}</div>
      </div>
    </>
  );
}
