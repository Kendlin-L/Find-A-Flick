import React, { Component } from "react";
import DisplayMovie from "./DisplayMovie";
import "../Upcoming.css";
import { countryCodes } from "../CountryCodes";
import { Form, Container, Button, Row, Col } from "react-bootstrap";
export default class Upcoming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingArray: [],
      baseimageURL: "https://image.tmdb.org/t/p",
      upcomingMoviesURL:
        "https://api.themoviedb.org/3/movie/upcoming?api_key=a48fc5bbf08210f25e7397efb859d4c6",
      imageSize: "w342",
      isFetched: false,
      errorMsg: null,
      countryChosen: "US"
    };
  }

  // display intitial data
  componentDidMount() {
    this.getUpcomingMovieData();
  }

  // fetches upcoming movies from TMDB
  getUpcomingMovieData = async () => {
    // upcomingMoviesURL from state
    const upcomingMoviesURL = this.state.upcomingMoviesURL;
    // try fetch the data
    try {
      const response = await fetch(`${upcomingMoviesURL}&region=US`);
      // wait for a response and convert to Json format and store in data variable
      const data = await response.json();
      this.setState({ upcomingArray: data.results });
      console.log(this.state.upcomingArray);
      this.setState({ isFetched: true });
    } catch (error) {
      this.setState({ isFetched: false });
      this.setState({ errorMsg: error });
    }
  };

  // requesting filtered movie data based on user input
  getFilteredUpcomingMovieData = async (region) => {
    const upcomingMoviesURL = this.state.upcomingMoviesURL;

    try {
      const response = await fetch(`${upcomingMoviesURL}&region=${region}`);
      const data = await response.json();
      this.setState({ upcomingArray: data.results });
      console.log(this.state.upcomingArray);
      this.setState({ isFetched: true });
    } catch (error) {
      this.setState({ isFetched: false });
      this.setState({ errorMsg: error });
    }
  };

  // what happens when the user chooses a counrtry
  handleClickCountry = (event) => {
    this.setState({ countryChosen: event.target.value });
  };

  // when the user clicks filter
  handleClickFilter = (event) => {
    event.preventDefault();
    const region = this.state.countryChosen;
    this.getFilteredUpcomingMovieData(region);
  };

  render() {
    // if there is an error
    if (this.state.errorMsg) {
      return (
        <div>
          <h1>An error has occured</h1>
        </div>
      ); // end of return.
    } else if (this.state.isFetched === false) {
      return (
        <div>
          <h1>Loading please wait...</h1>
        </div>
      ); // end of return
    } else {
      return (
        <Container className="upcomingMovies">
          <Row>
            <Col xs={12} md={4}>
              <h1>Upcoming Movies</h1>
            </Col>
            <Col xs={8} md={8} className="upcoming-drop-down-menu">
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

          <DisplayMovie movieArray={this.state.upcomingArray} />
        </Container>
      );
    }
  }
}
