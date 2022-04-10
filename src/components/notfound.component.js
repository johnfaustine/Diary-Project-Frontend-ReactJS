import React from "react";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default NotFound;

function NotFound() {
    return (
        <Jumbotron className="bg-transparent jumbotron-fluid p-o">
            <Container fluid={true}>
                <Row className="justify-content-center py-5">
                    <Col md={8} sm={12}>
                        <h1 className="display-1 font-weight-bolder">404 Not Found</h1>
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    );

}