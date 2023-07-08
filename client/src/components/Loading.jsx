import { Modal, Spinner, Row, Col } from "react-bootstrap";

function Loading() {
  return (
    <Modal
      show={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Row>
          <Col>
            <p className="text-center fs-2">Caricamento... </p>
          </Col>
          <Col>
            <Spinner animation="border" role="status" />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
export default Loading;
