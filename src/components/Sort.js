import React, { Component } from "react";
import { Form } from "react-bootstrap";
export default class Sort extends Component {
  render() {
    // values from props
    const sortChosen = this.props.sortChosen;
    const handleClickSortBy = this.props.handleClickSortBy;
    return (
      <Form>
        <Form.Label for="sort">
          <b>Sort By</b>
        </Form.Label>
        <Form.Control
          as="select"
          name="sort"
          id="sort"
          onClick={handleClickSortBy}
          custom
        >
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
        </Form.Control>
      </Form>
    );
  }
}
