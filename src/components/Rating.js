import React, { Component } from "react";
import { Form } from "react-bootstrap";

export default class Rating extends Component {
  render() {
    // values passed as props
    const ratingChosen = this.props.ratingChosen;
    const handleChangeRating = this.props.handleChangeRating;
    // here we are displaying a range slider where the user can choose a minimum rating
    return (
      <Form>
        <Form.Label>
          <b>Minimum Rating</b> {ratingChosen}
        </Form.Label>
        <Form.Control
          type="range"
          min={1}
          max={10}
          value={ratingChosen}
          className="slider"
          onChange={handleChangeRating}
          custom
        ></Form.Control>
      </Form>
    );
  }
}
