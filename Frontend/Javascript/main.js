 //THE JS FOR THE HELP
     // Get the elements
    const helpTabBtn = document.getElementById('helpTabBtn');
    const helpSection = document.getElementById('helpSection');
    const aboutBtn = document.getElementById('aboutBtn');
    const sellingBtn = document.getElementById('sellingBtn');
    const contactBtn = document.getElementById('contactBtn');
    const aboutContent = document.getElementById('aboutContent');
    const sellingContent = document.getElementById('sellingContent');
    const contactContent = document.getElementById('contactContent');
    const closeHelpButtons = document.querySelectorAll('.close-help');

    // Toggle help section visibility
    helpTabBtn.addEventListener('click', function() {
        if (helpSection.style.display === 'none') {
            helpSection.style.display = 'block';
            // Hide all content sections when opening main help
            aboutContent.style.display = 'none';
            sellingContent.style.display = 'none';
            contactContent.style.display = 'none';
        } else {
            helpSection.style.display = 'none';
        }
    });

    // Show specific help content
    aboutBtn.addEventListener('click', function() {
        aboutContent.style.display = 'block';
        sellingContent.style.display = 'none';
        contactContent.style.display = 'none';
    });

    sellingBtn.addEventListener('click', function() {
        sellingContent.style.display = 'block';
        aboutContent.style.display = 'none';
        contactContent.style.display = 'none';
    });

    contactBtn.addEventListener('click', function() {
        contactContent.style.display = 'block';
        aboutContent.style.display = 'none';
        sellingContent.style.display = 'none';
    });

    // Close buttons functionality
    closeHelpButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide the parent content section
            this.parentElement.style.display = 'none';
        });
    });
 
