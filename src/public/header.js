const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", (e) => {
  const query = searchInput.value;
  if (!query) {
    e.preventDefault();
    return;
  }
});
