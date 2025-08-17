// code the entire token verification block at the top with:
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/AdminLogin.html';
        return;
    }

    fetch('/verify-token', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            localStorage.removeItem('adminToken');
            window.location.href = '/AdminLogin.html';
        }
        // If success, continue loading the page
    })
    .catch(error => {
        console.error('Verification error:', error);
        localStorage.removeItem('adminToken');
        window.location.href = '/AdminLogin.html';
    });
});



//code for the logout clearing tokens
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('authToken');
  localStorage.clear();


  const messageBox = document.createElement('div');
  messageBox.textContent = 'You have been logged out.';
  messageBox.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: #2c3e50; color: white;
    padding: 12px 20px; border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  `;
  document.body.appendChild(messageBox);

  setTimeout(() => {
    window.location.href = 'AdminLogin.html';
  }, 1000);
});





        // Navigation between sections
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all menu items and sections
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked menu item
                this.classList.add('active');
                
                // Show corresponding section
                const sectionId = this.getAttribute('data-section') + '-section';
                document.getElementById(sectionId).classList.add('active');
                
                // Update current section title
                document.getElementById('current-section').textContent = this.textContent.trim();
                
                // Load data for the section
                loadSectionData(this.getAttribute('data-section'));
            });
        });

        // Function to load data based on section
        function loadSectionData(section) {
            switch(section) {
                case 'dashboard':
                    loadDashboardStats();
                    break;
                case 'books':
                    loadBooks();
                    break;
                case 'orders':
                    fetchOrders();
                    break;
                case 'messages':
                    loadMessages();
                    break;
                case 'settings':
                    loadSettings();
                    break;
                default:
                    console.log(`Loading data for ${section} is not yet implemented.`);
            }
        }

 document.addEventListener('DOMContentLoaded', function() {
      // Initialize dashboard
      updateTime();
      
      // Update time every second
      setInterval(updateTime, 1000);
      
      // Simulate data updates every 5 seconds
      setInterval(updateDashboardData, 5000);
    });

    function updateTime() {
      const now = new Date();
      const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      };
      { time: `${Math.floor(Math.random() * 30) + 10} min ago`}
      document.getElementById('update-time').textContent = now.toLocaleTimeString('en-US', options);

    }


//The js for the Dashboard
async function loadDashboardStats() {


  try {
    const res = await fetch('/orders/stats');
    const stats = await res.json();

    document.getElementById('total-books').textContent = stats.totalBooks || '24'; 
    document.getElementById('total-orders').textContent = stats.total;
    document.getElementById('pending-orders').textContent = stats.pending;
    document.getElementById('unread-messages').textContent = stats.unreadMessages || '5'; 
    
  } catch (error) {
    console.error('Failed to load stats. Please refresh again!', error);
    // Optionally show error to user
  }
}


//ends of the dashboard js





//the js for the forms and the  managing books
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const addBookBtn = document.getElementById('add-book-btn');
    const addBookForm = document.getElementById('add-book-form');
    const cancelBookBtn = document.getElementById('cancel-book-btn');
    const bookForm = document.getElementById('book-form');
    const booksTableBody = document.getElementById('books-table-body');
    const fileInput = document.getElementById('book-image');
    const fileNameDisplay = document.getElementById('file-name');
    
    // Load books when page loads
    loadBooks();

    if (fileInput) {
        fileInput.addEventListener('change', function () {
           const file = this.files[0];
            fileNameDisplay.textContent = file ? file.name : 'No file chosen';
        });
    } 

    

    
    // Book form submission
        document.getElementById("book-form")?.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            // Show loading message
            document.getElementById("loading-message").style.display = "block";
            document.getElementById("success-message").style.display = "none";
            document.getElementById("error-message").style.display = "none";

            // Collect form data
            const formData = new FormData(this);

            try {
                const response = await fetch("/books", {
                    method: "POST",
                    body: formData
                });

                    setTimeout(() => {
                        document.getElementById("loading-message").style.display = "block";

                        if (response.ok) {
                             document.getElementById("loading-message").style.display = "none";
                            document.getElementById("success-message").style.display = "block";

                            this.reset();
                            fileNameDisplay.textContent = 'No file chosen';
                            fileInput.value = '';


                            // Hide success message after 3 seconds
                            setTimeout(() => {
                                document.getElementById("success-message").style.display = "none";
                            }, 5000);
                    
                           // Reload books data
                           loadBooks();
                        } else {
                            document.getElementById("loading-message").style.display = "none";
                            document.getElementById("error-message").style.display = "block";
                        }
                    }, 3000);

                
            } catch (error) {
                console.error("Error:", error);
                document.getElementById("loading-message").style.display = "none";
                document.getElementById("error-message").style.display = "block";
            }
        });
       // Add Book button click handler
        document.getElementById('add-book-btn')?.addEventListener('click', () => {
            document.getElementById('add-book-form').classList.add('active');
            document.getElementById('books-table').style.display = "none";
        });

        // Form cancel button handler
        document.getElementById('cancel-book-btn')?.addEventListener('click', () => {
            document.getElementById('books-table').style.display = "block";
            document.getElementById('add-book-form').classList.remove('active');
            document.getElementById('book-form').reset();
            document.getElementById('file-name').textContent = 'No file chosen';
        });
});


  async function loadBooks() {
    try {
      const response = await fetch('/books-display');
      const books = await response.json();
      const tableBody = document.getElementById('books-table-body');

      tableBody.innerHTML = ''; // clear existing

      books.forEach((book, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.category}</td>
          <td>${book.price}</td>
          <td>${book.stock}</td>
          <td>${book.description || ''}</td>
          <td>
            ${book.image_url ? `<img src="${book.image_url}" alt="${book.title}" style="max-width: 50px;">` : 'No image'}
          </td>
          <td>
            <button class="td-edit" data-id="${book.id}">Edit</button>
            <button class="td-delete" data-id="${book.id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Failed to load books.');
    }
    document.querySelectorAll('.td-delete').forEach(btn => {
         btn.addEventListener('click', handleDelete);
    });
  }



  // Automatically run on load
  window.addEventListener('DOMContentLoaded', loadBooks);


function handleDelete(event) {
  const id = event.currentTarget.dataset.id;
  const confirmDelete = confirm(`Are you sure you want to delete book row?`);
  const messageBox = document.getElementById('messageBox');

  if (!confirmDelete) return;

  fetch(`/books/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        messageBox.textContent = result.message;
        messageBox.display
        messageBox.style.color = 'green';
        setTimeout(() => {
          messageBox.style.display = 'none';
        }, 1000)
        loadBooks(); // Refresh the table
      } else {
            messageBox.textContent = result.message || 'Delete failed';
            messageBox.style.color = 'red';
      }
    })
    .catch(error => {
         messageBox.textContent = 'An error occurred while deleting.';
        messageBox.style.color = 'red';
        console.error(error);    
    });
}

