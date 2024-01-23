const API_KEY = "9a3c8eacaed74e1c9058f7dd0a426bbb";
const url = "https://newsapi.org/v2/everything?q=";

// Calculate the start date of the past week
const currentDate = new Date();
const pastWeekStartDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - 7
);
const formattedDate = `${pastWeekStartDate.getFullYear()}-${(
  pastWeekStartDate.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${pastWeekStartDate
  .getDate()
  .toString()
  .padStart(2, "0")}`;

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(
      `${url}${query}&from=${formattedDate}&sortBy=popularity&apiKey=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch news. Status: ${res.status}`);
    }

    const data = await res.json();
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error.message);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const articleDate = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${articleDate}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
