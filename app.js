const API = window.axios.create({
  baseURL: 'https://to-you-anonymously-backend-56wy.onrender.com',
  headers: { 'Content-Type': 'application/json' }
});

const notesContainer = document.getElementById("notesContainer");
const form = document.getElementById("noteForm");
const senderInput = document.getElementById("senderName");
const messageInput = document.getElementById("message");
const recipientInput = document.getElementById("recipientName");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteModal = document.getElementById("noteModal");
const closeModalBtn = document.querySelector(".close");
const searchInput = document.getElementById("searchInput");

let notes = [];

addNoteBtn.onclick = () => (noteModal.style.display = "block");
closeModalBtn.onclick = () => (noteModal.style.display = "none");
window.onclick = (e) => {
  if (e.target === noteModal) noteModal.style.display = "none";
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    toName: recipientInput.value.trim(),           // 🎯 required
    message: messageInput.value.trim(),            // 🎯 required
    fromName: senderInput.value.trim() || 'Anonymous' // optional
  };
  
  if (!data.message) return alert("Please enter a message.");

  try {
    const res = await API.post("/api/notes", data);
    if (res.data.success) {
      notes.unshift(res.data.data);
      displayNotes(notes);
      senderInput.value = "";
      messageInput.value = "";
      noteModal.style.display = "none";
    }
  } catch (err) {
    alert("Error posting note.");
    console.error(err);
  }
});

function displayNotes(list) {
  notesContainer.innerHTML = "";
  if (!list.length) {
    notesContainer.innerHTML = "<p>No notes yet.</p>";
    return;
  }

  list.forEach((n) => {
    const note = document.createElement("div");
    note.className = "note";
    note.innerHTML = `
      <p class="message">${n.message}</p>
      <p class="sender">— From ${n.fromName || "Anonymous"}</p>
    `;
    notesContainer.appendChild(note);
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filtered = notes.filter((n) =>
    (n.toName || "").toLowerCase().includes(query) ||
    (n.message || "").toLowerCase().includes(query)
  );

  displayNotes(filtered);
});


async function loadNotes() {
  try {
    const res = await API.get("/api/notes");
    if (res.data.success) {
      notes = res.data.data;
      displayNotes(notes);
    }
  } catch (err) {
    console.error("Error fetching notes", err);
  }
}

loadNotes();
