import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class AlbumList extends Component {
  render() {
    const { searchResolve, emptyResult } = this.props;
    return (
      <section>
        {emptyResult ? (
          <p>Nenhum álbum foi encontrado</p>
        ) : (
          searchResolve.map((album) => {
            const id = Math.round(Math.random() * 100);
            return (
              <div key={ `${album.collectionId}-${id}` }>
                <img src={ album.artworkUrl100 } alt="album artwork" />
                <Link
                  to={ `/album/${album.collectionId}` }
                  data-testid={ `link-to-album-${album.collectionId}` }
                >
                  <h3>{album.collectionName}</h3>
                </Link>
                <p>{album.artistName}</p>
              </div>
            );
          })
        )}
      </section>
    );
  }
}

AlbumList.propTypes = {
  searchResolve: PropTypes.array,
  emptyResult: PropTypes.bool,
}.isRequired;

export default AlbumList;
