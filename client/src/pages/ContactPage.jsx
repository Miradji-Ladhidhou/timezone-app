import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const ContactPage = () => {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <h1 className="text-center mb-4">Contactez-nous</h1>
        <p className="text-center text-muted mb-5">
          Une question, un retour ou un souci ? Nous sommes là pour vous répondre rapidement.
        </p>

        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Card className="p-4 shadow-sm border-0">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nom complet</Form.Label>
                  <Form.Control type="text" placeholder="Votre nom" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="exemple@email.com" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Votre message..." />
                </Form.Group>

                <div className="text-center">
                  <Button variant="primary" disabled>
                    Envoyer (non fonctionnel - version de démonstration)
                  </Button>
                </div>
              </Form>
            </Card>

            <div className="text-center mt-4 small text-muted">
              Ou écrivez-nous directement : <a href="mailto:contact@timezone.app">contact@timezone.app</a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
