let notes = [];
let isDarkMode = false;
let editingIndex = -1; // Track the index of the note being edited
let quill; // Define quill outside the DOMContentLoaded event

var Size = Quill.import('attributors/style/size');
var Font = Quill.import('attributors/class/font');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px'];
Font.whitelist = ['times-new-roman', 'arial', 'courier-new', 'georgia', 'verdana','code'];
Quill.register(Font, true);
Quill.register(Size, true);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    quill = new Quill('#noteContent', {
        theme: 'snow',
        placeholder: '  Start typing your note here and enjoy the app...',
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
    quill.on('selection-change', function (range) {
        const floatingToolbar = document.getElementById('floatingToolbar');
        const mainFont = document.getElementById('fontFamily');
        const floatingFont = document.getElementById('floatingFontFamily');
        const mainSize = document.getElementById('fontSize');
        const floatingSize = document.getElementById('floatingFontSize');
        const editorContainer = document.querySelector('.ql-container'); // Editor container
        const editorRect = editorContainer.getBoundingClientRect(); // Get editor position
    
        //Get formatting when there is no selection
            if (range) {
                const format = quill.getFormat(range);
                console.log("Selected text format:", format);
                if (format.size) {
                    const sizeValue = format.size.replace('px', '');
                    document.getElementById('fontSize').value = sizeValue;
                }
                if (format.font) {
                    document.getElementById('fontFamily').value = format.font;
                }
            }

        // Check if there is a selection
        if (range && range.length > 0) {
            try {
                // Get formatting of selected text
                const format = quill.getFormat(range);
                console.log("Selected text format:", format);
    
                // Update font dropdowns in both toolbars
                if (format.font) {
                    if (mainFont && mainFont.value !== format.font) mainFont.value = format.font;
                    if (floatingFont && floatingFont.value !== format.font) floatingFont.value = format.font;
                }
    
                // Update font size dropdowns in both toolbars
                if (format.size) {
                    const sizeValue = format.size.replace('px', '');
                    if (mainSize && mainSize.value !== sizeValue) mainSize.value = sizeValue;
                    if (floatingSize && floatingSize.value !== sizeValue) floatingSize.value = sizeValue;
                }
    
                // Position Floating Toolbar
                const bounds = quill.getBounds(range.index);
                const left = editorRect.left + bounds.left + window.scrollX;
                const top = editorRect.top + bounds.top + window.scrollY - 50; // 50px above selection
    
                floatingToolbar.style.left = `${left}px`;
                floatingToolbar.style.top = `${top}px`;
                floatingToolbar.style.display = 'block';
    
            } catch (error) {
                console.error("Error updating selection:", error);
            }
        } else {
            floatingToolbar.style.display = 'none'; // Hide when no selection
        }
    });
    
    
    
    // Hide toolbar when clicking outside
    document.addEventListener('click', function(event) {
        const toolbar = document.getElementById('floatingToolbar');
        if (!toolbar.contains(event.target) && !document.querySelector('.ql-container').contains(event.target)) {
            toolbar.style.display = 'none';
        }
    });    

    // Update font size and font family dropdown when text changes
    let previousLineNumber = 1;
    quill.on('text-change', (delta, oldDelta, source) => {
        const scroll = quill.scroll;
        const currentLineNumber = scroll.children.length;
        console.log("Number of lines in scroll", currentLineNumber);

        if (currentLineNumber > previousLineNumber) {
            // Log current font style
            const currentFormat = quill.getFormat();
            console.log("Current font style:", currentFormat.font);
            console.log("Current font size:", currentFormat.size);

                //Add wait time to allow the font style to be applied
            setTimeout(() => {
                quill.format('font', currentFormat.font);
                quill.format('size', currentFormat.size);
                document.getElementById('fontFamily').value = currentFormat.font;
                document.getElementById('fontSize').value = currentFormat.size.replace('px', '');
            }, 10);
        }

        previousLineNumber = currentLineNumber;
    });
});

function toggleFullScreen() {
    const editorArea = document.querySelector('.editor-area');
    const notesArea = document.querySelector('.notes-area');

    if (!document.fullscreenElement) {
        editorArea.requestFullscreen();
        notesArea.style.display = 'none'; // Hide the notes area
    } else {
        document.exitFullscreen().then(() => {
            notesArea.style.display = 'block'; // Show the notes area
        }).catch((err) => {
            console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        });
    }
}
document.addEventListener('fullscreenchange', () => {
    const notesArea = document.querySelector('.notes-area');
    if (!document.fullscreenElement) {
        notesArea.style.display = 'block'; // Show the notes area when exiting full-screen mode
    }
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

// Function to edit notes
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
    
    const noteContent = notes[index]; // Get the note content
    console.log("Loaded Note Content:", noteContent); // Log to verify content
    
    // Clear the editor before inserting new content
    quill.setContents([]); 
    
    // Insert the content correctly
    quill.root.innerHTML = noteContent; //switch to below if this is not working
    // quill.clipboard.dangerouslyPasteHTML(0, noteContent); // Uncomment if needed
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
function addBulletPoints() {
    const format = quill.getFormat();
    quill.format('list', format.list === 'bullet' ? false : 'bullet');
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

// Change Font Size from Main Toolbar
function changeFontSize() {
    if (!quill) return;

    const size = document.getElementById('fontSize').value + 'px';
    quill.format('size', size);

    // Sync floating toolbar
    document.getElementById('floatingFontSize').value = size.replace('px', '');
}

// Change Font Size from Floating Toolbar
function changeFontSizeFloating() {
    if (!quill) return;

    const size = document.getElementById('floatingFontSize').value + 'px';
    quill.format('size', size);

    // Sync main toolbar
    document.getElementById('fontSize').value = size.replace('px', '');
}

function changeFontFamily() {
    if (!quill) return;

    const fontFamily = document.getElementById('fontFamily').value;
    
    if (fontFamily === 'code') {
        quill.format('code-block', true); // Apply code block formatting
    } else {
        quill.format('code-block', false); // Remove code block if another font is selected
        quill.format('font', fontFamily); // Apply selected font
    }
    // Sync floating toolbar
    document.getElementById('floatingFontFamily').value = fontFamily;
}
function changeFontFamilyFloating() {
    if (!quill) return;

    const fontFamily = document.getElementById('floatingFontFamily').value;
    
    if (fontFamily === 'code') {
        quill.format('code-block', true); // Apply code block formatting
    } else {
        quill.format('code-block', false); // Remove code block if another font is selected
        quill.format('font', fontFamily); // Apply selected font
    }
    // Sync main toolbar
    document.getElementById('fontFamily').value = fontFamily;
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