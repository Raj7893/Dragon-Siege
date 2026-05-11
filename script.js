const STORAGE_KEY = "dragon_siege_tracker_data";

// Initialize and Load Data
window.addEventListener("load", () => {
  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  if (savedData) {
    // Restore saved matches
    savedData.qualifying.forEach(m => addMatch('qualifying-list', m.t1, m.t2, m.winner, m.isActive));
    savedData.elimination.forEach(m => addMatch('elimination-list', m.t1, m.t2, m.winner, m.isActive));
  } else {
    // Default starting matches
    addMatch('qualifying-list', 'Team 1', 'Team 2');
    addMatch('elimination-list', 'Finalist A', 'Finalist B');
  }

  // Trigger Fade-in Animation
  const boxes = document.querySelectorAll(".match-box");
  boxes.forEach((box, index) => {
    setTimeout(() => {
      box.classList.add("show");
    }, index * 300);
  });
});

// Function to create and add a match
function addMatch(listId, t1 = "New Team", t2 = "New Team", winnerTxt = "Winner: ______", isActive = false) {
  const list = document.getElementById(listId);
  const wrapper = document.createElement('div');
  wrapper.className = 'match-wrapper';

  wrapper.innerHTML = `
    <button class="delete-btn" onclick="removeMatch(this)">✕</button>
    <div class="match">
      <div class="team" contenteditable="true" oninput="saveAll()">${t1}</div>
      <div class="vs">VS</div>
      <div class="team" contenteditable="true" oninput="saveAll()">${t2}</div>
    </div>
    <div class="winner ${isActive ? 'active' : ''}" 
         contenteditable="true" 
         oninput="saveAll()" 
         onclick="toggleWinner(this)">${winnerTxt}</div>
  `;

  list.appendChild(wrapper);
  saveAll();
}

// Remove match function
function removeMatch(btn) {
  if(confirm("Delete this match?")) {
    btn.parentElement.remove();
    saveAll();
  }
}

// Toggle the glow effect on winners
function toggleWinner(el) {
  // Only toggle if the user isn't actively typing (to allow text editing)
  if (document.activeElement !== el) {
    el.classList.toggle("active");
    saveAll();
  }
}

// Save all current data to Local Storage
function saveAll() {
  const data = {
    qualifying: getSectionData('qualifying-list'),
    elimination: getSectionData('elimination-list')
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Helper to extract text from a section
function getSectionData(listId) {
  const matches = [];
  const wrappers = document.getElementById(listId).querySelectorAll('.match-wrapper');
  
  wrappers.forEach(wrapper => {
    const teams = wrapper.querySelectorAll('.team');
    const winner = wrapper.querySelector('.winner');
    matches.push({
      t1: teams[0].innerText,
      t2: teams[1].innerText,
      winner: winner.innerText,
      isActive: winner.classList.contains('active')
    });
  });
  return matches;
}
