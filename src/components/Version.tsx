import { useQuery } from "@tanstack/react-query";

import { Alert } from "react-bootstrap";

import Loading from "./Loading";

import { fetchVersion } from "../api/endpoints";

export default function Version() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["version"],
    queryFn: fetchVersion,
    staleTime: Infinity,
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return <small className="text-muted fst-italic">version: {data.version}</small>;
}
