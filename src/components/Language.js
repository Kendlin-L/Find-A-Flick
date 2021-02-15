import React, { Component } from "react";
import { Form } from "react-bootstrap";
export default class Language extends Component {
  render() {
    // values passed as props
    const languageData = this.props.languageData;
    const languageChosen = this.props.languageChosen;
    const handleClickLanguage = this.props.handleClickLanguage;

    // here we are displaying a drop down menu with language options for the user
    return (
      <Form>
        <Form.Label htmlFor="language">
          <b>Language</b>
        </Form.Label>
        <br />
        <Form.Control
          as="select"
          name="language"
          id="language"
          onClick={handleClickLanguage}
          custom
        >
          {languageData.map((language, index) => (
            <option key={index} value={language.code}>
              {language.name}
            </option>
          ))}
        </Form.Control>
      </Form>
    );
  }
}
