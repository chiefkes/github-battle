import React, { useEffect, useReducer } from "react";
import { battle } from "../utils/api";
import Card from "./Card";
import Loading from "./Loading";
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaCode,
  FaUser,
} from "react-icons/fa";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";
import queryString from "query-string";
import { Link } from "react-router-dom";

function ProfileList({ profile }) {
  const { name, location, company, followers, following } = profile;
  return (
    <ul className="card-list">
      <li>
        <Tooltip text="User's Name">
          <FaUser color="rgb(239, 115, 115)" size={22} />
          {name}
        </Tooltip>
      </li>
      {location && (
        <li>
          <Tooltip text="User's location">
            <FaBriefcase color="rgb(144, 115, 255)" size={22} />
            {location}
          </Tooltip>
        </li>
      )}
      {company && (
        <li>
          <Tooltip text="User's company">
            <FaCompass color="#795548" size={22} />
            {company}
          </Tooltip>
        </li>
      )}
      <li>
        <Tooltip text="User's number of GitHub followers">
          <FaUsers color="rgb(129, 195, 245)" size={22} />
          {followers.toLocaleString()} followers
        </Tooltip>
      </li>
      <li>
        <Tooltip text="User's number of GitHub friends">
          <FaUserFriends color="rgb(64, 195, 183)" size={22} />
          {following.toLocaleString()} following
        </Tooltip>
      </li>
    </ul>
  );
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired,
};

function resultsReducer(state, action) {
  switch (action.type) {
    case "fetch":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "results":
      return {
        loading: false,
        error: null,
        winner: action.players[0],
        loser: action.players[1],
      };
    case "error":
      console.warn(action.message);
      return {
        ...state,
        error: action.message,
      };
    default:
      throw new Error("Unknown action type in resultsReducer");
  }
}

export default function Results({ location }) {
  const { playerOne, playerTwo } = queryString.parse(location.search);
  const [{ winner, loser, error, loading }, dispatch] = useReducer(
    resultsReducer,
    {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    }
  );

  useEffect(() => {
    dispatch({ type: "fetch" });

    battle([playerOne, playerTwo])
      .then((players) => {
        dispatch({
          type: "results",
          players,
        });
      })
      .catch(({ message }) => {
        dispatch({
          type: "error",
          message,
        });
      });
  }, [playerOne, playerTwo]);

  if (loading === true) {
    return <Loading text="Battling" />;
  }

  if (error) {
    return (
      //
      <p className="center-text error">{error}</p>
    );
  }

  return (
    <>
      <div className="grid space-around container-sm">
        <Card
          header={winner.score === loser.score ? "Tie" : "Winner"}
          subheader={`Score: ${winner.score.toLocaleString()}`}
          avatar={winner.profile.avatar_url}
          href={winner.profile.html_url}
          name={winner.profile.login}
        >
          <ProfileList profile={winner.profile} />
        </Card>

        <Card
          header={winner.score === loser.score ? "Tie" : "Loser"}
          subheader={`Score: ${loser.score.toLocaleString()}`}
          avatar={loser.profile.avatar_url}
          href={loser.profile.html_url}
          name={loser.profile.login}
        >
          <ProfileList profile={loser.profile} />
        </Card>
      </div>
      <Link to="/battle" className="btn dark-btn btn-space">
        RESET
      </Link>
    </>
  );
}
