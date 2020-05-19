import * as React from "react";
import * as PropTypes from 'prop-types';

interface IEmailVerificationForm {
  onSubmit: any,
  onCancel: any,
  error: string,
};


class EmailVerificationForm extends React.Component<IEmailVerificationForm, any> {

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      verificationCode: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.verificationCode);
  }

  changeVerificationCode = (event) => {
    this.setState({ verificationCode: event.target.value });
  }

  render = () => (
    <form onSubmit={this.onSubmit}>
      <div>{this.props.error}</div>
      <label>
        Verification Code
        <input placeholder="code" onChange={this.changeVerificationCode} required />
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={this.props.onCancel}>Cancel</button>
    </form>
  )
}

export default EmailVerificationForm;
