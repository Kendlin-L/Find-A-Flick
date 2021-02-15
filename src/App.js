import React, { Component } from "react";
import Basket from "./Basket";

class App extends Component {
  constructor(props) {
    super(props);

    // each array starting with apiData is an
    // array to hold our JSON data
    // isFetched indicates if the API call has finished
    // errorMsg is either null (none) or there is some error
    this.state = {
      custCheeseError: "",
      custCheeseLimit: 1,
      custToppingError: "",
      custToppingLimit: 1,
      apiDataToppings: [],
      apiDataCheeses: [],
      apiDataBases: [],
      apiDataSizes: [],
      custSizeChoice: 1.0,
      custBaseChoice: [],
      custToppingChoices: [],
      custCheeseChoices: [],
      custPizzaSizeChoices: [],
      isFetched: false,
      errorMsg: null
    };

    this.handleBaseListChange = this.handleBaseListChange.bind(this);

    this.handleResetAll = this.handleResetAll.bind(this);
    this.handleToppingChoiceRemovalAdvanced = this.handleToppingChoiceRemovalAdvanced.bind(
      this
    );
    this.handleToppingChoice = this.handleToppingChoice.bind(this);

    this.handleCheeseChoiceRemovalAdvanced = this.handleCheeseChoiceRemovalAdvanced.bind(
      this
    );
    this.handleCheeseChoice = this.handleCheeseChoice.bind(this);
    this.handlePizzaSizeListChange = this.handlePizzaSizeListChange.bind(this);
  }
  // componentDidMount() is invoked immediately after a
  // component is mounted (inserted into the tree)

  async componentDidMount() {
    try {
      const API_URL =
        "https://raw.githubusercontent.com/petermooney/cs385/main/pizzaAPI/pizza.json";

      const response = await fetch(API_URL);
      // wait for the response. When it arrives, store the JSON version
      // of the response in this variable.
      const jsonResult = await response.json();

      this.setState({ custCheeseLimit: jsonResult.CHEESE_LIMIT });
      this.setState({ custToppingLimit: jsonResult.TOPPING_LIMIT });

      // update the state variables correctly.
      this.setState({ apiDataSizes: jsonResult.sizes });
      this.setState({ apiDataToppings: jsonResult.toppings });
      this.setState({ apiDataCheeses: jsonResult.cheeses });
      this.setState({ apiDataBases: jsonResult.bases });
      //console.log(this.state.apiData.length);
      this.setState({ isFetched: true });
    } catch (error) {
      // In the case of an error ...
      this.setState({ isFetched: false });
      // This will be used to display error message.
      this.setState({ errorMsg: error });
    } // end of try catch
  } // end of componentDidMount()

  // sort method so that bases is in sorted order.
  sortBases(baseA, baseB) {
    let comparison = 0;
    // remember strings can be compared using > and < in Javascript

    if (baseA.baseName > baseB.baseName) comparison = 1;
    else if (baseA.baseName < baseB.baseName) comparison = -1;
    else comparison = 0;

    return comparison;
  }

  // sort method so that toppings table is in sorted order.
  sortToppings(toppingsA, toppingsB) {
    let comparison = 0;
    // remember strings can be compared using > and < in Javascript

    if (toppingsA.topName > toppingsB.topName) comparison = 1;
    else if (toppingsA.topName < toppingsB.topName) comparison = -1;
    else comparison = 0;

    return comparison;
  }

  // sort method so that cheeses table is in sorted order.
  sortCheese(cheeseA, cheeseB) {
    let comparison = 0;
    // remember strings can be compared using > and < in Javascript
    if (cheeseA.chName > cheeseB.chName) comparison = 1;
    else if (cheeseA.chName < cheeseB.chName) comparison = -1;
    else comparison = 0;

    return comparison;
  }

  // Event handler for the drop-down-list
  handleBaseListChange(event) {
    // We assign the value of the event
    // The event is what is 'selected' from the list. This action
    // is an event. The baseID is passed here.
    // we need to find this object from the apiDataBases array
    // We force Javascript to convert the event.target.value to a
    // numeric value so that we can use it for filtering.
    let choosenBaseObject = this.state.apiDataBases.filter(
      this.findBaseByBaseID(Number(event.target.value))
    );
    // REMEMBER - filter always returns an array - even if it is
    // just one object.We don't use concat as we are assigning a brand
    // new array to custBaseChoice.
    this.setState({ custBaseChoice: choosenBaseObject });
  }

