import React, { Component } from "react";
import DisplayMovie from "./DisplayMovie";
import "../Popular.css";
import { countryCodes } from "../CountryCodes";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
export default class Popular extends Component {
  state = {
    popularMoviesArray: [],
    poularMoviesURL: "https://api.themoviedb.org/3/movie/popular?",
    API_KEY: "api_key=a48fc5bbf08210f25e7397efb859d4c6",
    countryChosen: "IE"
  };

  componentDidMount() {
    this.getPopularMoviesData();
  }

  // fetches popular movie data from TMDB
  getPopularMoviesData = async () => {
    //const popularMoviesUrl = this.state.popularMoviesUrl;
    // const API_KEY = this.state.API_KEY;
    // try fetch movie data
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=a48fc5bbf08210f25e7397efb859d4c6"
      );
      const data = await response.json(); // wait for response and convert to Json format and store in data variable

      this.setState({ popularMoviesArray: data.results });

      console.log(this.state.popularMoviesArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // fetches filtered data based on region
  getFilteredPopularMoviesData = async (region) => {
    //const popularMoviesUrl = this.state.popularMoviesUrl;
    //const API_KEY = this.state.API_KEY;
    // try fetch movie data
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=a48fc5bbf08210f25e7397efb859d4c6&language=en-US&region=${region}`
      );

      const data = await response.json(); // wait for response and convert to Json format and store in data variable

      this.setState({ popularMoviesArray: data.results });

      console.log(this.state.popularMoviesArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // what happens when user clicks country
  handleClickCountry = (event) => {
    this.setState({ countryChosen: event.target.value });
  };

  // what happens user clicks filter button
  handleClickFilter = (event) => {
    event.preventDefault();
    const region = this.state.countryChosen;
    this.getFilteredPopularMoviesData(region);
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
        <Container className="popularMovies">
          <Row>
            <Col xs={12} md={4}>
              <h1>Popular Movies</h1>
            </Col>
            <Col xs={8} md={8} className="pop-drop-down-menu">
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
          <DisplayMovie movieArray={this.state.popularMoviesArray} />
        </Container>
      ); // end of return
    }
  } // end of the else statement.
} // end of render()
// end of App class
