import { forceCheck } from "react-lazyload";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import TrackItem from "./track-item";
import styles from "../styles/library.module.css";

const TrackList = ({
  search,
  songs,
  handlePlay,
  addToLibrary,
  loadMoreTracks,
  currentTrackID,
  isPlaying
}) => {
  const queueIndex = useSelector(state => state.player.index);

  if (!songs.length && loadMoreTracks) {
    loadMoreTracks();
  }
  const detectScroll = useScrollDetection(loadMoreTracks);
  useCheckViewpointComponentsOnUpdate(songs);

  return (
    <>
      <div
        className={styles.libraryWrapper}
        onScroll={loadMoreTracks ? detectScroll : null}
      >
        {songs &&
          songs.map((track, i) => (
            <TrackItem
              key={`${track.id}${track.source}${i}`}
              track={track}
              search={search}
              handlePlay={() => handlePlay(track, songs)}
              addToLibrary={event => addToLibrary(event, track)}
              isActive={currentTrackID === track.id && i === queueIndex}
              isPlaying={isPlaying}
            />
          ))}
      </div>
    </>
  );
};

function useScrollDetection(loadMoreTracks) {
  return function(e) {
    const eScrollTop = e.target.scrollTop;
    const eHeight = e.target.getBoundingClientRect().height;
    const eScrollHeight = e.target.scrollHeight - 10;
    if (eScrollTop + eHeight >= eScrollHeight) {
      loadMoreTracks();
    }
  };
}

function useCheckViewpointComponentsOnUpdate(songs) {
  useEffect(() => {
    // This will ensure that components that come into viewport during
    // a filter will be rendered. Lazyload only checks on scroll events,
    // so this way we force lazyload to check visible components
    forceCheck();
  }, [songs]);
}

TrackList.propTypes = {
  search: PropTypes.bool,
  songs: PropTypes.arrayOf(PropTypes.object),
  handlePlay: PropTypes.func,
  addToLibrary: PropTypes.func,
  loadMoreTracks: PropTypes.func,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
};

TrackList.defaultProps = {
  search: false,
  songs: [],
  handlePlay: () => {},
  addToLibrary: () => {},
  loadMoreTracks: () => {},
  toggleAddToPlaylistForm: () => {},
  toggleEditTrackForm: () => {},
  toggleDeleteTrackForm: () => {}
};

export default TrackList;
