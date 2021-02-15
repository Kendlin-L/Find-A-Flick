import React, { Component } from "react";
import { Form } from "react-bootstrap";
export default class Genre extends Component {
  render() {
    // values passed as props
    const genreArray = this.props.genreArray;
    const genreChosen = this.props.genreChosen;
    const handleClickGenre = this.props.handleClickGenre;

    // here we are displaying the genre options available to the user as radio buttons
    return (
      <Form>
        <Form.Label>
          <b>Genres</b>
        </Form.Label>
        <br />
        {genreArray.map((genre) => (
          <Form.Check
            key={genre.id}
            type="radio"
            label={genre.name}
            id="genre"
            name="genre"
            value={genre.id}
            onClick={handleClickGenre}
            inline
          />
        ))}
        <br />
      </Form>
    );
  }
}
