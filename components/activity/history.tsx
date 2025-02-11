import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { ActivityProps } from "@/types";

import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";

import api from "@/lib/api";

import { Alert, Button, Modal } from "react-bootstrap";

import HistoryItem from "./history-item";

type HistoryComponentProps = {
  contentType: string;
  objectId: string;
};

export default function History({ contentType, objectId }: HistoryComponentProps) {
  const [showModal, setShowModal] = useState(false);

  const { data, isPending, isError, error } = useQuery<ActivityProps[]>({
    queryKey: ["activities", contentType, objectId],
    queryFn: () => api.get("/activities/", { content_type: contentType, object_id: objectId }),
    enabled: showModal,
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <button className="btn btn-outline-secondary" onClick={handleShowModal}>
        <Icon icon={"clock-history"} me={0} />
      </button>
      <Modal show={showModal} size="lg" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Icon icon={"clock-history"} />
            Activity History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isPending ? (
            <Loading />
          ) : isError ? (
            <Alert variant={"danger"}>Error: {error.message}</Alert>
          ) : data.length > 0 ? (
            data.map((activity: ActivityProps, index: number) => (
              <div key={activity.id}>
                <HistoryItem activity={activity} />
                {index < data.length - 1 && <hr className="mx-2" />}
              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-muted fst-italic my-3">no activities</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
