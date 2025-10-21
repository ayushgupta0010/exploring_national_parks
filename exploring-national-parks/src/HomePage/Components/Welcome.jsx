import React, { useEffect, useState } from "react";

/**
 * Component representing the welcome section of the homepage.
 * @module Welcome
 * @memberof HomePage
 * @returns {JSX.Element} The rendered welcome section.
 */
const Welcome = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const url = "https://www.reddit.com/r/Temple/top.json?limit=1&t=day";

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data?.children[0]?.data;
        console.log(data);
        setPost({
          title: data.title,
          selftext: data.selftext,
          timestamp: new Date(data.created_utc * 1000).toLocaleString(),
          permalink: "https://reddit.com" + data.permalink,
        });
      })
      .catch((err) => console.error("Error fetching Reddit data:", err));
  }, []);

  return (
    <div className="welcome">
      <h1 className="welcome-title">Explore National Parks</h1>
      <p className="welcome-text">
        Welcome to Exploring National Parks! This web app is designed to help
        you find the perfect national park for your next trip. Click on the
        "Park Search" button to search for a park by activity, or click on the
        "Plan A Trip" button to plan a trip to a park you've already selected.
      </p>
      {post && (
        <div
          style={{
            backgroundColor: "teal",
            color: "white",
            padding: "1rem",
            margin: "5px",
            borderRadius: "8px",
            maxWidth: "600px",
          }}
        >
          <h2>{post.title}</h2>
          {post.selftext && <p>{post.selftext}</p>}
          <p>
            <strong>Posted:</strong> {post.timestamp}
          </p>
          <a href={post.permalink} target="_blank" rel="noopener noreferrer">
            View on Reddit
          </a>
        </div>
      )}
    </div>
  );
};

export default Welcome;
