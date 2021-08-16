import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const styles = {
  content: {
    fontSize: "35px",
    position: "absolute",
    left: "0",
    right: "0",
    marginTop: "20px",
    textAlign: "center",
  },
};

export default function Loading({ text = "Loading", speed = 300 }) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    let id = window.setInterval(() => {
      setContent((c) => (c === text + "..." ? text : c + "."));
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return <p style={styles.content}>{content}</p>;
}

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};

/* 
export default class Loading extends Component {
  state = {
    content: this.props.text,
  };

  static propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
  };

  static defaultProps = {
    text: "Loading",
    speed: 300,
  };

  componentDidMount() {
    const { speed, text } = this.props;

    this.interval = window.setInterval(() => {
      this.state.content === text + "..."
        ? this.setState({
            content: text,
          })
        : this.setState(({ content }) => ({
            content: content + ".",
          }));
    }, speed);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      //
      <p style={styles.content}>{this.state.content}</p>
    );
  }
} 
*/

// Loading.propTypes = {
//   text: PropTypes.string.isRequired,
//   speed: PropTypes.number.isRequired,
// };

// Loading.defaultProps = {
//   text: "Loading",
//   speed: 300,
// };
