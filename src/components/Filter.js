import React, { Component } from "react";
import Genre from "./Genre";
import Rating from "./Rating";
import Language from "./Language";
import Year from "./Year";

export default class Filter extends Component {
  render() {
    // values passed as props
    const genreArray = this.props.genreArray;
    const genreChosen = this.props.genreChosen;
    const handleClickGenre = this.props.handleClickGenre;
    const ratingChosen = this.props.ratingChosen;
    const handleChangeRating = this.props.handleChangeRating;
    const languageData = this.props.languageData;
    const languageChosen = this.props.languageChosen;
    const handleClickLanguage = this.props.handleClickLanguage;
    const yearData = this.props.yearData;
    const handleClickYear = this.props.handleClickYear;
    const yearChosen = this.props.yearChosen;
    return (
      <div className="filterForm">
        <Genre
          genreArray={genreArray}
          genreChosen={genreChosen}
          handleClickGenre={handleClickGenre}
        />
        <br />
        <Rating
          ratingChosen={ratingChosen}
          handleChangeRating={handleChangeRating}
        />
        <br />
        <Language
          languageData={languageData}
          languageChosen={languageChosen}
          handleClickLanguage={handleClickLanguage}
        />
        <br />
        <Year
          yearData={yearData}
          yearChosen={yearChosen}
          handleClickYear={handleClickYear}
        />
        <br />
      </div>
    );
  }
}