// THE JS FOR THE SEARCH BAR AND FUCNTION 
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('searchResults');
    const mainSection = document.getElementById('main');
            
        // Function to highlight matching text
        function highlightText(text, searchTerm) {
            if (!searchTerm || !text) return text;
                const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
                return text.toString().replace(regex, '<span class="highlight">$1</span>');
            }
            
            // Helper function to escape regex special characters
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
            
        // Function to fetch search results from backend
        async function fetchSearchResults(searchTerm) {
                
        try {
            resultsContainer.innerHTML = '<div class="loading">Searching books...</div>';
            mainSection.style.display = 'none'; 
                    
            const response = await fetch('https://wellsbooks-backend.onrender.com/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchTerm: searchTerm })
            });
                    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
                    
            const data = await response.json();
                    
            // Transform the backend data to match frontend expectations
            return data.map(book => ({
                        
                    name: book.title,
                    author: book.author,
                    category: book.category,
                    price: book.price,
                    description: book.description,
                    image: book.image_url ? `/book-covers/${book.image_url}` : 'https://via.placeholder.com/300x200?text=No+Image'

            }));
                    
        } catch (error) {
            console.error('Error fetching search results:', error);
             resultsContainer.innerHTML = '<div class="no-results">Error loading results. Please try again.</div>';
            return [];
        }
    }
            
    // Display search results
    function displayResults(results, searchTerm) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No books found matching your search.</div>';
            return;
        }

        const displayResults = results.slice(0, 3);

        const html = results.map(book => `
            <div class="book-card-result">
                <div class="book-image-container">
                    <img src="${book.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                    alt="${book.name}" 
                    class="book-image-result"
                    onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                </div>

                <div class="book-info-result">
                    <h3 class="book-title-result">
                       <p><strong>Title:</strong> ${highlightText(book.name, searchTerm)}</p>
                    </h3>
                    <p class="book-isbn-result">
                        <p><strong>Category:</strong> ${book.category}</p> 
                    </p>
                    <p class="book-author-result">
                       <p><strong>Author:</strong> ${highlightText(book.author, searchTerm)}</p>                            
                    </p>
                    <p class="book-price-result">
                        <p><strong>Price:</strong> Ksh${book.price}</p>                            
                    </p>
                    <p class="book-desc-result">
                        <p><strong>Description:</strong> ${book.description}</p>                            
                    </p>

                    <button class="buyButton" data-book-id="${book.category}">Buy Now</button>
                </div>
            </div>        
        `).join('');

        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block'; // Ensure visibility
      // Set grid properties for exactly 3 items
        resultsContainer.style.display = 'grid';
        resultsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)'; // Always 3 columns
        resultsContainer.style.gap = '20px';
        resultsContainer.style.padding = '20px';
        resultsContainer.style.justifyContent = 'center'; // Center the grid

        // Add event listeners to all buy buttons
        document.querySelectorAll('.buyButton').forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-book-id');
                const bookCard = this.closest('.book-card-result');
                const book = results.find(b => b.category === categoryId);
                        
                if (book) {
                    showPurchaseForm(book, bookCard);
                    }
                });
            });

        }



            // Function to show purchase form
            function showPurchaseForm(book, bookCard) {
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'form-overlay';
                
                // Create form container
                const formContainer = document.createElement('div');
                formContainer.className = 'form-container';
                formContainer.innerHTML = `
                
                        <h3>Purchase "${book.name}"</h3>
                        <div class="form-group">
                            <label for="name">Full Name:</label>
                            <input type="text" id="name" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number:</label>
                            <input type="tel" id="phone" placeholder="Enter your phone number" required>
                        </div>
                        <div class="form-group">
                            <label for="location">Location:</label>
                            <input type="location" id="location" placeholder="Enter your location here..." required>
                        </div>
                        <div class="form-group">
                            <label for="quantity">Quantity:</label>
                            <input type="number" id="quantity" min="1" value="1">
                        </div>
                        <div class="form-group">
                            <p class="total-price">Total: Ksh${book.price}</p>
                        </div>
                        <div class="form-buttons">
                            <button id="submitPurchase" class="form-button submit">Place Order</button>
                            <button id="cancelPurchase" class="form-button cancel">Cancel</button>
                        </div>
                        <div id="purchaseresult"></div>
                    
                `;
                
                // Add to DOM
                overlay.appendChild(formContainer);
                document.body.appendChild(overlay);
                
                // Disable scrolling on body
                document.body.style.overflow = 'hidden';
                
                // Store original display style of book card
                const originalDisplay = bookCard.style.display;
                bookCard.style.display = 'none';
                
                // Calculate total price when quantity changes
                const quantityInput = formContainer.querySelector('#quantity');
                const totalPrice = formContainer.querySelector('.total-price');
                
                quantityInput.addEventListener('change', () => {
                    const total = (book.price * quantityInput.value).toFixed(2);
                    totalPrice.textContent = `Total: Ksh${total}`;
                });
                
                // Cancel button functionality
                formContainer.querySelector('#cancelPurchase').addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                    bookCard.style.display = originalDisplay;
                });
                
                // Submit button functionality
                formContainer.querySelector('#submitPurchase').addEventListener('click', async function() {
                    const customerName = formContainer.querySelector('#name').value.trim();
                    const phone = formContainer.querySelector('#phone').value.trim();
                    const location = formContainer.querySelector('#location').value.trim();
                    const quantity = formContainer.querySelector('#quantity').value.trim();
                    const purchaseresult = formContainer.querySelector('#purchaseresult');
                    
                    if (!customerName || !phone || !location) {
                        purchaseresult.innerHTML = '<p class="error-message">Please fill in all required fields.</p>';
                        return;
                    }
                    
                    // Show loading state
                    this.disabled = true;
                    this.textContent = 'Processing...';
                    purchaseresult.innerHTML = '<p class="loading-message">Processing your order, please wait...</p>';
                    setTimeout(async () => {
                        try {
                            const response = await fetch("https://wellsbooks-backend.onrender.com/place-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    customerName,
                                    phone,
                                    location,
                                    quantity,
                                    title: book.name,
                                    author: book.author,
                                    category: book.category,
                                    price: book.price
                                })
                            });
                        
                            const result = await response.json();
                        
                            if (response.ok) {
                                this.innerHTML = 'Wait for the response';
                                purchaseresult.innerHTML = '<p class="success-message">Order placed successfully! 📚</p>';
                                setTimeout(() => {
                                    document.body.removeChild(overlay);
                                    document.body.style.overflow = '';
                                }, 2000);

                                // Show the `main` div after successful submission
                               const mainDivformss = document.getElementById('main');
                               if (mainDivformss) {
                                     mainDivformss.style.display = 'block'; // Ensure `#main` is visible
                                }
                            } else {
                                this.disabled = false;
                                this.textContent = 'Place Order';
                                 purchaseresult.innerHTML = `<p class="error-message">${result.message || 'Error placing order'}</p>`;
                            }
                        } catch (error) {
                            console.error("Error placing order:", error);
                            this.disabled = false;
                            this.textContent = 'Place Order';
                            purchaseresult.innerHTML = '<p class="error-message">Failed to place order. Please try again.</p>';
                        }
                    }, 5000);
 
                });
            }

            // Perform search
        async function performSearch() {
            const searchTerm = searchInput.value.trim();
                
        if (!searchTerm) {
            resultsContainer.innerHTML = '<div class="no-results">Please enter a search term</div>';
            return;
        }
                
            const results = await fetchSearchResults(searchTerm);
            displayResults(results, searchTerm);
        }
            
        // Event listeners
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
        
   
        