//ends of js for managing books section







// Function to fetch and display orders section
async function fetchOrders() {
  try {
    const response = await fetch('/orders');
    const data = await response.json();

    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '';

    data.forEach((order, index ) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      
        <td>${index + 1}</td>
        <td>${order.customer_name}</td>
        <td>${order.phone}</td>
        <td>${order.location}</td>
        <td>${order.quantity}</td>
        <td>${order.title}</td>
        <td>${order.author}</td>
        <td>${order.category}</td>
        <td>${order.price}</td>
        <td class="order-status status-${order.responded ? 'responded' : 'pending'}">
                        ${order.responded ? 'Responded' : 'Pending'}
        </td>
        <td>${new Date(order.order_date).toLocaleString()}</td>
        <td>
         
        <button 
              class="btn ${order.responded ? 'btn-responded' : 'btn-respond'}" 
            data-id="${order.id}" 
           onclick="respondOrder(this, ${order.id})"
          ${order.responded ? 'disabled' : ''}>
          ${order.responded ? 'Responded' : 'Respond'}
        </button>

        
        <button class="td-delete" onclick="deleteOrder(${order.id})">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    alert('Failed to load orders. Please try again.');
  }
}



//Handles the respond js
async function respondOrder(button, orderId) {
  try {
    const row = button.closest('tr');
    const statusCell = row.querySelector('.order-status');
    
    if (statusCell) {
      statusCell.textContent = 'Responded';
      statusCell.classList.replace('status-pending', 'status-responded');
    }
    
    button.textContent = 'Responded';
    button.classList.replace('btn-respond', 'btn-responded');
    button.disabled = true;

    // Then make the API call
    const response = await fetch(`/orders/respond/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to mark as responded.');

    loadDashboardStats();
    fetchOrders();

  } catch (err) {
    if (statusCell) {
      statusCell.textContent = 'Pending';
      statusCell.classList.replace('status-responded', 'status-pending');
    }
    
    button.textContent = 'Respond';
    button.classList.replace('btn-responded', 'btn-respond');
    button.disabled = false;
    
    console.error(err);
    alert('Failed to update order status. Please try again.');
  }
}
//ends of the respond



//Handles the delete js
async function deleteOrder(id) {
  const confirmDelete = confirm(`Do you want to Delete order row?`);
  const messageBox = document.getElementById('messageBox');

  if (!confirmDelete) return;

  try {
    const res = await fetch(`/delete/${id}`, { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
      messageBox.textContent = result.message;
      messageBox.style.color = 'green';
      fetchOrders(); // Refresh table
    } else {
      messageBox.textContent = result.message || 'Delete failed';
      messageBox.style.color = 'red';
    }
  } catch (error) {
    messageBox.textContent = 'An error occurred while deleting.';
    messageBox.style.color = 'red';
    console.error(error);
  }

  // Fade out message after 4 seconds
  setTimeout(() => {
    messageBox.textContent = '';
  }, 4000);
}


//ends of the section of view orders
// JavaScript Functionality
 document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeSelector = document.getElementById('theme-selector');
    const languageSelector = document.getElementById('language-selector');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    const lineSpacingSlider = document.getElementById('line-spacing-slider');
    const lineSpacingValue = document.getElementById('line-spacing-value');
    const saveButton = document.getElementById('save-settings');
    const statusMessage = document.getElementById('status-message');

      // Load saved settings from localStorage
      function loadSettings() {
          // Theme
          if (localStorage.getItem('theme')) {
              themeSelector.value = localStorage.getItem('theme');
              applyTheme(localStorage.getItem('theme'));
          }

          // Language
          if (localStorage.getItem('language')) {
              languageSelector.value = localStorage.getItem('language');
          }

          // Notifications
          if (localStorage.getItem('notifications') !== null) {
              notificationsToggle.checked = localStorage.getItem('notifications') === 'true';
          }

          // Auto-save
          if (localStorage.getItem('autoSave') !== null) {
              autoSaveToggle.checked = localStorage.getItem('autoSave') === 'true';
          }

          // Font Size
          if (localStorage.getItem('fontSize')) {
              fontSizeSlider.value = localStorage.getItem('fontSize');
              fontSizeValue.textContent = `${localStorage.getItem('fontSize')}px`;
              document.body.style.fontSize = `${localStorage.getItem('fontSize')}px`;
          }

          // Line Spacing
          if (localStorage.getItem('lineSpacing')) {
                lineSpacingSlider.value = localStorage.getItem('lineSpacing');
                lineSpacingValue.textContent = localStorage.getItem('lineSpacing');
                document.body.style.lineHeight = localStorage.getItem('lineSpacing');
          }
      }

            // Apply selected theme
      function applyTheme(theme) {
            document.body.classList.remove('dark-mode', 'high-contrast');
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else if (theme === 'high-contrast') {
                document.body.classList.add('high-contrast');
            }
      }

      // Show status message
      function showStatus(message, duration = 3000) {
          statusMessage.textContent = message;
          setTimeout(() => {
              statusMessage.textContent = '';
          }, duration);
      }

      // Save settings to localStorage
      function saveSettings() {
          localStorage.setItem('theme', themeSelector.value);
          localStorage.setItem('language', languageSelector.value);
          localStorage.setItem('notifications', notificationsToggle.checked);
          localStorage.setItem('autoSave', autoSaveToggle.checked);
          localStorage.setItem('fontSize', fontSizeSlider.value);
          localStorage.setItem('lineSpacing', lineSpacingSlider.value);
                
          showStatus('Settings saved successfully!');
      }

      // Event Listeners
      themeSelector.addEventListener('change', (e) => {
          applyTheme(e.target.value);
          if (autoSaveToggle.checked) saveSettings();
      });

      languageSelector.addEventListener('change', (e) => {
          if (autoSaveToggle.checked) saveSettings();
      });

      notificationsToggle.addEventListener('change', () => {
          if (autoSaveToggle.checked) saveSettings();
      });

      autoSaveToggle.addEventListener('change', () => {
          if (autoSaveToggle.checked) {
                showStatus('Auto-save enabled - changes will be saved automatically');
                saveSettings();
          }
      });

      fontSizeSlider.addEventListener('input', (e) => {
          fontSizeValue.textContent = `${e.target.value}px`;
          document.body.style.fontSize = `${e.target.value}px`;
          if (autoSaveToggle.checked) saveSettings();
      });

      lineSpacingSlider.addEventListener('input', (e) => {
          lineSpacingValue.textContent = e.target.value;
          document.body.style.lineHeight = e.target.value;
          if (autoSaveToggle.checked) saveSettings();
      });

      saveButton.addEventListener('click', saveSettings);

      // Initialize
      loadSettings();
  });


//SETTINGS JS
