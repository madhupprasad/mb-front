import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [movieData, setMovieData] = useState([]);
  const [article, setArticle] = useState([]);
  const textInput = useRef<HTMLInputElement>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState([]);

  const filtersData = ["title", "genres", "actors", "directors"];

  useEffect(() => {
    if (textInput.current !== null) {
      textInput.current.focus();
    }
  }, []);

  async function onSearch(event: any) {
    if (event.charCode === 13) {
      fetch("http://20.106.130.95/mb/getMovies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: event.target.value, filters: filters }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data);
          setMovieData(res.data);
        });
    }
  }

  function onCardClick(data: any) {
    let director = data?.directors ? data.directors[0] : "";
    let title = data.title;
    let actors =
      data?.actors[0] + " " + data?.actors[1] + " " + data?.actors[2];
    let year = data.year;
    data = title + " " + actors + " " + director + " " + year;
    console.log(data);
    fetch("http://20.106.130.95/mb/getArticles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: data }),
    })
      .then((res) => res.json())
      .then((res) => setArticle(res.data));
  }

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <div className="body">
      <div className="top">
        <div className="heading">
          <div className="logo">MB</div>
        </div>

        <div className="search border">
          <input
            ref={textInput}
            type="text"
            className="input"
            placeholder="Enter the query"
            onKeyPress={onSearch}
          />
        </div>

        <div>
          <button
            className="filter"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <img
              src="https://img.icons8.com/ios-glyphs/30/ffffff/filter.png"
              alt="filter"
            />
          </button>
        </div>
      </div>

      {filterVisible && (
        <div className="filterContainer border">
          {filtersData.map((item) => (
            <div>
              <input
                type="checkbox"
                value={item}
                onClick={(event: any) => {
                  const data = event.target.value;

                  if (filters.includes(data)) {
                    setFilters(filters.filter((e) => e !== data));
                  } else {
                    setFilters(filters.concat(data));
                  }
                }}
              />
              <label>{item}</label>
            </div>
          ))}
        </div>
      )}

      <div className="result">
        {movieData.length > 0 && (
          <div className="left border">
            <div>
              <button
                className="sort"
                onClick={() => {
                  console.log("asd");
                  const newData = [...movieData].sort((a, b) =>
                    a.rating < b.rating ? 1 : -1
                  );
                  setMovieData(newData);
                }}
              >
                Sort by Rating
              </button>
              <button
                className="sort"
                onClick={() => {
                  console.log("asd");
                  const newData = [...movieData].sort((a, b) =>
                    a.year < b.year ? 1 : -1
                  );
                  setMovieData(newData);
                }}
              >
                Sort by Latest
              </button>
            </div>
            {movieData.map((item: any) => {
              return (
                <div
                  className="card border"
                  style={{ cursor: "pointer" }}
                  onClick={() => onCardClick(item)}
                >
                  <div className="image">
                    <img
                      src={item.img_url || "http://via.placeholder.com/100X130"}
                      alt=""
                      style={{ height: "auto", width: "100px" }}
                    />
                  </div>
                  <div className="content">
                    <code>
                      {item.title} - {item.year}
                    </code>
                    <div style={{ fontWeight: "bold", marginBottom: "7px" }}>
                      {item.languages[0]}
                    </div>
                    <span
                      style={{
                        fontWeight: "bolder",
                        color: "black",
                        background: "yellow",
                        width: "fitContent",
                        padding: "1px 4px",
                        borderRadius: "4px",
                      }}
                    >
                      {item.rating || "--"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {article.length > 0 && (
          <div className="right ">
            <div className="title">News and Articles:</div>
            {article.map((item: any) => (
              <div className="card border article">
                <code className="title">{item.articles.title}</code>
                <code className="subtitle">
                  {item.articles.subtitle.slice(0, 70)}...
                </code>
                <div className="news">
                  {item.articles.content.slice(0, 200)}...
                </div>
                <a href={item.articles.link} target="_blank" rel="noreferrer">
                  Visit the site
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
