let notes = [];
let isDarkMode = false;

// Function to display notes
function displayNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteNote(index);

        li.appendChild(deleteButton);
        notesList.appendChild(li);
    });
}

// Function to add a note
document.getElementById('addNoteButton').onclick = function() {
    const noteContent = document.getElementById('noteContent').value;

    if (noteContent) {
        notes.push(noteContent);
        document.getElementById('noteContent').value = '';
        displayNotes();
    } else {
        alert('Please enter a note.');
    }
};

// Function to delete a note
function deleteNote(index) {
    notes.splice(index, 1);
    displayNotes();
}

// Function to export notes
function exportNotes() {
    const blob = new Blob([JSON.stringify(notes)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';

    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Function to import notes
function importNotes() {
    const fileInput = document.getElementById('importFile');

    fileInput.click(); // Programmatically trigger the file input

    fileInput.onchange = function(event) {
        const file = event.target.files[0];

        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = function(event) {
                try {
                    const importedNotes = JSON.parse(event.target.result);

                    if (Array.isArray(importedNotes)) {
                        notes = importedNotes;
                        displayNotes();
                    } else {
                        alert('Invalid data format. Please upload a valid JSON file.');
                    }
                } catch (error) {
                    alert('Error reading the file. Please try again.');
                }
            };

            fileReader.readAsText(file);
            fileInput.value = ''; // Reset the input
        } else {
            alert('Please select a file to import.');
        }
    };
}

// Function to toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const container = document.querySelector('.container');

    body.classList.toggle('dark-mode', isDarkMode);
    container.classList.toggle('dark-mode', isDarkMode);

    // Toggle dark mode for menu items
    const dropbtns = document.querySelectorAll('.dropbtn');
    dropbtns.forEach(button => button.classList.toggle('dark-mode', isDarkMode));

    const dropdownContentLinks = document.querySelectorAll('.dropdown-content a');
    dropdownContentLinks.forEach(link => link.classList.toggle('dark-mode', isDarkMode));
}

// Text Formatting Functions
function boldText() {
    document.execCommand('bold', false, null);
}

function italicText() {
    document.execCommand('italic', false, null);
}

function underlineText() {
    document.execCommand('underline', false, null);
}

// Additional functions for the menu options
function newNote() {
    document.getElementById('noteContent').value = '';
}

function saveNote() {
    alert('Save functionality to be implemented.');
}

function openNote() {
    alert('Open functionality to be implemented.');
}

function undo() {
    document.execCommand('undo', false, null);
}

function redo() {
    document.execCommand('redo', false, null);
}

function cut() {
    document.execCommand('cut', false, null);
}

function copy() {
    document.execCommand('copy', false, null);
}

function paste() {
    document.execCommand('paste', false, null);
}

function selectAll() {
    document.execCommand('selectAll', false, null);
}
