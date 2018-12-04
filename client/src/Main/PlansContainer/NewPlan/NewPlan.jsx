import React from 'react';
import {Col, Row, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const NewPlan = (props) => {
        return(
            <Row className="justify-content-center">
                <Col sm="8">
                    {JSON.stringify(props.errors) === "{}" ? null : <p>{JSON.stringify(props.errors)}</p> }
                    <Form onSubmit={props.createPlan} >
                        <FormGroup>
                        <Label for="title">Title</Label>
                        <Input onChange={props.handleChange} type="text" name="title" id="newPlanTitle" placeholder="Title" />
                        </FormGroup>
                        <FormGroup>
                        <Label for="date">Date</Label>
                        <Input onChange={props.handleChange} type="datetime-local" name="date" id="newPlanDate" />
                        </FormGroup>
                        <FormGroup>
                        <Label for="exampleText">Description</Label>
                        <Input onChange={props.handleChange} type="textarea" name="description" id="newPlanDescription" />
                        </FormGroup>
                        <Button>Submit</Button>
                    </Form>
                </Col>
            </Row>
        )
}
export default NewPlan