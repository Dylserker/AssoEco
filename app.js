const equipment = [
    [
      "barnum",
      "Barnum pliant 3 × 6 m",
      "Événementiel",
      "Comité des fêtes",
      "Centre",
      "Un barnum blanc facile à monter, idéal pour protéger vos événements du soleil ou d'une averse. Fourni avec ses 4 côtés.",
      "visual-barnum",
      "fetes@assoshare.local",
      "2026-01-01",
      "2026-12-31",
    ],
    [
      "speaker",
      "Enceinte 500W",
      "Sonorisation",
      "La Maison des jeunes",
      "Nord",
      "Une enceinte amplifiée avec entrée micro et câble jack. Parfaite pour une petite salle ou un événement en extérieur.",
      "visual-speaker",
      "contact@mdj-val.local",
      "2026-01-01",
      "2026-12-31",
    ],
    [
      "tables",
      "Tables pliantes (x8)",
      "Mobilier",
      "Club de randonnée",
      "Est",
      "Huit tables pliantes de 1,80 m. Solides et faciles à transporter. Prêt possible par lot ou à l'unité.",
      "visual-table",
      "marc@randonnee-val.local",
      "2026-01-01",
      "2026-12-31",
    ],
    [
      "projector",
      "Vidéoprojecteur HD",
      "Événementiel",
      "Ciné-club associatif",
      "Centre",
      "Vidéoprojecteur HD avec câble HDMI et sacoche de transport. Disponible en semaine et le week-end.",
      "visual-projector",
      "cineclub@assoshare.local",
      "2026-01-01",
      "2026-12-31",
    ],
    [
      "fridge",
      "Réfrigérateur mobile",
      "Cuisine",
      "AMAP des Tilleuls",
      "Sud",
      "Un petit réfrigérateur sur roulettes pour garder vos boissons et aliments au frais lors d'un événement.",
      "visual-fridge",
      "amap@assoshare.local",
      "2026-01-01",
      "2026-12-31",
    ],
    [
      "lights",
      "Guirlandes guinguette (x4)",
      "Événementiel",
      "Le Petit Théâtre",
      "Ouest",
      "Quatre guirlandes de 10 m avec ampoules LED basse consommation. Pour créer une ambiance chaleureuse sans surconsommer.",
      "visual-lights",
      "theatre@assoshare.local",
      "2026-01-01",
      "2026-12-31",
    ],
  ].map(([e, t, a, n, o, r, i, s, l, d]) => ({
    id: e,
    title: t,
    category: a,
    owner: n,
    neighborhood: o,
    description: r,
    visual: i,
    email: s,
    availableFrom: l,
    availableTo: d,
    searchable: `${t} ${a} ${n} ${o}`.toLocaleLowerCase("fr"),
  })),
  $ = (e) => document.querySelector(e),
  list = $("#equipment-list"),
  search = $("#search"),
  category = $("#category"),
  neighborhood = $("#neighborhood"),
  availableDate = $("#available-date"),
  resultCount = $("#result-count"),
  filterStatus = $("#filter-status"),
  noResults = $("#no-results"),
  dialog = $("#equipment-dialog"),
  dialogFavorite = $("#dialog-favorite"),
  favorites = new Set(
    JSON.parse(localStorage.getItem("assoshare-favorites") || "[]"),
  );

let openItemId = "";