  // This filter function will find the object in the
  // apiDataBases array which matches the baseID of the option chosen by the
  // user.
  findBaseByBaseID(baseID) {
    return function (pizzaBaseObject) {
      return pizzaBaseObject.baseID === baseID;
    };
  }

  handleToppingChoice(topName) {
    // we have to limit the number of toppings any user can order
    // if they have already choosen this.state.custToppingLimit toppings
    // cannot choose any more. give an error message

    if (this.state.custToppingChoices.length < this.state.custToppingLimit) {
      this.setState({ custToppingError: "" }); // no error with this condition

      // use filter to find the topping object with name = topName
      let choosenToppingObject = this.state.apiDataToppings.filter(
        this.findToppingByTopName(topName)
      );

      // REMEMBER - filter always returns an array - even if it is
      // just one object.
      // here we must use concat as custToppingChoices is an array
      this.setState({
        custToppingChoices: this.state.custToppingChoices.concat(
          choosenToppingObject
        )
      });
    } else {
      // don't add any more toppings. There is a limit on toppings.
      // give an error message instead.
      this.setState({
        custToppingError:
          "Limit of " +
          this.state.custToppingLimit +
          " toppings. Please review your choices"
      });
    }
  }

  // This filter function will find the object in the
  // apiDataToppings array which matches the baseID of the option chosen by the
  // user.
  findToppingByTopName(topName) {
    return function (toppingObject) {
      return toppingObject.topName === topName;
    };
  }

  // This is a boolean to indicate if this toppinng has already
  // been chosen by the user.
  alreadyChosenThisTopping(topName) {
    let foundThisTopping = this.state.custToppingChoices.filter(
      this.findToppingByTopName(topName)
    );

    return foundThisTopping.length > 0;
  }

  // how many times is this topping chosen! This is the same as the function
  // above except for a different return statement.
  numberTimesChosenThisTopping(topName) {
    let foundThisTopping = this.state.custToppingChoices.filter(
      this.findToppingByTopName(topName)
    );

    return foundThisTopping.length;
  }

  // we want to remove ONE object with the topping name = topName.

  handleToppingChoiceRemovalAdvanced(topName) {
    // we start by reusing our filter call back function to find toppings
    // based on their topping name.
    // The findIndex method simply returns the index of the first position
    // in the array where an object with this topping name is found.
    // If there are many objects with this topping name, the first index is returned.

    // we make a local copy of the state array custToppingChoices
    // this is the recommended approach.
    let currentCustToppingChoices = this.state.custToppingChoices;

    let firstObjectIndex = currentCustToppingChoices.findIndex(
      this.findToppingByTopName(topName)
    );

    // here we use splice. This means that we want to SPLICE one
    // object from the array at the position firstObjectIndex
    // The object at this index is removed and the array is
    // reformed.
    currentCustToppingChoices.splice(firstObjectIndex, 1);

    // We now setState with the newly spliced array minus
    // one object
    this.setState({
      custToppingChoices: currentCustToppingChoices
    });
  }

  handleCheeseChoice(cheeseName) {
    // we have to limit the number of cheese any user can order
    // if they have already choosen this.state.custCheeseLimit cheeses
    // cannot choose any more. give an error message

    if (this.state.custCheeseChoices.length < this.state.custCheeseLimit) {
      this.setState({ custCheeseError: "" }); // no error with this condition

      // use filter to find the cheeese object with name = chName
      let choosenCheeseObject = this.state.apiDataCheeses.filter(
        this.findCheeseByCheeseName(cheeseName)
      );

      // REMEMBER - filter always returns an array - even if it is
      // just one object.
      // here we must use concat as custToppingChoices is an array
      this.setState({
        custCheeseChoices: this.state.custCheeseChoices.concat(
          choosenCheeseObject
        )
      });
    } else {
      // don't add any more cheese. There is a limit on cheese.
      // give an error message instead.
      this.setState({
        custCheeseError:
          "Limit of " +
          this.state.custCheeseLimit +
          " cheeses. Please review your choices"
      });
    }
  }

