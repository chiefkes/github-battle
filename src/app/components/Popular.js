import React, { useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle,
} from "react-icons/fa";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";

function LanguagesNav({ selected, onUpdateLanguage }) {
  const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

  return (
    <ul className="flex-center">
      {languages.map((lang) => (
        <li key={lang}>
          <button
            className="btn-clear nav-link"
            style={lang === selected ? { color: "rgb(187, 46, 31)" } : null}
            onClick={() => onUpdateLanguage(lang)}
          >
            {lang}
          </button>
        </li>
      ))}
    </ul>
  );
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired,
};

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {/* <pre>{JSON.stringify(repos, null, 2)}</pre> */}
      {repos.map((repo, index) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } =
          repo;
        const { login, avatar_url } = owner;

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <Tooltip text="GitHub username">
                    <FaUser color="rgb(255, 191, 116)" size={22} />
                    <a href={`https://www.github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color="rgb(255, 215, 0)" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="rgb(129, 195, 245)" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                  {open_issues.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired,
};

const popularReducer = (state, action) => {
  switch (action.type) {
    case "success":
      return {
        error: null,
        repos: {
          ...state.repos,
          [action.selectedLanguage]: action.data,
        },
      };

    case "error":
      return {
        ...state,
        error: action.message,
      };

    default:
      throw new Error("Unknown action in popularReducer");
  }
};

export default function Popular() {
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const [{ repos, error }, dispatch] = useReducer(popularReducer, {
    repos: {},
    error: null,
  });

  useEffect(() => {
    if (!repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then((data) => {
          dispatch({
            type: "success",
            selectedLanguage,
            data,
          });
        })
        .catch((error) => {
          console.warn("Error fetching repos ", error);

          dispatch({
            type: "error",
            message: "There was an error fetching the repositories",
          });
        });
    }
  }, [selectedLanguage]);

  const isLoading = () => {
    return !repos[selectedLanguage] && error === null;
  };

  return (
    <>
      <LanguagesNav
        selected={selectedLanguage}
        onUpdateLanguage={(sel) => setSelectedLanguage(sel)}
      />

      {isLoading() && <Loading text="Fetching Repos" />}

      {error && <p className="center-text error">{error}</p>}

      {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
    </>
  );
}
