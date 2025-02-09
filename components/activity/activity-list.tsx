"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { ActivityProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import NoData from "@/components/ui/no-data";

import api from "@/lib/api";

import Activity from "./activity";

type PaginatedResponse = {
  results: ActivityProps[];
  count: number;
  next: number | null;
  previous: number | null;
  number: number;
  num_pages: number;
};

export default function ActivityList() {
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["activities", "page", page],
    queryFn: () => api.get(`/activities/?page=${page}`),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <div className="card">
      <div className="card-body">
        {data?.results.length === 0 && <NoData type="activities" />}
        {data?.results.map((activity: ActivityProps) => <Activity key={activity.id} activity={activity} />)}
        <div className="d-flex align-items-center justify-content-center mt-3">
          <button
            className="btn btn-sm btn-link"
            onClick={() => setPage(data?.previous || 1)}
            disabled={!data?.previous}
          >
            <Icon icon="chevron-left" />
          </button>
          <span>
            page {data?.number} of {data?.num_pages}
          </span>
          <button className="btn btn-sm btn-link" onClick={() => setPage(data?.next || 1)} disabled={!data?.next}>
            <Icon icon="chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