  // This filter function will find the object in the
  // apiDataCheeses array which matches the chName of the option chosen by the
  // user.
  findCheeseByCheeseName(cheeseName) {
    return function (cheeseObject) {
      return cheeseObject.chName === cheeseName;
    };
  }

  // This is a boolean to indicate if this cheese has already
  // been chosen by the user.
  alreadyChosenThisCheese(cheeseName) {
    let foundThisCheese = this.state.custCheeseChoices.filter(
      this.findCheeseByCheeseName(cheeseName)
    );

    return foundThisCheese.length > 0;
  }

  // how many times is this cheese chosen! This is the same as the function
  // above except for a different return statement.
  numberTimesChosenThisCheese(cheeseName) {
    let foundThisCheese = this.state.custCheeseChoices.filter(
      this.findCheeseByCheeseName(cheeseName)
    );

    return foundThisCheese.length;
  }

  // we want to remove ONE object with the topping name = topName.

  handleCheeseChoiceRemovalAdvanced(cheeseName) {
    // we start by reusing our filter call back function to find cheeses
    // based on their cheese name.
    // The findIndex method simply returns the index of the first position
    // in the array where an object with this cheese name is found.
    // If there are many objects with this cheese name, the first index is returned.

    // we make a local copy of the state array custCheeseChoices
    // this is the recommended approach.
    let currentCustCheeseChoices = this.state.custCheeseChoices;

    let firstObjectIndex = currentCustCheeseChoices.findIndex(
      this.findCheeseByCheeseName(cheeseName)
    );

    // here we use splice. This means that we want to SPLICE one
    // object from the array at the position firstObjectIndex
    // The object at this index is removed and the array is
    // reformed.
    currentCustCheeseChoices.splice(firstObjectIndex, 1);

    // We now setState with the newly spliced array minus
    // one object
    this.setState({
      custCheeseChoices: currentCustCheeseChoices
    });
  }

  handleResetAll() {
    this.setState({ custToppingError: "" });
    this.setState({ custToppingChoices: [] });
    this.setState({ custBaseChoice: [] });
    this.setState({ custCheeseChoices: [] });
    this.setState({ custPizzaSizeChoices: [] });
    this.setState({ custSizeChoice: 1.0 });
  }

  // in this method the user's choice of size
  // will determine the pricing of all parts of the pizza.
  handlePizzaSizeListChange(event) {
    // We assign the value of the event
    // The event is what is 'selected' from the list. This action
    // is an event. The sName is passed here.
    // we need to find this object from the apiDataSizes array
    let choosenSizeObject = this.state.apiDataSizes.filter(
      this.findSizeBySizeName(event.target.value)
    );

    // REMEMBER - filter always returns an array - even if it is
    // just one object.We don't use concat as we are assigning a brand
    // new array to custPizzaSizeChoices.
    this.setState({ custPizzaSizeChoices: choosenSizeObject });

    // the choosenSizeObject is a single element array
    // we need to get the pricing or cost factor value from this.

    let costFactor = choosenSizeObject[0].costFactor;
    // set this.state.custSizeChoice to this value
    // now we can multiply by this cost factor.
    this.setState({ custSizeChoice: Number(costFactor) });
  }

  findSizeBySizeName(sizeName) {
    return function (pizzaSizeObject) {
      return pizzaSizeObject.sName === sizeName;
    };
  }

