import React, { Component } from 'react';
import Header from './Header';

const MIN_LENGTH = 2;
class Search extends Component {
  constructor() {
    super();

    this.state = {
      search: '',
      isDisabled: true,
    };
  }

  validateSearch = () => {
    const { search } = this.state;
    const validSearch = search.length < MIN_LENGTH;

    this.setState({
      isDisabled: validSearch,
    });
  };

  handleChange = ({ name, value }) => {
    this.setState({
      [name]: value,
    }, this.validateSearch);
  };

  render() {
    const { isDisabled, search } = this.state;
    return (
      <div data-testid="page-search">
        <Header />
        <form>
          <label htmlFor="search-bar">
            Search
            <input
              type="text"
              data-testid="search-artist-input"
              name="search"
              value={ search }
              placeholder="Artist name"
              id="search-bar"
              onChange={ ({ target }) => this.handleChange(target) }
            />
          </label>

          <button
            type="submit"
            data-testid="search-artist-button"
            disabled={ isDisabled }
          >
            Pesquisar
          </button>
        </form>
      </div>
    );
  }
}

export default Search;
