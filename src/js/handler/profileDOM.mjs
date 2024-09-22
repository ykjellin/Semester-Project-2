export function updateProfileUI(profile) {
  document.getElementById("avatar").src =
    profile.data?.avatar?.url || "default_avatar_url";
  document.getElementById("name").textContent =
    profile.data?.name || "No name available";
  document.getElementById("email").textContent =
    profile.data?.email || "No email available";
  document.getElementById("bio").textContent =
    profile.data?.bio || "No bio available";
  document.getElementById("credits").textContent =
    profile.data?.credits || "N/A";
  document.getElementById("banner").src =
    profile.data?.banner?.url || "default_banner_url";
}

export function populateListings(listings) {
  const listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = "";

  if (!listings || listings.length === 0) {
    listings = [
      {
        title: "Sample Listing 1",
        description: "This is a placeholder listing.",
        media: ["https://picsum.photos/150/100?random=1"],
      },
      {
        title: "Sample Listing 2",
        description: "Another placeholder listing.",
        media: ["https://picsum.photos/150/100?random=2"],
      },
      {
        title: "Sample Listing 3",
        description: "A third placeholder listing.",
        media: ["https://picsum.photos/150/100?random=3"],
      },
    ];
  }

  const itemsPerSlide = 3;
  for (let i = 0; i < listings.length; i += itemsPerSlide) {
    const slideListings = listings.slice(i, i + itemsPerSlide);
    const slideElement = document.createElement("div");
    slideElement.className = `carousel-item${i === 0 ? " active" : ""}`;

    const rowElement = document.createElement("div");
    rowElement.className = "row";

    slideListings.forEach((listing) => {
      const colElement = document.createElement("div");
      colElement.className = "col-md-4";

      const imageUrl =
        listing.media && listing.media.length > 0 && listing.media[0]?.url
          ? listing.media[0].url
          : "https://picsum.photos/150/100?placeholder";

      colElement.innerHTML = `
          <div class="card listing-card">
            <img class="card-img-top" src=""${imageUrl}" || "https://picsum.photos/150/100?placeholder"
            }" alt="${listing.title}" onerror="this.src='https://picsum.photos/150/100?placeholder';" />
            <div class="card-body">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-text">${listing.description}</p>
            </div>
          </div>`;
      rowElement.appendChild(colElement);
    });
    slideElement.appendChild(rowElement);
    listingsContainer.appendChild(slideElement);
  }
}

export function populateWins(wins) {
  const winsContainer = document.getElementById("wins");
  winsContainer.innerHTML = "";

  const itemsPerSlide = 3;
  for (let i = 0; i < wins.length; i += itemsPerSlide) {
    const slideWins = wins.slice(i, i + itemsPerSlide);
    const slideElement = document.createElement("div");
    slideElement.className = `carousel-item${i === 0 ? " active" : ""}`;

    const rowElement = document.createElement("div");
    rowElement.className = "row";

    slideWins.forEach((win) => {
      const colElement = document.createElement("div");
      colElement.className = "col-md-4";
      colElement.innerHTML = `
          <div class="card win-card">
            <img class="card-img-top" src="${
              win.media[0] || "https://picsum.photos/150/100?placeholder"
            }" alt="${win.title}" />
            <div class="card-body">
              <h5 class="card-title">${win.title}</h5>
              <p class="card-text">${win.description}</p>
            </div>
          </div>`;
      rowElement.appendChild(colElement);
    });

    slideElement.appendChild(rowElement);
    winsContainer.appendChild(slideElement);
  }
}

export function loadEditProfileForm(name, email, bio, avatar, banner) {
  const profileContainer = document.getElementById("profile-page");
  profileContainer.innerHTML = `
      <h3>${name}</h3>
      <p>Email: ${email}</p>
      <form id="edit-profile-form">
        <div class="mb-3">
          <label for="edit-avatar" class="form-label">Avatar URL</label>
          <input type="url" class="form-control" id="edit-avatar" value="${avatar}">
        </div>
        <div class="mb-3">
          <label for="edit-banner" class="form-label">Banner URL</label>
          <input type="url" class="form-control" id="edit-banner" value="${banner}">
        </div>
        <div class="mb-3">
          <label for="edit-bio" class="form-label">Bio</label>
          <textarea class="form-control" id="edit-bio">${bio}</textarea>
        </div>
        <button type="submit" class="btn ">Save Changes</button>
        <button id="cancel-edit" class="btn ">Cancel</button>
      </form>
      <div id="formFeedback" class="alert d-none"></div>
    `;
}
