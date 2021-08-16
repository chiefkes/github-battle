import React, { useState, useContext, useReducer } from "react";
import PropTypes from "prop-types";
import {
  FaUserFriends,
  FaFighterJet,
  FaTrophy,
  FaTimesCircle,
} from "react-icons/fa";
import ThemeContext from "../contexts/theme";
import { Link } from "react-router-dom";

function Instructions() {
  const theme = useContext(ThemeContext);

  return (
    <div className="instructions-container">
      <h1 className="center-text header-lg">INSTRUCTIONS</h1>
      <ol className="container-sm grid center-text battle-instructions">
        <li>
          <h3 className="header-sm">Enter two GitHub users</h3>
          <FaUserFriends
            className={`bg-${theme}`}
            color="rgb(255, 191, 116)"
            size={140}
          />
        </li>
        <li>
          <h3 className="header-sm">Battle</h3>
          <FaFighterJet className={`bg-${theme}`} color="#727272" size={140} />
        </li>
        <li>
          <h3 className="header-sm">See the winner</h3>
          <FaTrophy
            className={`bg-${theme}`}
            color="rgb(255, 215, 0)"
            size={140}
          />
        </li>
      </ol>
    </div>
  );
}

function PlayerInput({ onSubmit, label }) {
  const [username, setUsername] = useState("");
  const theme = useContext(ThemeContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(username);
  };

  const handleChange = (event) => setUsername(event.target.value);

  return (
    <form className="column player" onSubmit={handleSubmit}>
      <label htmlFor="username" className="player-label">
        {label}
      </label>
      <div className="row player-inputs">
        <input
          type="text"
          id="username"
          className={`input-$theme}`}
          placeholder="github-username"
          autoComplete="off"
          value={username}
          onChange={handleChange}
        />
        <button
          className={`btn ${theme === "light" ? "dark" : "light"}-btn`}
          type="submit"
          disabled={!username}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

PlayerInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

function PlayerPreview({ username, onReset, label }) {
  const theme = useContext(ThemeContext);
  return (
    //
    <div className="column player">
      <h3 className="player-label">{label}</h3>
      <div className={`row bg-${theme}`}>
        <div className="player-info">
          <img
            className="avatar-sm"
            src={`https://github.com/${username}.png?size=200`}
            alt={`Avatar for ${username}`}
          />
          <a href={`https://github.com/${username}`} className="link">
            {username}
          </a>
        </div>
        <button className="btn-clear flex-center" onClick={onReset}>
          <FaTimesCircle color="rgb(194, 57, 42)" size={26} />
        </button>
      </div>
    </div>
  );
}

PlayerPreview.propTypes = {
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const playerReducer = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        [action.id]: action.player,
      };
    case "reset":
      return {
        ...state,
        [action.id]: null,
      };
    default:
      throw new Error("Unknown action type passed to playerReducer");
  }
};

export default function Battle() {
  const [{ playerOne, playerTwo }, dispatch] = useReducer(playerReducer, {
    playerOne: null,
    playerTwo: null,
  });

  return (
    <>
      <Instructions />

      <div className="players-container">
        <h1 className="center-text header-lg">Players</h1>
        <div className="row space-around">
          {playerOne === null ? (
            <PlayerInput
              label="Player One"
              onSubmit={(player) =>
                dispatch({ type: "set", id: "playerOne", player })
              }
            />
          ) : (
            <PlayerPreview
              username={playerOne}
              label="Player One"
              onReset={() => dispatch({ type: "reset", id: "playerOne" })}
            />
          )}

          {playerTwo === null ? (
            <PlayerInput
              label="Player Two"
              onSubmit={(player) =>
                dispatch({ type: "set", id: "playerTwo", player })
              }
            />
          ) : (
            <PlayerPreview
              username={playerTwo}
              label="Player Two"
              onReset={() => dispatch({ type: "reset", id: "playerTwo" })}
            />
          )}
        </div>

        {playerOne && playerTwo && (
          <Link
            className="btn dark-btn btn-space"
            to={{
              pathname: "/battle/results",
              search: `?playerOne=${playerOne}&playerTwo=${playerTwo}`,
            }}
          >
            Battle
          </Link>
        )}
      </div>
    </>
  );
}
