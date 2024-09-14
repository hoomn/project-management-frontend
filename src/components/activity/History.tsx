import { Modal, Button, Alert } from "react-bootstrap";
import Icon from "../Icon";
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { fetchActivities } from "../../api/activity";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";
import HistoryItem from "./HistoryItem";

type HistoryComponentProps = {
  contentType: number;
  objectId: number;
};

export default function History({ contentType, objectId }: HistoryComponentProps) {
  const [showModal, setShowModal] = useState(false);

  const authHeader: string = useAuthHeader() || "";

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["activities", contentType, objectId],
    queryFn: () => fetchActivities(authHeader, contentType, objectId),
    enabled: showModal,
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <button className="btn btn-sm btn-outline-dark" onClick={handleShowModal}>
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
