import React, { Component } from 'react';
import PropTypes from 'prop-types';


const MIN_LENGTH = 3;
class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      isDisabled: true,
    };
  }

  validateUsername = () => {
    const { username } = this.state;
    const validName = username.length < MIN_LENGTH;

    this.setState({
      isDisabled: validName,
    });
  }

  handleChange = ({ name, value }) => {
    this.setState({
      [name]: value,
    }, this.validateUsername);
  }

  render() {
    const { username, isDisabled } = this.state;
    return (
      <main className="loginContainer">
        <div data-testid="page-login">
          <form>
            <label htmlFor="username">
              Username
              <input
                type="text"
                data-testid="login-name-input"
                name="username"
                value={ username }
                placeholder="Your name"
                id="username"
                onChange={ ({ target }) => this.handleChange(target) }
              />
            </label>

            <button
              type="button"
              data-testid="login-submit-button"
              disabled={ isDisabled }
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }
}

Login.propTypes = {
  username: PropTypes.string,
}.isRequired;

export default Login;
