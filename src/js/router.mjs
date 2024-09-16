export async function route() {
  const path = window.location.pathname;
  const mainContent = document.querySelector("#main-content");

  console.log(`Navigating to: ${path}`);

  async function loadContent(url) {
    try {
      console.log(`Loading content from: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load content from ${url}`);
      }
      const html = await response.text();
      mainContent.innerHTML = html;
    } catch (error) {
      console.error(error);
      mainContent.innerHTML = `
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist.</p>
        <a href="/">Go Home</a>
      `;
    }
  }

  if (path === "/" || path === "/home") {
    await loadContent("../home/index.html");
  } else if (path.includes("/login")) {
    await loadContent("../login/index.html");
  } else if (path.includes("/register")) {
    await loadContent("../register/index.html");
  } else if (path.includes("/profile")) {
    await loadContent("../profile/index.html");
  } else if (path.includes("/createAuction")) {
    await loadContent("../createAuction/index.html");
  } else if (path.includes("/auction/")) {
    const auctionId = path.split("/auction/")[1];
    await loadContent("../viewAuction/index.html");
  } else {
    mainContent.innerHTML = `
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <a href="/">Go Home</a>
    `;
  }
}
