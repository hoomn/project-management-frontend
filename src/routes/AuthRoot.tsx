import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Header from "../components/Header";
import Loading from "../components/Loading";
import Version from "../components/Version";

export default function AuthRoot() {
  return (
    <>
      <Header />
      <div className="container" id="main-content">
        <div className="mx-auto mt-5" style={{ maxWidth: "24rem" }}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
          <div className="text-center">
            <Version />
          </div>
        </div>
      </div>
    </>
  );
}
