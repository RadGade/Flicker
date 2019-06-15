import Fade from "react-reveal/Fade";
import uniqid from "uniqid";

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.count = 0;

        this.state = {
            collection: [
                {
                    name: "Suggested for you",
                    target: "suggested"
                },
                {
                    name: "Recently Played",
                    target: "recentlyPlayed"
                },
                {
                    name: "Favorites",
                    target: "favorites"
                }
            ]
        };
    }

    shouldComponentUpdate(nextProps) {
        if (
            this.props.content == nextProps.content &&
            this.props.searchContent == nextProps.searchContent &&
            this.props.favorites == nextProps.favorites &&
            this.props.recentlyPlayed == nextProps.recentlyPlayed &&
            this.props.suggested == nextProps.suggested &&
            this.props.results == nextProps.results &&
            this.props.isOffline == nextProps.isOffline
        ) {
            return false;
        } else {
            return true;
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.results[0] && this.props.results[0]) {
            if (
                prevProps.results[0].backdrop_path !=
                this.props.results[0].backdrop_path ||
                this.count === 0
            ) {
                this.props.setHeader(this.props.getHeader(this.props.results));
                this.count++;
            }
        }
    }

    render() {
        let genreCollection = this.state.collection.map(item => {
            let movies = this.props[item.target].map((movie, index) => (
                <MovieItem
                    movie={movie}
                    openBox={this.props.openBox}
                    strip={this.props.strip}
                    key={uniqid()}
                />
            ));

            return <GenreContainer key={uniqid()} name={item.name} movies={movies} />;
        });

        return (
            <div
                className={`content-container ${
                    this.props.genre || this.props.isOffline
                        ? "movie-content-container"
                        : ""
                    } ${this.props.search ? "search-content" : ""}
                `}
            >
                {(() => {
                    if (!this.props.isOffline) {
                        if (this.props.search) {
                            return (
                                <Fade distance="10%" bottom>
                                    <div className="search-title">
                                        Search Results{" "}
                                        {this.props.searchContent
                                            ? this.props.searchContent.length
                                                ? `(${this.props.searchContent.length})`
                                                : ""
                                            : ""}
                                    </div>
                                </Fade>
                            );
                        }
                    }
                })()}
                {(() => {
                    if (this.props.isOffline) {
                        return (
                            <Fade distance="10%" bottom>
                                <div className="offline-container">
                                    <div className="offline-error" />
                                    <span>It looks like you're offline.</span>
                                    <span>
                                        Please check your internet connection and try again.
                  </span>
                                </div>
                            </Fade>
                        );
                    } else {
                        if (this.props.search) {
                            return this.props.searchContent;
                        } else {
                            if (this.props.collectionContainer) {
                                return genreCollection;
                            } else {
                                if (this.props.content) {
                                    return this.props.content;
                                } else {
                                    return (
                                        <Fade distance="10%" bottom>
                                            <div className="content-loader" />
                                        </Fade>
                                    );
                                }
                            }
                        }
                    }
                })()}
            </div>
        );
    }
}
