import React, { Component } from "react";
import Singleton from "../../services/api-clients";
import TrackVisibility from "react-on-screen";
import ImageZoom from "react-medium-image-zoom";
import Video from "./Video";
import debounce from "../../utililits/debounce";
import getValidVideoUrl from "../../utililits/getvalidUrl";
import Spinner from "../Spinner";

import "./ListItems.css";

export default class ListItems extends Component {
  state = {
    showFavorites: false,
    hasError: false,
    loading: true,
    array2: [],
    favorites: []
  };
  componentDidMount() {
    const apiClient = Singleton.makeClient();

    apiClient
      .getResource()
      .then(val => this.setState({ loading: false, array2: val }));

    window.addEventListener("scroll", () => {
      const clientHeight = document.documentElement.clientHeight + 1;
      const scrollEnd = Math.floor(
        document.documentElement.getBoundingClientRect().bottom
      );

      if (clientHeight >= scrollEnd && !this.state.showFavorites) {
        debounce(this.addPosts, 1000)();
      }
    });
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    });
  }

  addPosts = () => {
    this.setState({ loading: true });
    const getNextPosts = Singleton.makeClient();

    getNextPosts.getResource(true).then(val =>
      this.setState(
        prevState => {
          return { array2: [...prevState.array2, ...val] };
        },
        () => {
          this.setState({ loading: false });
        }
      )
    );
  };

  render() {
    const elements = postsArray =>
      postsArray.map(({ data }) => {
        const {
          is_video,
          created,
          url,
          title,
          id,
          author_fullname,
          author
        } = data;

        const uniqKey = `${created}${id}${author_fullname}`;
        const videoUrl = is_video && data.media.reddit_video.fallback_url;
        let alreadyInFav = this.state.favorites.some(val => {
          return val.data.unikId === uniqKey;
        });

        return (
          <div
            className="card col-md-5 mt-5 py-3"
            key={uniqKey}
            style={{ minHeigth: "75vh", maxHeigth: "75vh" }}
          >
            <div className="text-muted small pt-4">{`Posted by ${author}`}</div>
            {is_video ? (
              <TrackVisibility>
                <Video src={getValidVideoUrl(videoUrl)} />
              </TrackVisibility>
            ) : (
              <ImageZoom
                image={{
                  src: `${url}`,
                  alt: `${title}`,
                  className: "card-img-top m-auto pt-4",
                  style: { width: "21vw", maxHeight: "73vh" }
                }}
                zoomImage={{
                  src: "bridge-big.jpg",
                  alt: "Golden Gate Bridge"
                }}
              />
            )}
            <div className="card-body">
              <p className="card-text">{title}</p>
              <a
                href="#2"
                onClick={e => {
                  e.preventDefault();
                  const favPost = {
                    data: { ...data, unikId: uniqKey }
                  };

                  if (alreadyInFav) {
                    const removeFavPost = this.state.favorites.filter(val => {
                      return val.data.unikId !== uniqKey;
                    });

                    return this.setState({ favorites: removeFavPost });
                  }

                  this.setState(prevState => {
                    return {
                      favorites: [...prevState.favorites, favPost]
                    };
                  });
                }}
              >
                <img
                  src={
                    alreadyInFav
                      ? "https://image.flaticon.com/icons/png/512/69/69450.png"
                      : "https://image.flaticon.com/icons/png/512/25/25424.png"
                  }
                  alt="heart icon"
                  width="20px"
                  title="Add to Favorites"
                />
              </a>
            </div>
          </div>
        );
      });
    return this.state.hasError ? (
      <h1 className="mt-5 text-center">Что-то пошло не так</h1>
    ) : (
      <div className="text-center d-flex flex-column align-items-center">
        {this.state.loading ? <Spinner /> : null}
        {this.state.showFavorites
          ? elements(this.state.favorites)
          : elements(this.state.array2)}
        <a
          href="#favorites"
          className="favorites"
          onClick={e => {
            e.preventDefault();
            this.setState(prevState => {
              return { showFavorites: !prevState.showFavorites };
            });
          }}
        >
          <img
            src={
              !this.state.showFavorites
                ? "https://image.flaticon.com/icons/png/512/69/69450.png"
                : "https://image.flaticon.com/icons/png/512/25/25424.png"
            }
            alt="To the favorite/To the all"
            width="20px"
            title="To the favorite/To the all"
          />
        </a>
      </div>
    );
  }
}
