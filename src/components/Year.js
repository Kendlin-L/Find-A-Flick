import React, { Component } from "react";
import { Form } from "react-bootstrap";
export default class Year extends Component {
  render() {
    // values passed as props
    const yearData = this.props.yearData;
    const handleClickYear = this.props.handleClickYear;
    const yearChosen = this.props.yearChosen;
    // here we are displaying a drop down menu with different year options for the user
    return (
      <Form>
        <Form.Label htmlFor="year">
          <b>Year of Release</b>
        </Form.Label>
        <br />
        <Form.Control
          as="select"
          name="year"
          id="year"
          onClick={handleClickYear}
          custom
        >
          {yearData.map((year, index) => (
            <option key={index} value={year.year}>
              {year.year}
            </option>
          ))}
        </Form.Control>
      </Form>
    );
  }
}
