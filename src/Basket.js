import React, { Component } from "react";

// manage our selection choices
class Basket extends Component {
  // This is our callback for the reduce method
  // We can just write one reduce callback method because
  // toppings, cheeses and bases all have a price property.
  // so this one method will work for all three cases.
  getCalculatedPrice(acc, obj) {
    return acc + obj.price;
  }

  render() {
    const toppingsProps = this.props.custToppingsArray;
    const cheesesProps = this.props.custCheesesArray;
    const baseProps = this.props.custBaseArray;
    const custPizzaSizesArray = this.props.custPizzaSizesArray;
    const custSizeChoice = this.props.custSizeChoice;

    // we simply use reduce on all three arrays which have been
    // passed via this.props.
    const totalCost =
      custSizeChoice *
      (toppingsProps.reduce(this.getCalculatedPrice, 0.0) +
        cheesesProps.reduce(this.getCalculatedPrice, 0.0) +
        baseProps.reduce(this.getCalculatedPrice, 0.0));

    return (
      <div className="alert alert-dark" role="alert">
        <h2>Your Pizza Order</h2>
        <p className="lead">TOTAL COST: €{totalCost.toFixed(2)}</p>

        {baseProps.length <= 0 &&
          (toppingsProps.length > 0 || cheesesProps.length > 0) && (
            <p className="lead text-justify">
              ORDER INCOMPLETE: You'll need to add a base to complete your
              order.
            </p>
          )}

        <ul className="lead">
          {cheesesProps.map((c, index) => (
            <li key={index}>
              CHEESE: <b>{c.chName}</b>, €
              {(custSizeChoice * c.price).toFixed(2)}
            </li>
          ))}
        </ul>
        <ul className="lead">
          {toppingsProps.map((s, index) => (
            <li key={index}>
              TOPPING: <b>{s.topName}</b>, €
              {(custSizeChoice * s.price).toFixed(2)}
            </li>
          ))}
        </ul>
        <ul className="lead">
          {baseProps.map((b, index) => (
            <li key={index}>
              BASE: <b>{b.baseName}</b>, €
              {(custSizeChoice * b.price).toFixed(2)}
            </li>
          ))}
        </ul>
        <ul className="lead">
          {custPizzaSizesArray.map((sz, index) => (
            <li key={index}>
              <mark>
                Your Pizza Size: <b>{sz.sName}</b>
              </mark>
            </li>
          ))}
        </ul>

        {baseProps.length > 0 &&
          (toppingsProps.length > 0 || cheesesProps.length > 0) && (
            <p className="lead text-justify">
              ORDER COMPLETE: You're ready to go!
              <button type="button" class="btn btn-warning btn-lg btn-block">
                Place My Order
              </button>
            </p>
          )}
      </div>
    );
  } // render
} // class Basket
export default Basket;
