import React, { Component } from "react";
import "../Home.css";
import { languageData } from "../LanguageData";
import { yearData } from "../YearData";
import { Button, Card } from "react-bootstrap";
import { Form, FormControl, Container, Row, Col } from "react-bootstrap";
import DisplayMovie from "./DisplayMovie";
import Filter from "./Filter";
import Sort from "./Sort";

export default class Home extends Component {
  constructor(props) {
    super(props);
    // some state variables
    this.state = {
      movieArray: [],
      genreArray: [],
      genreChosen: 28,
      genreCheck: false,
      ratingChosen: 5,
      yearChosen: 2020,
      languageChosen: "en",
      showFilters: false,
      showSorts: false,
      searchTerm: "",
      sortChosen: "popularity.desc",
      discoverMoviesURL:
        "https://api.themoviedb.org/3/discover/movie?api_key=a48fc5bbf08210f25e7397efb859d4c6",
      searchMoviesURL:
        "https://api.themoviedb.org/3/search/movie?api_key=a48fc5bbf08210f25e7397efb859d4c6",
      isFetched: false,
      errorMsg: null
    };
  }

  //this will display the inital data returned from the
  //getMovieData()when the component mounts
  componentDidMount() {
    this.getMovieData();
    this.getGenreData();
  }

  //this function fetches movie data from the API
  getMovieData = async () => {
    const discoverMoviesURL = this.state.discoverMoviesURL;
    // try fetch movie data
    try {
      const response = await fetch(
        `${discoverMoviesURL}&sort_by=popularity.desc`
      );
      // wait for response and convert to Json format
      //and store in data variable
      const data = await response.json();
      // set movieArray to contain results from request
      this.setState({ movieArray: data.results });
      // if fetch is successful
      this.setState({ isFetched: true });
      //catch error if occurs
    } catch (error) {
      // if fetch is not successful
      this.setState({ isFetched: false });
      this.setState({ errorMsg: error });
      console.log(this.state.moviesArray);
    }
  };
  //========================== this function fetches genre data from the API
  getGenreData = async () => {
    const genreURL =
      "https://api.themoviedb.org/3/genre/movie/list?api_key=a48fc5bbf08210f25e7397efb859d4c6";
    // try fetch the data
    try {
      const response = await fetch(genreURL); // fetch genres
      const data = await response.json(); // wait for a response and convert to Json format and store in data variable
      this.setState({ genreArray: data.genres }); // set the state of genresArray to the data returned from fetch
      this.setState({ isFetched: true }); // if fetch is successful
      console.log(this.state.genresArray); // log genres to console
      // catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  //===================== this function takes the values chosen by the user (passed from handleClickSearch())
  // and makes an API request appending the values to the URL and returning filtered results
  getFilteredMovieData = async (genreID, rating, language, year, sortBy) => {
    const discoverMoviesURL = this.state.discoverMoviesURL;
    // try fetch movie data
    try {
      const response = await fetch(
        `${discoverMoviesURL}&with_genres=${genreID}&vote_average.gte=${rating}&with_original_language=${language}&primary_release_year=${year}&sort_by=${sortBy}`
      );
      // wait for a response and convert to Json format and store in data variable
      const data = await response.json();
      // set movieArray to contain filtered results from request
      this.setState({ movieArray: data.results });
      this.setState({ isFetched: true }); // if fetch is successful
      window.scrollTo(0, 0); //  scroll to top of page after fetching data
      console.log(this.state.movieArray);
      // catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // ================== this function takes the query passed from handleClickSearchMovie() and
  // appends the query to the api request to return results containing that query
  getSearchMovieData = async (query) => {
    const searchMoviesURL = this.state.searchMoviesURL;
    try {
      const response = await fetch(`${searchMoviesURL}&query=${query}`);
      const data = await response.json(); // wait for a response and convert to Json format and store in data variable
      this.setState({ movieArray: data.results }); // set movieArray to contain filtered results from request
      this.setState({ isFetched: true }); // if fetch is successful
      console.log(this.state.movieArray);
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // ============ this is what happens when the user enters text into the search box
  handleOnChangeSearch = (event) => {
    event.preventDefault();
    this.setState({ searchTerm: event.target.value });
  };

  // =============== this is what happens when the search button is clicked
  // here we make a call to getSearchMovieData() and pass the query enter in the serach box
  handleClickSearchMovie = (event) => {
    event.preventDefault();
    const query = encodeURI(this.state.searchTerm);
    this.getSearchMovieData(query);
  };

  // when the search button is clicked this function calls
  // the getFilteredMovieData()
  // and passes the values chosen by the user to this function
  // where an API request will be made with these values
  handleClickSearch = () => {
    const genreID = this.state.genreChosen;
    const rating = this.state.ratingChosen;
    const language = this.state.languageChosen;
    const year = this.state.yearChosen;
    const sortBy = this.state.sortChosen;
    this.getFilteredMovieData(genreID, rating, language, year, sortBy);
  };

  //============================= sets the genre chosen by user
  handleClickGenre = (event) => {
    this.setState({ genreChosen: event.target.value });
  };

  //=============================== sets the rating chosen by user
  handleChangeRating = (event) => {
    this.setState({ ratingChosen: event.target.value });
  };

  //================================ sets the language chosen by user
  handleClickLanguage = (event) => {
    this.setState({ languageChosen: event.target.value });
  };

  //============================ sets the year chosen by user
  handleClickYear = (event) => {
    this.setState({ yearChosen: event.target.value });
  };

  //============================== sets the sort chosen by user
  handleClickSortBy = (event) => {
    this.setState({ sortChosen: event.target.value });
  };

  // show filters when clicked
  showFilters = () => {
    this.setState({ showFilters: true });
    if (this.state.showFilters) this.setState({ showFilters: false });
  };

  // show sort when clicked
  showSorts = () => {
    this.setState({ showSorts: true });
    if (this.state.showSorts) this.setState({ showSorts: false });
  };

  render() {
    // if there is an error
    if (this.state.errorMsg) {
      return (
        <div>
          <h3>An error has occured</h3>
        </div>
      ); // end of return.
    } else if (this.state.isFetched === false) {
      return (
        <div>
          <h3>Loading please wait...</h3>
        </div>
      ); // end of return
    } else {
      // we have no errors and we have data
      return (
        <Container className="home-page">
          <h1>Discover Movies</h1>
          <Row>
            <Col xs={12} md={4} className="filter-and-sort-col">
              <Form>
                <FormControl
                  type="text"
                  value={this.state.searchTerm}
                  placeholder="Search"
                  className="mr-sm-2"
                  onChange={this.handleOnChangeSearch}
                />
                <Button
                  variant="primary"
                  type="submit"
                  onClick={this.handleClickSearchMovie}
                  disabled={!this.state.searchTerm}
                  block
                >
                  Search
                </Button>
              </Form>
              <br />
              <Button onClick={this.showFilters} block>
                Filters
              </Button>
              {this.state.showFilters && (
                <Card bg="light">
                  <Card.Header as="h5">Filters</Card.Header>
                  <Card.Body>
                    <Filter
                      genreArray={this.state.genreArray}
                      genreChosen={this.state.genreChosen}
                      handleClickGenre={this.handleClickGenre}
                      ratingChosen={this.state.ratingChosen}
                      handleChangeRating={this.handleChangeRating}
                      languageData={languageData}
                      languageChosen={this.state.languageChosen}
                      handleClickLanguage={this.handleClickLanguage}
                      yearData={yearData}
                      yearChosen={this.state.yearChosen}
                      handleClickYear={this.handleClickYear}
                    />
                  </Card.Body>
                </Card>
              )}

              <Button onClick={this.showSorts} block>
                Sort
              </Button>
              {this.state.showSorts && (
                <Card bg="light">
                  <Card.Header as="h5">Sort</Card.Header>
                  <Card.Body>
                    <Sort
                      sortChosen={this.state.sortChosen}
                      handleClickSortBy={this.handleClickSortBy}
                    />
                  </Card.Body>
                </Card>
              )}

              <Button variant="primary" onClick={this.handleClickSearch} block>
                Search
              </Button>
              <br />
            </Col>
            <Col xs={12} md={8} className="display-movies-col">
              <DisplayMovie movieArray={this.state.movieArray} />
            </Col>
          </Row>
        </Container>
      ); // end of return()
    } // end of the else statement.
  } // end of render()
} // end of App class
