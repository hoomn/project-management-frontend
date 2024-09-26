import { useRouteError } from "react-router-dom";

import Header from "../components/Header";

export default function ErrorBoundary() {
  const error: any = useRouteError();

  return (
    <>
      <Header />
      <div className="container text-center" style={{ maxWidth: "600px" }}>
        <div className=" alert alert-warning p-4 mt-5" id="error-page">
          <h1 className="displa-1">Oops!</h1>
          <p>Sorry, an unexpected error has occurred!</p>
          <h5>{error.status || error.statusText}</h5>
          <h6>{error.data || error.message}</h6>
          {error?.length && (
            <>
              <hr />
              <small>
                <pre>{JSON.stringify(error)}</pre>
              </small>
            </>
          )}
        </div>
      </div>
    </>
  );
}
