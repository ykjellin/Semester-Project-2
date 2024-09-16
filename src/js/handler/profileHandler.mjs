export async function loadProfile(userId) {
  const response = await fetch(`/api/profile/${userId}`);
  const profile = await response.json();

  document.getElementById("avatar").src = profile.avatar.url;
  document.getElementById("name").textContent = profile.name;
  document.getElementById("email").textContent = profile.email;
  document.getElementById("bio").textContent =
    profile.bio || "No bio available";
  document.getElementById("credits").textContent = profile.credits;
  document.getElementById("banner").src = profile.banner.url;

  populateListings(profile.listings);
  populateWins(profile.wins);
}

function populateListings(listings) {
  const listingsContainer = document.getElementById("listings");
  const listingTemplate = listingsContainer.querySelector(".listing");

  listings.forEach((listing) => {
    const newListing = listingTemplate.cloneNode(true);
    newListing.querySelector("#listing-img").src = listing.media[0]?.url || "";
    newListing.querySelector("#listing-img").alt = listing.media[0]?.alt || "";
    newListing.querySelector("#listing-title").textContent = listing.title;
    newListing.querySelector("#listing-description").textContent =
      listing.description;
    listingsContainer.appendChild(newListing);
  });

  listingTemplate.remove();
}

function populateWins(wins) {
  const winsContainer = document.getElementById("wins");
  const winTemplate = winsContainer.querySelector(".win");

  wins.forEach((win) => {
    const newWin = winTemplate.cloneNode(true);
    newWin.querySelector("#win-img").src = win.media[0]?.url || "";
    newWin.querySelector("#win-img").alt = win.media[0]?.alt || "";
    newWin.querySelector("#win-title").textContent = win.title;
    newWin.querySelector("#win-description").textContent = win.description;
    winsContainer.appendChild(newWin);
  });

  winTemplate.remove();
}
