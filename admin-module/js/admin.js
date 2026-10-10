document.addEventListener("DOMContentLoaded", () => {
  // Authenticate user as Admin
  requireAdminAuth();
  renderAuthNav();

  const addForm = document.getElementById("adminAddForm");
  
  // Render Initial Admin Table
  renderAdminTable();

  // Handle New Title Creation
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("addTitle").value.trim();
    const category = document.getElementById("addCategory").value;
    const description = document.getElementById("addDesc").value.trim();
    const videoUrl = document.getElementById("addUrl").value.trim();
    const poster = document.getElementById("addPoster").value.trim() || "images/c01.jpg";

    const catalog = getContentLibrary();
    const newId = "c" + String(Date.now()).slice(-4);

    const newMedia = {
      id: newId,
      title: title,
      category: category,
      year: new Date().getFullYear(),
      duration: "10m",
      description: description,
      videoUrl: videoUrl,
      poster: poster
    };

    catalog.push(newMedia);
    saveContentLibrary(catalog);

    addForm.reset();
    renderAdminTable();
    alert(`Success: "${title}" added to stream catalog!`);
  });
});

// Render table list of stored catalog items
function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;

  const catalog = getContentLibrary();

  if (catalog.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:1rem; text-align:center; color:#a1a1aa;">No titles present in catalog.</td></tr>`;
    return;
  }

  tbody.innerHTML = catalog.map(item => `
    <tr style="border-bottom: 1px solid #27272a; color: #f4f4f5;">
      <td style="padding: 0.75rem;"><code>${item.id}</code></td>
      <td style="padding: 0.75rem; font-weight: 600;">${item.title}</td>
      <td style="padding: 0.75rem;"><span style="background:#27272a; padding: 0.2rem 0.6rem; border-radius:4px; font-size:0.8rem;">${item.category}</span></td>
      <td style="padding: 0.75rem; color:#a1a1aa; font-size:0.85rem;">${item.poster}</td>
      <td style="padding: 0.75rem; text-align: right;">
        <button onclick="removeCatalogItem('${item.id}')" class="btn" style="background:#dc2626; color:white; padding:0.3rem 0.7rem; font-size:0.8rem; border:none; border-radius:4px; cursor:pointer;">Delete</button>
      </td>
    </tr>
  `).join("");
}

// Delete item handler
function removeCatalogItem(id) {
  if (confirm(`Are you sure you want to delete item ID: ${id}?`)) {
    let catalog = getContentLibrary();
    catalog = catalog.filter(item => item.id !== id);
    saveContentLibrary(catalog);
    renderAdminTable();
  }
}