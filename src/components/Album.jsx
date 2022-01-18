import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Loading from './Loading';
import MusicCard from './MusicCard';
import getMusics from '../services/musicsAPI';

class Album extends Component {
  constructor() {
    super();

    this.state = {
      album: [],
      artist: '',
      albumName: '',
      isLoading: true,
    };

    this.getAlbumMusics = this.getAlbumMusics.bind(this);
  }

  componentDidMount() {
    this.getAlbumMusics();
  }

  async getAlbumMusics() {
    const { match: { params: { id } } } = this.props;
    try {
      const resolve = await getMusics(id);
      const albumName = resolve[0].collectionName;
      const artist = resolve[0].artistName;
      resolve.splice(0, 1);
      this.setState(
        {
          artist,
          albumName,
          album: resolve,
          isLoading: false,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { album, isLoading, artist, albumName } = this.state;
    return (
      <div data-testid="page-album">
        <Header />
        <div>
          <h3 data-testid="album-name">{albumName}</h3>
          <h4 data-testid="artist-name">{artist}</h4>
        </div>
        { album.map((music) => (
          isLoading ? <Loading />
            : <MusicCard key={ music.trackId } music={ music } />))}
      </div>
    );
  }
}

Album.propTypes = {
  match: PropTypes.objectOf(PropTypes.object),
}.isRequired;

export default Album;
