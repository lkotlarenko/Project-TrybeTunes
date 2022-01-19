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

  render() {
    const { isLoading, favoriteSongs } = this.state;
    return (
      <div data-testid="page-favorites">
        <Header />
        { isLoading ? <Loading />
          : favoriteSongs.map((song) => (
            <MusicCard key={ song.trackId } music={ song } />))}
      </div>
    );
  }
}

export default Favorites;
