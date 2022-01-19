import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import * as favAPI from '../services/favoriteSongsAPI';

class MusicCard extends Component {
  constructor() {
    super();

    this.state = {
      isFavorite: false,
      isLoading: false,
    };

    this.updateFavorites = this.updateFavorites.bind(this);
    this.getFavorites = this.getFavorites.bind(this);
  }

  componentDidMount() {
    // call getFavorites when mounted
    this.getFavorites();
  }

  async getFavorites() {
    const { music } = this.props;
    try {
      // gets an array with favorite songs
      const favorites = await favAPI.getFavoriteSongs();
      // try to find the music received as prop on array of favorites
      const wasFavorited = favorites.find((song) => (
        song.trackId === music.trackId));
        // if theres a favorited song with same trackId then set state of isFavorite
      if (wasFavorited) {
        this.setState(
          {
            isFavorite: true,
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  // function called on every checkbox change, receive checked value then use it to add or remove the song (using favAPI)
  async updateFavorites({ target: { checked } }) {
    const { music } = this.props;
    this.setState({ isLoading: true });
    try {
      // depending on target checked value set favorited or not
      if (checked) {
        await favAPI
          .addSong(music)
          .then(() => this.setState({ isFavorite: true, isLoading: false }));
      } else {
        await favAPI
          .removeSong(music)
          .then(() => this.setState({ isFavorite: false, isLoading: false }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {
      music: { trackId, trackName, previewUrl },
    } = this.props;
    const { isFavorite, isLoading } = this.state;
    return (
      <section>
        <hr />
        <span>{trackName}</span>
        <audio data-testid="audio-component" src={ previewUrl } controls>
          <track kind="captions" />
          O seu navegador não suporta o elemento audio.
        </audio>
        <label htmlFor={ trackId }>
          <input
            type="checkbox"
            id={ trackId }
            checked={ isFavorite }
            onChange={ this.updateFavorites }
            data-testid={ `checkbox-music-${trackId}` }
          />
          Favorita
        </label>
        {/* loads Loading component when isLoading is true */}
        {isLoading && <Loading />}
      </section>
    );
  }
}

MusicCard.propTypes = {
  music: PropTypes.shape({
    trackName: PropTypes.string,
    previewUrl: PropTypes.string,
    trackId: PropTypes.string,
  }),
}.isRequired;

export default MusicCard;
