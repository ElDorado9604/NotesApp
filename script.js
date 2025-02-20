let notes = [];
let isDarkMode = false;
let editingIndex = -1; // Track the index of the note being edited
let quill; // Define quill outside the DOMContentLoaded event

var Size = Quill.import('attributors/style/size');
var Font = Quill.import('attributors/class/font');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px'];
Font.whitelist = ['times-new-roman', 'arial', 'courier-new', 'georgia', 'verdana'];
Quill.register(Font, true);
Quill.register(Size, true);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    quill = new Quill('#noteContent', {
        theme: 'snow',
        placeholder: '  Start typing your note here and enjoy...',
        modules: {
            toolbar: false, // We'll handle the toolbar manually
            size: {
                options: ['12px', '14px', '16px', '18px', '20px']
            }
        }
    });

    // Set default font style and size
    quill.format('font', 'arial');
    quill.format('size', '16px');
    document.getElementById('fontFamily').value = 'arial';
    document.getElementById('fontSize').value = '16';
        // Update font size dropdown when selection changes
        quill.on('selection-change', function(range) {
        if (range) {
            const format = quill.getFormat(range);
            if (format.size) {
                const sizeValue = format.size.replace('px', '');
                document.getElementById('fontSize').value = sizeValue;
            }
            if (format.font) {
                document.getElementById('fontFamily').value = format.font;
            }
        }
    });
});

// Function to display notes
function displayNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerHTML = note; // Render HTML content

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editNote(index);
        li.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteNote(index);
        li.appendChild(deleteButton);

        notesList.appendChild(li);
    });
}

// Function to add a note
document.getElementById('addNoteButton').onclick = function() {
    if (!quill) return;

    const noteContent = quill.root.innerHTML;

    if (noteContent) {
        if (editingIndex !== -1) {
            // Update existing note
            notes[editingIndex] = noteContent;
            editingIndex = -1; // Reset editing index
        } else {
            // Add new note
            notes.push(noteContent);
        }
        quill.root.innerHTML = '';
        displayNotes();
    } else {
        alert('Please enter a note.');
    }
};

// Function to edit a note
function editNote(index) {
    if (!quill) return;

    const noteContent = notes[index];
    quill.root.innerHTML = noteContent;
    editingIndex = index;
}

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
    
    const toolbar = document.querySelector('.toolbar');
    toolbar.classList.toggle('dark-mode', isDarkMode);
}

// Text Formatting Functions
function boldText() {
    if (!quill) return;
    
    const format = quill.getFormat();
    quill.format('bold', !format.bold);
}

function italicText() {
    if (!quill) return;
    
    const format = quill.getFormat();
    quill.format('italic', !format.italic);
}

function underlineText() {
    if (!quill) return;
    
    const format = quill.getFormat();
    quill.format('underline', !format.underline);
}

function alignLeft() {
    if (!quill) return;
    // Remove any existing alignment first
    quill.format('align', false);
    // Then set left alignment
    quill.format('align', 'left');
}

function alignCenter() {
    if (!quill) return;

    quill.format('align', 'center');
}

function alignRight() {
    if (!quill) return;

    quill.format('align', 'right');
}


function changeFontSize() {
    if (!quill) return;

    const fontSize = document.getElementById('fontSize').value;

    quill.format('size', fontSize + 'px');
}

function changeFontFamily() {
    if (!quill) return;

    const fontFamily = document.getElementById('fontFamily').value;
    quill.format('font', fontFamily);
}

// Additional functions for the menu options
function newNote() {
    if (!quill) return;

    quill.root.innerHTML = '';
    editingIndex = -1; // Reset editing index when creating a new note
}

function saveNote() {
    alert('Save functionality to be implemented.');
}

function openNote() {
    alert('Open functionality to be implemented.');
}

function printNote() {
    window.print();
}

function undo() {
    if (!quill) return;

    document.execCommand('undo', false, null);
}

function redo() {
    if (!quill) return;

    document.execCommand('redo', false, null);
}

function cut() {
    if (!quill) return;

    document.execCommand('cut', false, null);
}

function copy() {
    if (!quill) return;

    document.execCommand('copy', false, null);
}

function paste() {
    if (!quill) return;

    document.execCommand('paste', false, null);
}

function selectAll() {
    if (!quill) return;

    document.execCommand('selectAll', false, null);
}

function findAndReplace() {
    alert('Find and Replace functionality to be implemented.');
}

function insertImage() {
    alert('Insert Image functionality to be implemented.');
}

function insertLink() {
    alert('Insert Link functionality to be implemented.');
}

function insertTable() {
    alert('Insert Table functionality to be implemented.');
}
