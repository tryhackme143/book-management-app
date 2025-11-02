const API_URL = 'http://localhost:3000';

// DOM Elements
const addBookForm = document.getElementById('addBookForm');
const snackbar = document.getElementById('snackbar');
const snackbarMessage = document.getElementById('snackbar-message');
const booksListDiv = document.getElementById('booksList');
const loadingDiv = document.getElementById('loading');
const bookCountSpan = document.getElementById('bookCount');

// Fetch and display all books
async function fetchBooks() {
    try {
        loadingDiv.style.display = 'flex';
        booksListDiv.innerHTML = '';
        
        const response = await fetch(`${API_URL}/books`);
        const result = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (result.data && result.data.length > 0) {
            bookCountSpan.textContent = result.data.length;
            displayBooks(result.data);
        } else {
            booksListDiv.innerHTML = `
                <div class="no-books">
                    <span class="material-icons">library_books</span>
                    <h3>No books yet</h3>
                    <p>Add your first book using the form above</p>
                </div>
            `;
            bookCountSpan.textContent = '0';
        }
    } catch (error) {
        loadingDiv.style.display = 'none';
        console.error('Error fetching books:', error);
        booksListDiv.innerHTML = `
            <div class="no-books">
                <span class="material-icons">error_outline</span>
                <h3>Connection Error</h3>
                <p>Make sure the backend server is running on port 3000</p>
            </div>
        `;
    }
}

// Display books in the UI with Material Design cards
function displayBooks(books) {
    booksListDiv.innerHTML = books.map(book => `
        <div class="book-card" onclick="showBookDetails(${book.book_id})">
            <div class="book-card-header">
                <div class="book-id-badge">ID: ${book.book_id}</div>
                <div class="book-title">${escapeHtml(book.title)}</div>
            </div>
            <div class="book-card-body">
                <div class="book-author">
                    <span class="material-icons">person</span>
                    ${escapeHtml(book.author)}
                </div>
                <div class="book-price-section">
                    <span class="book-price-label">Price</span>
                    <span class="book-price">$${parseFloat(book.price).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show book details (placeholder for future functionality)
function showBookDetails(bookId) {
    showSnackbar(`Book ID: ${bookId} - Details feature coming soon!`, 'info');
}

// Handle form submission
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        price: parseFloat(document.getElementById('price').value)
    };
    
    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSnackbar('Book added successfully!', 'success');
            addBookForm.reset();
            
            // Remove focus from inputs to reset Material labels
            document.querySelectorAll('.material-input').forEach(input => {
                input.blur();
            });
            
            fetchBooks(); // Refresh the book list
        } else {
            showSnackbar(result.error || 'Error adding book', 'error');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showSnackbar('Connection error. Make sure the backend is running.', 'error');
    }
});

// Show snackbar message
function showSnackbar(text, type = 'info') {
    snackbarMessage.textContent = text;
    snackbar.className = 'snackbar show';
    
    if (type === 'success') {
        snackbar.classList.add('success');
    } else if (type === 'error') {
        snackbar.classList.add('error');
    }
    
    setTimeout(() => {
        closeSnackbar();
    }, 4000);
}

// Close snackbar
function closeSnackbar() {
    snackbar.classList.remove('show', 'success', 'error');
}

// Scroll to top function for FAB
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load books when page loads
document.addEventListener('DOMContentLoaded', fetchBooks);