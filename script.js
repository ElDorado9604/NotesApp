let notes = [];

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
document.getElementById('exportButton').onclick = function() {
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
};

// Function to import notes
document.getElementById('importButton').onclick = function() {
    const fileInput = document.getElementById('importFile');
    
    if (fileInput.files.length > 0) {
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
        
        fileReader.readAsText(fileInput.files[0]);
        fileInput.value = ''; // Reset the input
    } else {
        alert('Please select a file to import.');
    }
};