//FUNCTION FOR THE BOOK DIV DISPLAYED ON THE SCREEN
document.addEventListener("DOMContentLoaded", function() {
    // Book details functionality
    const bookCards = document.querySelectorAll('.book-card');
    const detailsContainer = document.createElement('div');
    detailsContainer.id = 'book-details-container';
    document.body.appendChild(detailsContainer);

    // Create overlay and purchase form elements
    const overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);

        const purchaseForm = document.createElement('div');
        purchaseForm.id = 'purchaseForm';
        purchaseForm.className = 'purchase-form';
        document.body.appendChild(purchaseForm);

        // Add click event listeners to each book card
        bookCards.forEach(card => {
            card.addEventListener('click', function() {
                showBookDetails(this);
            });
        });

        function showBookDetails(card) {
            // Highlight selected card
            bookCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
                
            // Get book details from card
            const book = {
                title: card.querySelector('.book-title').textContent,
                author: card.querySelector('.book-author').textContent,
                price: card.querySelector('.book-price').textContent,
                image: card.querySelector('.book-image img').src,
                description: card.querySelector('.book-description').textContent,
                category: card.querySelector('.book-category').textContent,
            };

            // Display book details
            detailsContainer.innerHTML = `
            <div class="book-details">
                <div class="book-details-header">
                    <h2>${book.title}</h2>
                    <button id="close-details" class="close-button">×</button>
                </div>
                <div class="book-details-content">
                <div class="book-image-detail">
                    <img src="${book.image}" alt="${book.title}">
                </div>
                <div class="book-info-detail">
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Price:</strong> ${book.price}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <div class="book-description">
                        <h3>Description</h3>
                        <p>${book.description}</p>
                    </div>
                    <button class="buyButton" id="buyButton">Buy Now</button>
                </div>
            </div>
                `;

            // Show details container
            detailsContainer.style.display = 'block';

            // Close button functionality
            document.getElementById('close-details').addEventListener('click', function() {
                detailsContainer.style.display = 'none';
                card.classList.remove('selected');
            });

            // Buy button functionality
            document.getElementById('buyButton').addEventListener('click', function() {
               // Hide book details
                detailsContainer.style.display = 'none';
                    
                // Show overlay
                overlay.style.display = 'block';
                    
                // Populate and show purchase form
                purchaseForm.innerHTML = `
                
                    <h3>Purchase "${book.title}"</h3>
                    <div class="form-group">
                        <label for="name">Full Name:</label>
                        <input type="text" id="name" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number:</label>
                        <input type="tel" id="phone" placeholder="Enter your phone number" required>
                    </div>
                     <div class="form-group">
                        <label for="location">Location:</label>
                        <input type="location" id="location" placeholder="Enter your location here..." required>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" min="1" value="1">
                    </div>
                    <div class="form-group">
                        <p class="total-price">Total: Ksh${book.price}</p>
                    </div>
                    <div class="form-buttons">
                        <button id="submitPurchase" class="form-button submit">Place Order</button>
                        <button id="cancelPurchase" class="form-button cancel">Cancel</button>
                    </div>
                    <div id="purchaseresult"></div>
                    </div>
                `;
                    
                purchaseForm.style.display = 'block';
                    
                // Calculate total when quantity changes
                const quantityInput = purchaseForm.querySelector('#quantity');
                quantityInput.addEventListener('input', function() {
                    const quantity = parseInt(this.value) || 1;
                    const price = parseFloat(book.price.replace(/[^\d.]/g, ''));
                    const total = quantity * price;
                    purchaseForm.querySelector('.total-price').textContent = `Total: Ksh ${total.toFixed(2)}`;
                });
                    
                // Cancel button functionality
                purchaseForm.querySelector('#cancelPurchase').addEventListener('click', function() {
                    overlay.style.display = 'none';
                    purchaseForm.style.display = 'none';
                    detailsContainer.style.display = 'block';
                });

                // Submit button functionality
                purchaseForm.querySelector('#submitPurchase').addEventListener('click', async function() {
                    const customerName = purchaseForm.querySelector('#name').value.trim();
                    const phone = purchaseForm.querySelector('#phone').value.trim();
                    const location = purchaseForm.querySelector('#location').value.trim();
                     const quantity = purchaseForm.querySelector('#quantity').value.trim();
                    const purchaseresult = purchaseForm.querySelector('#purchaseresult');

                if (!customerName || !phone || !location) {
                    purchaseresult.innerHTML = 
                    '<p class="error-message">Please fill in all required fields</p>';
                    return;
                }
                      
                // Show loading state on button
                this.disabled = true;
                this.innerHTML = "Processing..."; // Change button text  
                document.getElementById('purchaseresult').innerHTML = '<p class="loading-message">Processing your order, Please wait...</p>';

setTimeout(async () => {
    try {
        const numericPrice = parseFloat(book.price.toString().replace(/[^\d.]/g, ''));

        if (isNaN(numericPrice) || numericPrice <= 0) {
            throw new Error('Invalid price format');
        }

        const response = await fetch("https://wellsbooks-backend.onrender.com/place-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerName,
                phone,
                location,
                quantity,
                title: book.title,
                author: book.author,
                category: book.category,
                price: numericPrice // Send the numeric value only
            })
        });

        const result = await response.json();
        if (response.ok) {
            this.innerHTML = 'Wait for the response';
             purchaseresult.innerHTML = '<p class="success-message">Order placed successfully! 📚</p>';
    
    setTimeout(() => {
        // Remove the form from the DOM
        document.body.removeChild(overlay);
        document.body.style.overflow = '';

    }, 5000); // 5 seconds delay
}


        if (response.ok) {
            purchaseresult.innerHTML = '<p class="success-message">Order placed successfully! 📚</p>';
            setTimeout(() => {
                purchaseForm.style.display = 'none';
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
                
                // Reset form fields after success
                document.querySelectorAll('.form-container input').forEach(input => {
                    input.value = '';
                });

            }, 3000);
        } else {
            purchaseresult.innerHTML = `<p class="error-message">${result.message || 'Error placing order'}<br>${result.error || ''}</p>`;
            orderButton.disabled = false;
            orderButton.textContent = 'Place Order';
        }
    } catch (error) {
        console.error("Error placing order:", error);
        purchaseresult.innerHTML = `<p class="error-message">${error.message || 'Failed to place order. Please try again.'}</p>`;
        orderButton.disabled = false;
        orderButton.textContent = 'Place Order';
    }
}, 5000);

            });
        });
    }
});

 