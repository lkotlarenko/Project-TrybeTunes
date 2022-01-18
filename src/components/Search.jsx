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

    this.searchArtist = this.searchArtist.bind(this);
  }

  // create a bool that checks if search length has MIN_LENGTH, then set state with it
  validateSearch = () => {
    const { search } = this.state;
    const validSearch = search.length < MIN_LENGTH;
    this.setState({
      isDisabled: validSearch,
    });
  };

  // receive parameters from target > set values on state > run validateSearch
  handleChange = ({ name, value }) => {
    this.setState(
      {
        [name]: value,
      },
      this.validateSearch,
    );
  };

  // called on submit | prevent default > setState for indicate loading & save search input to be used on the result title text
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
    // if search response from api (now on state) length is 0 than setState indicating an empty search response
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

  // call API > save resolve to state, set needed state values & runs checkSearch
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
    // form that onSubmit runs callSearch ('e' parameter used on preventDefault to prevent default form behavior)
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
        {/* if isLoading render Loading component, otherwise render searchBar (form to search) */}
        {isLoading ? <Loading /> : searchBar}
        {/* if a search is done and returns an non empty result, render result title text */}
        {didSearch && !emptySearch
          ? <p>{`Resultado de álbuns de: ${artist}`}</p>
          : null}
        {/* render AlbumList passing api resolve as props (+ prop to inform of an empty result) */}
        <AlbumList emptyResult={ emptySearch } searchResolve={ searchResult } />
      </div>
    );
  }
}

export default Search;
