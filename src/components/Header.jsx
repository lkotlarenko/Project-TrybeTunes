import React, { Component } from 'react';
import * as userAPI from '../services/userAPI';
import Loading from './Loading';

class Header extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      user: [],
    };

    this.getUsername = this.getUsername.bind(this);
  }

  componentDidMount() {
    this.getUsername();
  }

  async getUsername() {
    try {
      const resolve = await userAPI.getUser();
      this.setState({
        user: resolve,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { isLoading, user: { name } } = this.state;

    return (
      <header data-testid="header-component">
        {isLoading ? <Loading /> : null}
        <p data-testid="header-user-name">{name}</p>
      </header>
    );
  }
}

export default Header;
