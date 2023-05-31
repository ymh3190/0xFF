const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;

searchForm.addEventListener("submit", (e) => {
  const query = searchInput.value;
  if (!query) {
    e.preventDefault();
    return;
  }
});
