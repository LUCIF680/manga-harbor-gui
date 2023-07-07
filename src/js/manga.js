const { __, urls, transformDate, searchBar } = require("./lib");
searchBar();
(async function () {
  let params = new URLSearchParams(location.search);
  const mangaId = params.get("id");

  // eslint-disable-next-line no-unused-vars
  const disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = mangaId;
  };

  // DON'T EDIT BELOW THIS LINE
  var d = document,
    s = d.createElement("script");
  s.src = "https://mangaharbor-net.disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);

  // Handle manga infromation
  window.goToChapters = function (link, mangaId) {
    // Saving the chapters list
    localStorage.setItem(mangaId, JSON.stringify(chapters));
    window.location = link;
  };

  let response = await fetch(`${urls.manga}/${mangaId}`, {
    method: "get",
  });

  let manga_details = (await response.json()).manga;

  if (manga_details === null) {
    alert("You are trying to access invalid page!");
  }
  __("title").innerText = manga_details.title;
  __("status").innerText = manga_details.status;
  __("author").innerText = manga_details.author;
  __("last-updated").innerText = transformDate(manga_details.last_updated);
  __("genre").innerText = manga_details.genre;
  __("summary").innerText = manga_details.summary;
  __("thumbnail").src = manga_details.thumbnail;

  // Handle manga chapters
  response = await fetch(`${urls.chapter}/${mangaId}`, {
    method: "get",
  });
  const chapters = await response.json();

  // Will add chapters to the panel
  const elements = chapters
    .map((chapter, index) => {
      const chapterUrl = `${urls.base}/chapter/${mangaId}/${index}`;
      const chapterElement = `
        <span 
          class="cursor-pointer flex bg-gradient-to-r hover:bg-blue-900 from-grey-600 to-grey-900 text-white rounded-lg p-2 m-1" 
          onclick="goToChapters('${chapterUrl}', '${mangaId}')"
        >
          ${chapter.title}
        </span>
      `;
      return chapterElement;
    })
    .join("");

  __("chapters").innerHTML = elements;

  // For handing description being more than 200 characters
  const summary = __("summary");
  const summaryText = summary.textContent.trim();
  const readMoreLink = __("read-more-link");
  const readLessLink = __("read-less-link");

  if (summaryText.length > 200) {
    const truncatedSummary = summaryText.slice(0, 200) + "...";
    summary.textContent = truncatedSummary;
    readMoreLink.classList.remove("hidden");

    readMoreLink.addEventListener("click", (event) => {
      event.preventDefault();
      summary.textContent = summaryText;
      readMoreLink.classList.add("hidden");
      readLessLink.classList.remove("hidden");
    });

    readLessLink.addEventListener("click", (event) => {
      event.preventDefault();
      summary.textContent = truncatedSummary;
      readLessLink.classList.add("hidden");
      readMoreLink.classList.remove("hidden");
    });
  }
})();