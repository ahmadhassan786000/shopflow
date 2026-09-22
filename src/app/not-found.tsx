import { Container, Button } from "react-bootstrap";

export default function NotFound() {
  return (
    <Container className="py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <h1 className="display-3 fw-bold text-primary">404</h1>
      <p className="h5 mb-4">We couldn&apos;t find the page you&apos;re looking for.</p>
      <Button href="/" variant="primary">Back to Home</Button>
    </Container>
  );
}
