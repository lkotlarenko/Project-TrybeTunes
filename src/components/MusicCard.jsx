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
    // calls getFavorites when mounted
    this.getFavorites();
  }

  async getFavorites() {
    const { music } = this.props;
    try {
      // gets an array with favorite songs
      const favorites = await favAPI.getFavoriteSongs();
      // try to find the music received as prop on array of favorites
      const wasFavorite = favorites.find((song) => (
        song.trackId === music.trackId));
        // if theres a favorite song with same trackId then set state of isFavorite
      if (wasFavorite) {
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
    const { music, status } = this.props;
    this.setState({ isLoading: true });
    try {
      // depending on target checked value, set favorite or not
      if (checked) {
        await favAPI
          .addSong(music)
          .then(() => this.setState({ isFavorite: true, isLoading: false }));
      } else {
        await favAPI
          .removeSong(music)
          // sets loading then calls for status (function on parent component Favorites) after checkbox change
          .then(() => this.setState({ isFavorite: false, isLoading: false }, status));
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
  // status is a function passed through props when rendering from Favorites page, so that it can reload the list after changing favorite checkbox
  status: PropTypes.func,
  music: PropTypes.shape({
    trackName: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,
    // accept two types of props https://stackoverflow.com/questions/41808428/react-proptypes-allow-different-types-of-proptypes-for-one-prop
    trackId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]).isRequired,
  }).isRequired,
};

MusicCard.defaultProps = {
  status: () => {},
};

export default MusicCard;