const escapeHtml = (e) =>
  String(e).replace(
    /[&<>"']/g,
    (e) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[e],
  );

function isAvailable(e, t) {
  return !t || (e.availableFrom <= t && e.availableTo >= t);
}

function filteredEquipment() {
  const e = search.value.trim().toLocaleLowerCase("fr");
  return catalogEquipment().filter(
    (t) =>
      t.searchable.includes(e) &&
      (!category.value || t.category === category.value) &&
      (!neighborhood.value || t.neighborhood === neighborhood.value) &&
      isAvailable(t, availableDate.value),
  );
}

function catalogEquipment() {
  return [
    ...equipment,
    ...announcements().map((e) => ({
      ...e,
      owner: e.associationName,
      ownerPhone: e.associationPhone,
      description: `Annonce publiée par ${e.associationName}. Contact fictif pour la démonstration.`,
      visual: "visual-user",
      isUserAnnouncement: true,
      searchable: `${e.title} ${e.category} ${e.associationName} ${e.neighborhood}`.toLocaleLowerCase("fr"),
    })),
  ];
}

function renderCards() {
  const e = filteredEquipment();
  ((resultCount.textContent = e.length),
    (filterStatus.textContent = `${e.length} équipement${e.length > 1 ? "s" : ""} affiché${e.length > 1 ? "s" : ""}`),
    (noResults.hidden = e.length > 0),
    (list.innerHTML = e
      .map(
        (e) =>
          `\n    <article class="card${e.isUserAnnouncement ? " card-user" : ""}">
      <div class="card-visual ${e.visual}" aria-hidden="true"></div>
      <div class="card-content">
        <div class="card-heading"><span class="tag">${e.isUserAnnouncement ? "Annonce locale" : e.category}</span><button class="favorite-button" type="button" data-favorite="${e.id}" aria-label="${favorites.has(e.id) ? "Retirer" : "Ajouter"} ${escapeHtml(e.title)} ${favorites.has(e.id) ? "des" : "aux"} favoris" aria-pressed="${favorites.has(e.id)}">${favorites.has(e.id) ? "★" : "☆"}</button></div>
        <h3>${escapeHtml(e.title)}</h3>
        <p class="card-meta">${escapeHtml(e.owner)} · ${escapeHtml(e.neighborhood)}</p>
        <p class="availability">Disponible jusqu'au ${new Date(`${e.availableTo}T00:00:00`).toLocaleDateString("fr-FR")}</p>
        <div class="card-footer"><span>${e.isUserAnnouncement ? "Ajoutée à l'instant" : "Disponible maintenant"}</span><button class="card-link" type="button" data-id="${e.id}">Voir la fiche&nbsp; ↗</button></div>
      </div>
    </article>
  `,
      )
      .join("")));
}

function updateFavorite(e) {
  (favorites.has(e) ? favorites.delete(e) : favorites.add(e),
    localStorage.setItem("assoshare-favorites", JSON.stringify([...favorites])),
    renderCards(),
    openItemId === e && updateDialogFavorite());
}

function updateDialogFavorite() {
  const e = favorites.has(openItemId);
  ((dialogFavorite.textContent = e
    ? "★ Retirer des favoris"
    : "☆ Ajouter aux favoris"),
    dialogFavorite.setAttribute("aria-pressed", String(e)));
}

function openDetail(e) {
  const t = catalogEquipment().find((t) => t.id === e);
  t &&
    ((openItemId = e),
    ($("#contact-form").hidden = true),
    ($("#contact-success").hidden = true),
    ($("#dialog-visual").className = `detail-visual ${t.visual}`),
    ($("#dialog-category").textContent = t.category),
    ($("#dialog-title").textContent = t.title),
    ($("#dialog-description").textContent = t.description),
    ($("#dialog-owner").textContent = `♧  ${t.owner}`),
    ($("#dialog-location").textContent =
      `⌖  Val-sur-Loire · ${t.neighborhood}${t.ownerPhone ? ` · ☎ ${t.ownerPhone}` : ""}`),
    ($("#contact-association").textContent = t.owner),
    ($("#contact-phone").textContent = `☎ ${t.ownerPhone || "06 00 00 00 00"}`),
    ($("#contact-email-address").textContent = `✉ ${t.email}`),
    updateDialogFavorite(),
    "function" == typeof dialog.showModal
      ? dialog.showModal()
      : dialog.setAttribute("open", ""));
}

function announcements() {
  const e = JSON.parse(localStorage.getItem("assoshare-announcements") || "[]"),
    t = e.map((e) => ({
      ...e,
      id: e.id || announcementId(),
      ...(e.associationName ? {} : fakeAssociation()),
    }));
  t.some(
    (t, a) =>
      !e[a].id ||
      !e[a].associationName ||
      t.associationName !== e[a].associationName,
  ) &&
    localStorage.setItem("assoshare-announcements", JSON.stringify(t));
  return t;
}

function fakeAssociation() {
  const e = [
      "Les Liens du Val",
      "Collectif des Rives",
      "Les Ateliers Solidaires",
      "Val-sur-Loire en partage",
      "La Maison des bénévoles",
    ],
    t = [
      "06 12 34 56 70",
      "06 23 45 67 81",
      "06 34 56 78 92",
      "06 45 67 89 03",
      "06 56 78 90 14",
    ],
    a = Math.floor(Math.random() * e.length);
  return { associationName: e[a], associationPhone: t[a] };
}

function announcementId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function fillAnnouncementForm(e) {
  Object.entries(e).forEach(([t, a]) => {
    const n = document.querySelector(`#share-form [name="${t}"]`);
    n && (n.value = a);
  });
  $("#share-form").dataset.editing = e.id;
  $("#submit-announcement").textContent = "Enregistrer les modifications";
  $("#form-success").hidden = true;
  $("#proposer").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderAnnouncements() {
  const e = announcements();
  (($("#announcements-empty").hidden = e.length > 0),
    ($("#announcements-list").innerHTML = e
      .map(
        (e) =>
          `\n    <li class="announcement-card card card-user"><div class="card-visual visual-user" aria-hidden="true"></div><div class="card-content"><div class="card-heading"><span class="tag">Annonce locale</span><button class="favorite-button" type="button" data-favorite="${escapeHtml(e.id)}" aria-label="Ajouter ${escapeHtml(e.title)} aux favoris">☆</button></div><h3>${escapeHtml(e.title)}</h3><p class="card-meta">${escapeHtml(e.associationName)} · ${escapeHtml(e.neighborhood)}</p><p class="availability">Disponible jusqu'au ${new Date(`${e.availableTo}T00:00:00`).toLocaleDateString("fr-FR")}</p><div class="card-footer"><button class="card-link" type="button" data-id="${escapeHtml(e.id)}">Voir la fiche&nbsp; ↗</button><div class="announcement-actions"><button class="edit-announcement" type="button" data-edit-announcement="${escapeHtml(e.id)}">Modifier</button><button type="button" data-delete-announcement="${escapeHtml(e.id)}" aria-label="Supprimer ${escapeHtml(e.title)}">Supprimer</button></div></div></div></li>\n  `,
      )
      .join("")));
  renderCards();
}

(search.addEventListener("input", renderCards),
  category.addEventListener("change", renderCards),
  neighborhood.addEventListener("change", renderCards),
  availableDate.addEventListener("change", renderCards),
  list.addEventListener("click", (e) => {
    const t = e.target.closest("[data-favorite]"),
      a = e.target.closest("[data-id]");
    t ? updateFavorite(t.dataset.favorite) : a && openDetail(a.dataset.id);
  }),
  $("#clear-search").addEventListener("click", () => {
    ((search.value = ""),
      (category.value = ""),
      (neighborhood.value = ""),
      (availableDate.value = ""),
      renderCards(),
      search.focus());
  }),
  $("#dialog-close").addEventListener("click", () => dialog.close()),
  $("#dialog-contact").addEventListener("click", () => {
    $("#contact-form").hidden = false;
    $("#contact-name").focus();
  }),
  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const t = catalogEquipment().find((t) => t.id === openItemId);
    if (!t) return;
    $("#contact-success").textContent =
      `Demande envoyée fictivement à ${t.owner}. L'association pourra vous répondre à l'adresse indiquée dans votre message.`;
    $("#contact-success").hidden = false;
    e.currentTarget.reset();
  }),
  dialogFavorite.addEventListener("click", () => updateFavorite(openItemId)),
  dialog.addEventListener("click", (e) => {
    e.target === dialog && dialog.close();
  }),
  $("#announcements-list").addEventListener("click", (e) => {
    const f = e.target.closest("[data-favorite]"),
      t = e.target.closest("[data-delete-announcement]"),
      a = e.target.closest("[data-edit-announcement]"),
      n = e.target.closest("[data-id]");
    if (f) {
      updateFavorite(f.dataset.favorite);
      renderAnnouncements();
    } else if (t) {
      const n = announcements().filter(
        (e) => e.id !== t.dataset.deleteAnnouncement,
      );
      localStorage.setItem("assoshare-announcements", JSON.stringify(n));
      renderAnnouncements();
    } else if (a) {
      const n = announcements().find(
        (e) => e.id === a.dataset.editAnnouncement,
      );
      n && fillAnnouncementForm(n);
    } else if (n) {
      openDetail(n.dataset.id);
    }
  }),
  $("#preview-announcement").addEventListener("click", () => {
    const e = Object.fromEntries(new FormData($("#share-form")));
    if (!e.title || !e.category || !e.neighborhood) {
      $("#form-success").textContent =
        "Renseignez au moins le nom, la catégorie et le quartier pour prévisualiser.";
      $("#form-success").hidden = false;
      return;
    }
    const t = $("#announcement-preview");
    t.innerHTML = `<strong>${escapeHtml(e.title)}</strong><span>${escapeHtml(e.category)} · ${escapeHtml(e.neighborhood)} · du ${escapeHtml(e.availableFrom || "date à préciser")} au ${escapeHtml(e.availableTo || "date à préciser")}</span>`;
    t.hidden = false;
  }),
  $("#share-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const t = Object.fromEntries(new FormData(e.currentTarget)),
      a = announcements(),
      n = e.currentTarget.dataset.editing,
      r = a.find((e) => e.id === n),
      s = r || fakeAssociation(),
      o = {
      ...t,
      id: n || announcementId(),
      associationName: s.associationName,
      associationPhone: s.associationPhone,
      editToken: n
        ? a.find((e) => e.id === n)?.editToken || announcementId()
        : announcementId(),
      },
      i = n ? a.map((e) => (e.id === n ? o : e)) : [...a, o];
    (localStorage.setItem("assoshare-announcements", JSON.stringify(i)),
      ($("#form-success").textContent =
        `${n ? "Annonce modifiée" : "Annonce enregistrée"} pour ${t.email} (mode démonstration).`),
      ($("#form-success").hidden = !1),
      (e.currentTarget.dataset.editing = ""),
      ($("#submit-announcement").textContent = "Publier l’annonce ↗"),
      ($("#announcement-preview").hidden = true),
      e.currentTarget.reset(),
      renderAnnouncements());
  }),
  renderCards(),
  renderAnnouncements());
