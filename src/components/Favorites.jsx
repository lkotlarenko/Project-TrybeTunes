import React, { Component } from 'react';
import Header from './Header';
import Loading from './Loading';
import MusicCard from './MusicCard';
import * as favAPI from '../services/favoriteSongsAPI';

class Favorites extends Component {
  constructor() {
    super();

    this.state = {
      favoriteSongs: [],
      isLoading: true,
    };

    this.getFavorites = this.getFavorites.bind(this);
    this.listHandler = this.listHandler.bind(this);
  }

  componentDidMount() {
    // call getFavorites when mounted
    this.getFavorites();
  }

  async getFavorites() {
    try {
      const favoriteSongs = await favAPI.getFavoriteSongs();
      this.setState(
        {
          favoriteSongs,
          isLoading: false,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  // function to update the list after removing favorite
  // (called on MusicCard after checkbox changes)
  listHandler() {
    this.setState({ isLoading: true }, this.getFavorites);
  }

  render() {
    const { isLoading, favoriteSongs } = this.state;
    return (
      <div data-testid="page-favorites">
        <Header />
        { isLoading ? <Loading />
          : favoriteSongs.map((song) => (
            // pass func to child component from https://surajsharma.net/blog/react-update-parent-state-from-child
            <MusicCard
              key={ song.trackId }
              music={ song }
              status={ this.listHandler }
            />))}
      </div>
    );
  }
}

export default Favorites;