  // Remember our three state variables.
  // PAY ATTENTION to the JSON returned. We need to be able to
  // access specific properties from the JSON returned.
  // Notice that this time we have three possible returns for our
  // render. This is conditional rendering based on some conditions
  render() {
    if (this.state.errorMsg) {
      return (
        <div className="error">
          <h1>An error has occured in the API call</h1>
          <p>You can do the following to fix this.... </p>
          <p>{this.state.errorMsg.toString()}</p>
        </div>
      ); // end of return.
    } else if (this.state.isFetched === false) {
      return (
        <div className="fetching">
          <h1>We are loading your API request........</h1>
        </div>
      ); // end of return
    } else {
      // we have no errors and we have data
      return (
        <div className="App">
          <div className="container">
            <h1>CS385 Pizza Ltd.</h1>
            <Basket
              custToppingsArray={this.state.custToppingChoices}
              custBaseArray={this.state.custBaseChoice}
              custCheesesArray={this.state.custCheeseChoices}
              custPizzaSizesArray={this.state.custPizzaSizeChoices}
              custSizeChoice={this.state.custSizeChoice}
            />

            <div className="alert alert-info" role="alert">
              <h1>Pizza Size</h1>
              <form>
                <div className="form-group">
                  Which size? (pick one please):
                  <br />
                  <select
                    className="form-control"
                    onChange={this.handlePizzaSizeListChange}
                  >
                    {this.state.apiDataSizes.map((sz, index) => (
                      <option key={index} value={sz.sName}>
                        {sz.sName}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="alert alert-info" role="alert">
              <h1>Pizza Bases</h1>
              <form>
                <div className="form-group">
                  Pick your base (one please):
                  <br />
                  <select
                    className="form-control"
                    onChange={this.handleBaseListChange}
                  >
                    {this.state.apiDataBases
                      .sort(this.sortBases)
                      .map((b, index) => (
                        <option key={index} value={b.baseID}>
                          {b.baseName}, €
                          {(this.state.custSizeChoice * b.price).toFixed(2)}
                        </option>
                      ))}
                  </select>
                </div>
              </form>
              {this.state.custBaseChoice.length > 0 && (
                <p className="lead">
                  BASE CHOICE: {this.state.custBaseChoice[0].baseName}
                </p>
              )}
            </div>

            <div className="alert alert-info" role="alert">
              <h1>Pizza Toppings</h1>
              {this.state.custToppingError}
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Name (topping)</th>
                    <th>Cost (portion)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.apiDataToppings
                    .sort(this.sortToppings)
                    .map((s, index) => (
                      <tr key={index}>
                        <td>
                          {s.topName}
                          {this.alreadyChosenThisTopping(s.topName) && (
                            <mark className="lead">
                              x{this.numberTimesChosenThisTopping(s.topName)}
                            </mark>
                          )}
                        </td>
                        <td>
                          €{(this.state.custSizeChoice * s.price).toFixed(2)}
                        </td>
                        <td>
                          <button
                            onClick={() => this.handleToppingChoice(s.topName)}
                            type="button"
                            className="btn btn-dark"
                          >
                            +
                          </button>
                          &nbsp;
                          {this.alreadyChosenThisTopping(s.topName) && (
                            <button
                              className="btn btn-dark"
                              onClick={() =>
                                this.handleToppingChoiceRemovalAdvanced(
                                  s.topName
                                )
                              }
                            >
                              {" "}
                              -
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="alert alert-info" role="alert">
              <h1>Pizza Cheeses</h1>
              {this.state.custCheeseError}
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Name (topping)</th>
                    <th>Cost (portion)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.apiDataCheeses
                    .sort(this.sortCheese)
                    .map((c, index) => (
                      <tr key={index}>
                        <td>
                          {" "}
                          {c.chName}
                          {this.alreadyChosenThisCheese(c.chName) && (
                            <mark className="lead">
                              x{this.numberTimesChosenThisCheese(c.chName)}
                            </mark>
                          )}
                        </td>

                        <td>
                          €{(this.state.custSizeChoice * c.price).toFixed(2)}
                        </td>

                        <td>
                          <button
                            onClick={() => this.handleCheeseChoice(c.chName)}
                            type="button"
                            className="btn btn-dark"
                          >
                            +
                          </button>
                          &nbsp;
                          {this.alreadyChosenThisCheese(c.chName) && (
                            <button
                              className="btn btn-dark"
                              onClick={() =>
                                this.handleCheeseChoiceRemovalAdvanced(c.chName)
                              }
                            >
                              -
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={this.handleResetAll}
              type="button"
              className="btn btn-primary btn-lg btn-block"
            >
              Reset All{" "}
            </button>
          </div>
        </div>
      ); // end of return
    } // end of the else statement.
  } // end of render()
} // end of App class
export default App;
