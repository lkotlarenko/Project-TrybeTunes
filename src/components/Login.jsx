import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as userAPI from '../services/userAPI';
import Loading from './Loading';

const MIN_LENGTH = 3;
class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      isDisabled: true,
      isLoading: false,
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

  changeRoute = () => {
    const { history } = this.props;
    history.push('/search');
  }

  loginUser = (e) => {
    e.preventDefault();
    const { username } = this.state;
    this.setState({ isLoading: true });
    userAPI.createUser({ name: username }).then(() => {
      this.changeRoute();
    });
  }

  render() {
    const { username, isDisabled, isLoading } = this.state;
    return (
      <main className="loginContainer">
        <div data-testid="page-login">
          <form onSubmit={ (e) => this.loginUser(e) }>
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
              type="submit"
              data-testid="login-submit-button"
              disabled={ isDisabled }
            >
              Entrar
            </button>
            {
              isLoading ? (
                <Loading />
              ) : null
            }
          </form>
        </div>
      </main>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

export default Login;
