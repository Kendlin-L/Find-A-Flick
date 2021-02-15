import React, { Component } from "react";
import "../DisplayMovie.css";
import { countryCodes } from "../CountryCodes";
import {
  Card,
  CardDeck,
  Button,
  Modal,
  Row,
  Container,
  Col,
  Form
} from "react-bootstrap";

export default class DisplayMovie extends Component {
  state = {
    movieID: 0,
    movieDetailsURL: "https://api.themoviedb.org/3/movie/",
    API_KEY: "api_key=a48fc5bbf08210f25e7397efb859d4c6",
    detailsArrayisEmpty: false,
    movieDetailsArray: [],
    watchProvidersArray: [],
    watchProvidersArrayIsEmpty: false,
    watchProvidersAvailable: false,
    watchProvidersNames: [],
    countryChosen: "",
    isFetched: false,
    errorMsg: null,
    baseImageURL: "https://image.tmdb.org/t/p",
    imageSize: "w342",
    logoSize: "w45",
    moreInfo: false
  };

  // get more information about a movie
  getMovieDetailsData = async (movieID) => {
    const movieDetailsURL = this.state.movieDetailsURL;
    const API_KEY = this.state.API_KEY;
    let detailsArray = []; // will hold the movie object
    // try fetch movie data
    try {
      const response = await fetch(
        `${movieDetailsURL}${movieID}?${API_KEY}&language=en-US1&append_to_response=videos`
      );
      const data = await response.json(); // wait for response and convert to Json format and store in data variable

      // data returned is an object not an array so I set detailsArray = data
      // and push the detailsArray into the movieDetailsArray
      // this way i can map over the array without error
      detailsArray = data;

      // if detailsArray includes a status_code object name
      // then a 401 error occurred so set detailsArrayIsEmpty to true
      // not elegant but works
      if (Object.getOwnPropertyNames(detailsArray).includes("status_code")) {
        this.setState({ detailsArrayisEmpty: true });
        console.log("YES");
      } else {
        this.state.movieDetailsArray.push(detailsArray);
      }

      //this.state.movieDetailsArray.push(detailsArray);
      console.log(this.state.movieDetailsArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  //========================== this function makes a request to the "getWatchProviders" endpoint to return
  // the watch providers for a particular movie
  getWatchProvidersData = async (movieID) => {
    const movieDetailsURL = this.state.movieDetailsURL;
    const API_KEY = this.state.API_KEY;
    // try fetch movie data
    try {
      const response = await fetch(
        `${movieDetailsURL}${movieID}/watch/providers?${API_KEY}`
      );
      // wait for response and convert to Json format and store in data variable
      const data = await response.json();
      this.setState({ watchProvidersArray: data.results });
      console.log(this.state.watchProvidersArray);
      this.setState({ isFetched: true }); // if fetch is successful
      //catch error if occurs
    } catch (error) {
      this.setState({ isFetched: false }); // if fetch is not successful
      this.setState({ errorMsg: error }); // this will be used to display error message.
    }
  };

  // when more info button is clicked call getMovieDetailsData() and getWatchProvidersData()
  // and pass the movie id to these functions where an API request will be made with the id
  handleClickMoreInfo = (id) => {
    this.setState({ moreInfo: true });
    this.getMovieDetailsData(id);
    this.getWatchProvidersData(id);
    console.log(id);
  };

  // handles when user clicks outside of the modal
  toggleModal = () => {
    this.setState((prevState) => ({
      moreInfo: !prevState.moreInfo
    }));
  };

  // this is what happens when a user clicks the close button on the pop up box
  handleClose = () => {
    this.setState({ moreInfo: false });
    this.setState({ watchProvidersArray: [] });
    this.setState({ countryChosen: "" });
    this.setState({ movieDetailsArray: [] });
    if (this.state.detailsArrayisEmpty)
      this.setState({ detailsArrayisEmpty: false });
  };

  // what happens when user chooses a country from more info modal
  handleClickCountry = (event) => {
    this.setState({ countryChosen: event.target.value });
    console.log(event.target.value);
  };

  // returns object ==== to country code passed
  filterByISOCodeCountry(cCode) {
    return function (watcherObj) {
      return watcherObj === cCode;
    };
  }

  render() {
    // values passed as props
    const movieArray = this.props.movieArray;

    const localArray = this.state.watchProvidersArray;
    const countryToFind = this.state.countryChosen;

    // if the movieArray has no results, display an error message
    if (movieArray.length < 1) {
      return (
        <Container>
          <Row>
            <Col xs={8}>
              <h3>Sorry, no search results. Please try again.</h3>
            </Col>
          </Row>
        </Container>
      );
    } else {
      // here we are mapping over the movieArray and displaying the data as a card
      // wrapped in a card deck
      return (
        <Container className="card-deck">
          <CardDeck>
            {movieArray.map((movie, index) => (
              <div key={index}>
                <Card className="card" style={{ width: "12rem" }}>
                  <Card.Img
                    variant="top"
                    src={`${this.state.baseImageURL}/${this.state.imageSize}${movie.poster_path}`}
                  />
                  <Card.Body>
                    <Card.Title>
                      <h6>
                        <b>{movie.original_title}</b>
                      </h6>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <h6>{movie.release_date}</h6>
                    </Card.Subtitle>
                  </Card.Body>
                  <Button
                    variant="primary"
                    className="moreInfoLink"
                    size="sm"
                    block
                    onClick={() => this.handleClickMoreInfo(movie.id)}
                  >
                    More Info
                  </Button>
                </Card>
                <br />
              </div>
            ))}
          </CardDeck>
          {/* ==== id detailsArray is not empty ==== */}
          {!this.state.detailsArrayisEmpty && (
            <div>
              {this.state.movieDetailsArray.map((movie, index) => (
                <Modal
                  key={index}
                  show={this.state.moreInfo}
                  onHide={this.handleClose}
                  dialogClassName="more-info-modal"
                  size="lg"
                >
                  <Container>
                    <Modal.Body>
                      <Row>
                        <Col xs={12} md={6}>
                          <img
                            className="img"
                            alt="img"
                            src={`${this.state.baseImageURL}/${this.state.imageSize}${movie.poster_path}`}
                          />
                        </Col>
                        <Col xs={12} md={6} className="details-col">
                          <h2>{movie.original_title}</h2>
                          <h6>
                            <i>{movie.tagline}</i>
                          </h6>
                          <h6>{movie.release_date}</h6>
                          <hr />
                          <h5>Overview</h5>
                          {movie.overview}
                          <br />
                          <br />
                          <b>Rating:</b> {movie.vote_average}
                          <br />
                          <b>Genres: </b>
                          {movie.genres.map((genres, index) => (
                            <p
                              key={index}
                              style={{ display: "inline-block", margin: "5px" }}
                            >
                              {genres.name}
                            </p>
                          ))}
                          <hr />
                          <h5>Where to watch</h5>
                          {/* ==== enter country ==== */}
                          <Form>
                            <Form.Label htmlFor="country">
                              <b>Choose your country</b>{" "}
                            </Form.Label>
                            <br />
                            <Form.Control
                              as="select"
                              name="country"
                              id="country"
                              onClick={this.handleClickCountry}
                              custom
                            >
                              {countryCodes.map((country, index) => (
                                <option key={index} value={country.code}>
                                  {country.name}
                                </option>
                              ))}
                            </Form.Control>
                          </Form>
                          {/* ==== displaying the link to TMDB for watch providers,
                            courtesy of Peter Mooney ====*/}
                          <div>
                            {Object.getOwnPropertyNames(localArray).findIndex(
                              this.filterByISOCodeCountry(countryToFind)
                            ) !== -1 && (
                              <p>
                                <br />
                                <a
                                  style={{ display: "table-cell" }}
                                  href={localArray[countryToFind].link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Click here for watch providers
                                </a>
                              </p>
                            )}
                          </div>
                          <hr />
                          {/* ==== Displaying the link to youtube trailer ==== */}
                          {movie.videos.results.map((movieKey, index) => (
                            <div key={index}>
                              {/* opening link in new tab: https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react */}
                              {/* display first link in array */}
                              {index === 0 ? (
                                <a
                                  style={{ display: "table-cell" }}
                                  href={`https://www.youtube.com/watch?v=${movieKey.key}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Click here to watch the trailer
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                        </Col>
                      </Row>
                    </Modal.Body>
                  </Container>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              ))}
            </div>
          )}
          {/* ==== if detailsArray is empty ==== */}
          {this.state.detailsArrayisEmpty && (
            <div>
              <Modal
                show={this.state.moreInfo}
                onHide={this.handleClose}
                dialogClassName="more-info-modal"
                size="lg"
              >
                <Modal.Body>
                  <h3>No information is available for this movie.</h3>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </Container>
      );
    }
  }
}
