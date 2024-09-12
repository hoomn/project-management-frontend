import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import BreadcrumbMenu from "../components/BreadcrumbMenu";

import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { fetchUser } from "../api/user";
import UserDetails from "../components/user/UserDetails";
import UserForm from "../components/user/UserForm";

export default function Profile() {
  const authHeader: string = useAuthHeader() || "";
  const currentUser: any = useAuthUser();

  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get("view") || "view";

  const {
    isPending,
    isError,
    data: user,
    error,
  } = useQuery({
    queryKey: ["users", currentUser.id],
    queryFn: () => fetchUser(authHeader, currentUser.id),
  });

  if (isPending) return <Loading />;
  if (isError) throw new Response(error.message);

  function handleViewToggle(view: string) {
    setSearchParams((prev) => {
      prev.set("view", view);
      return prev;
    });
  }

  return (
    <div>
      <BreadcrumbMenu title="Profile" />
      <div className="text-end">
        {view === "view" ? (
          <button className="btn btn-sm btn-outline-dark" onClick={() => handleViewToggle("update")}>
            <Icon icon={"pencil-square"} />
            update
          </button>
        ) : (
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleViewToggle("view")}>
            <Icon icon="arrow-counterclockwise" />
            never mind
          </button>
        )}
      </div>
      <div className="mx-auto" style={{ maxWidth: 500 }}>
        {view === "view" && <UserDetails user={user} />}
        {view === "update" && <UserForm user={user} />}
        {/* {user.has_usable_password ? <button>update my password</button> : <button>set password</button>} */}
      </div>
    </div>
  );
}
