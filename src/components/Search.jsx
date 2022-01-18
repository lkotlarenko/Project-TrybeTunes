import React, { Component } from 'react';
import Header from './Header';
import Loading from './Loading';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import AlbumList from './AlbumList';

const MIN_LENGTH = 2;
class Search extends Component {
  constructor() {
    super();

    this.state = {
      search: '',
      isDisabled: true,
      isLoading: false,
      searchResult: [],
      didSearch: false,
    };
  }

  validateSearch = () => {
    const { search } = this.state;
    const validSearch = search.length < MIN_LENGTH;

    this.setState({
      isDisabled: validSearch,
    });

    this.searchArtist = this.searchArtist.bind(this);
  };

  handleChange = ({ name, value }) => {
    this.setState(
      {
        [name]: value,
      },
      this.validateSearch,
    );
  };

  callSearch = (e) => {
    const { search } = this.state;
    e.preventDefault();
    this.setState({
      isLoading: true,
      artist: search,
    });
    this.searchArtist();
  };

  checkSearch = () => {
    const { searchResult } = this.state;
    if (searchResult.length === 0) {
      this.setState({
        emptySearch: true,
      });
    } else {
      this.setState({
        emptySearch: false,
      });
    }
  };

  async searchArtist() {
    const { search } = this.state;
    try {
      const resolve = await searchAlbumsAPI(search);
      this.setState(
        {
          searchResult: resolve,
          isLoading: false,
          didSearch: true,
          search: '',
        },
        this.checkSearch,
      );
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {
      isDisabled,
      search,
      isLoading,
      searchResult,
      emptySearch,
      didSearch,
      artist,
    } = this.state;
    const searchBar = (
      <form onSubmit={ (e) => this.callSearch(e) }>
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
    );

    return (
      <div data-testid="page-search">
        <Header />
        {isLoading ? <Loading /> : searchBar}
        {didSearch && !emptySearch
          ? <p>{`Resultado de álbuns de: ${artist}`}</p>
          : null}
        <AlbumList emptyResult={ emptySearch } searchResolve={ searchResult } />
      </div>
    );
  }
}

export default Search;
