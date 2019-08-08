class ApiClient {
  _apiBase = "https://www.reddit.com/r/cats.json?";
  _nextPosts = "";

  mediaFilter = postArray => {
    return postArray.filter(post => post.data.is_reddit_media_domain);
  };

  /* метод getResource делает запрос и получает видио или фото посты
   * @next - аргумент boolean. true - запрос для получения следующих постов(infiniteScroll)
   */
  async getResource(next) {
    const res = next
      ? await fetch(`${this._apiBase}after=${this._nextPosts}`)
      : await fetch(`${this._apiBase}limit=25`);

    if (!res.ok) {
      throw new Error(
        `Could not fetch ${this._apiBase}, received ${res.status}`
      );
    }

    const responseJSON = await res.json();
    this._nextPosts = responseJSON.data.after;
    const allPosts = [...responseJSON.data.children];
    const mediaPost = this.mediaFilter(allPosts);

    return mediaPost;
  }
}

const Singleton = (function() {
  var instance;

  const createInstance = () => {
    return new ApiClient();
  };

  return {
    makeClient: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export default Singleton;
