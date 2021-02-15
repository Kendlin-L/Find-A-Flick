import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import "../Trending.css";
import DisplayMovie from "./DisplayMovie";
export default class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trendingArray: [],
      API_KEY: "api_key=a48fc5bbf08210f25e7397efb859d4c6",
      trendingMoviesURL: "https://api.themoviedb.org/3/trending",
      isFetched: false,
      errorMsg: null,
      baseImageURL: "https://image.tmdb.org/t/p",
      imageSize: "w342",
      timeWindowDay: "day",
      timeWindowWeek: "week",
      moreInfo: false
    };
  }

  // =========== display trending movies when the component mounts
  componentDidMount() {
    this.getTrendingData();
  }

  // ============ this function requests trending movie data from the API
  getTrendingData = async () => {
    const trendingMoviesURL = this.state.trendingMoviesURL;
    const API_KEY = this.state.API_KEY;
    // try fetch movie data
    try {
      const response = await fetch(`${trendingMoviesURL}/movie/day?${API_KEY}`);
      const data = await response.json(); // wait for response and convert to Json format and store in data variable
      this.setState({ trendingArray: data.results }); // set movieArray to contain results from request
      this.setState({ isFetched: true }); // if fetch is successful
      console.log(this.state.trendingArray);
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  //============== this function takes the timewindow passed from either handleClickToday()
  // or handleClickThisWeek and appends that value to the API request to return trending
  // movies eitehr today or this week
  getFilteredTrendingMovieData = async (timeWindow) => {
    const trendingMoviesURL = this.state.trendingMoviesURL;
    const API_KEY = this.state.API_KEY;
    // try fetch movie data
    try {
      const response = await fetch(
        `${trendingMoviesURL}/movie/${timeWindow}?${API_KEY}`
      );
      const data = await response.json(); // wait for response and convert to Json format and store in data variable
      this.setState({ trendingArray: data.results }); // set movieArray to contain results from request
      console.log(this.state.trendingArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // calls the getFilteredTrendiingMovieData() and passes the corressponding timeWindow "day"
  handleClickToday = () => {
    console.log(this.state.timeWindowDay);
    const timeWindow = this.state.timeWindowDay;
    this.getFilteredTrendingMovieData(timeWindow);
  };

  // calls the getFilteredTrendiingMovieData() and passes the corressponding timeWindow "week"
  handleClickThisWeek = () => {
    console.log(this.state.timeWindowWeek);
    const timeWindow = this.state.timeWindowWeek;
    this.getFilteredTrendingMovieData(timeWindow);
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
      // we have no errors and we have data
      return (
        <Container className="trending-movies">
          <Row>
            <Col xs={12} md={4} className="trending-col">
              <h1>Trending Movies</h1>
            </Col>
            <Col xs={12} md={8} className="button-col">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={this.handleClickToday}
                className="today"
              >
                Today
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={this.handleClickThisWeek}
              >
                This Week
              </Button>
            </Col>
          </Row>
          {/*======================= DISPLAY MOVIES =======================*/}
          <DisplayMovie movieArray={this.state.trendingArray} />
        </Container>
      );
    }
  }
}
