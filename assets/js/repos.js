(function () {
  "use strict";

  var root = document.querySelector(".repos");
  if (!root) return;
  var user = root.getAttribute("data-user");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  }

  function render(repos) {
    root.textContent = "";
    var grid = el("div", "repo-grid");
    repos.forEach(function (r) {
      var card = el("a", "repo");
      card.href = r.html_url;
      card.rel = "noopener";
      card.appendChild(el("strong", "repo__name", r.name.replace(/[-_]/g, " ")));
      card.appendChild(el("span", "repo__desc", r.description || "No description yet."));
      var meta = el("span", "repo__meta");
      if (r.language) meta.appendChild(el("span", "repo__lang", r.language));
      if (r.stargazers_count) meta.appendChild(el("span", "", "★ " + r.stargazers_count));
      meta.appendChild(el("span", "", formatDate(r.pushed_at)));
      card.appendChild(meta);
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  function fail() {
    root.textContent = "";
    var p = el("p", "muted");
    var a = el("a", "", "See all repositories on GitHub");
    a.href = "https://github.com/" + user + "?tab=repositories";
    p.appendChild(a);
    root.appendChild(p);
  }

  fetch("https://api.github.com/users/" + encodeURIComponent(user) + "/repos?per_page=100&sort=pushed")
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (data) {
      var own = data.filter(function (r) {
        return !r.fork && !r.archived && r.name.toLowerCase() !== (user + ".github.io").toLowerCase();
      });
      if (!own.length) return fail();
      render(own.slice(0, 24));
    })
    .catch(fail);
})();
