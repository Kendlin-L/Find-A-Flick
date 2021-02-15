import React, { Component } from "react";
import DisplayMovie from "./DisplayMovie";
import "../TopRated.css";
import { countryCodes } from "../CountryCodes";
import { Form, Container, Button, Row, Col } from "react-bootstrap";
export default class extends Component {
  constructor(props) {
    super(props);
    // some state variables
    this.state = {
      topRatedArray: [],
      baseImageURL: "https://image.tmdb.org/t/p",
      TopRatedURL:
        "https://api.themoviedb.org/3/movie/top_rated?api_key=a48fc5bbf08210f25e7397efb859d4c6&language=en-US&page=1"
    };
  }

  //====================== this will display the inital data returned from the
  //getMovieData() function and the getGenreData() function when the component mounts
  componentDidMount() {
    this.getTopRatedMovieData();
  }

  //========================== this function fetches movie data from the API
  getTopRatedMovieData = async () => {
    const TopRatedURL = this.state.TopRatedURL;
    // try fetch movie data
    try {
      const response = await fetch(`${TopRatedURL}`);
      const data = await response.json(); // wait for response and convert to Json format and store in data variable
      this.setState({ topRatedArray: data.results }); // set movieArray to contain results from request
      console.log(this.state.topRatedArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // fetches filtered top rated movies by region
  getFilteredTopRatedMovieData = async (region) => {
    const TopRatedURL = this.state.TopRatedURL;
    // try fetch movie data
    try {
      const response = await fetch(`${TopRatedURL}&region=${region}`);
      const data = await response.json(); // wait for response and convert to Json format and store in data variable
      this.setState({ topRatedArray: data.results }); // set movieArray to contain results from request
      console.log(this.state.topRatedArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // when user clicks country
  handleClickCountry = (event) => {
    this.setState({ countryChosen: event.target.value });
  };

  // when user clicks filter
  handleClickFilter = (event) => {
    event.preventDefault();
    const region = this.state.countryChosen;
    this.getFilteredTopRatedMovieData(region);
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
      return (
        <Container className="topRatedMovies">
          <Row>
            <Col xs={12} md={4}>
              <h1>Top Rated Movies</h1>
            </Col>
            <Col xs={8} md={8} className="toprated-drop-down-menu">
              <Form inline>
                <Form.Label htmlFor="region" className="country">
                  <b>Country</b>
                </Form.Label>
                <br />
                <Form.Control
                  as="select"
                  name="region"
                  id="region"
                  onClick={this.handleClickCountry}
                  custom
                  className="mr-sm-2"
                >
                  {countryCodes.map((country, index) => (
                    <option key={index} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Form.Control>
                <Button
                  variant="outline-primary"
                  type="submit"
                  onClick={this.handleClickFilter}
                >
                  Filter
                </Button>
              </Form>
              <br />
            </Col>
          </Row>
          <DisplayMovie movieArray={this.state.topRatedArray} />
        </Container>
      );
    }
  }
}
