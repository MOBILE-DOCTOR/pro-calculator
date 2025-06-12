// script.js - Basic JavaScript for your traditional index.html site

// This ensures the JavaScript runs only after the entire HTML document has been loaded.
// It's good practice to prevent errors if elements are not yet available in the DOM.
document.addEventListener('DOMContentLoaded', () => {
    console.log('index.html script loaded and DOM is ready!');

    // Example: Add an event listener to the "Learn More" button in the Hero section.
    const learnMoreButton = document.querySelector('#hero button');

    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', () => {
            // In a real scenario, you might scroll to a section, load more content,
            // or navigate to another page.
            // Using a simple message here instead of alert() as per instructions.
            displayMessage('You clicked the "Learn More" button!');
        });
    }

    // Example: Add hover effects to feature items (though most styling is in CSS).
    // This demonstrates basic element selection and event handling.
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            console.log('Mouse entered feature item:', item.querySelector('h4').textContent);
            // You could add dynamic styling here if CSS transitions are not enough,
            // e.g., item.style.backgroundColor = '#e0e0e0';
        });
        item.addEventListener('mouseleave', () => {
            console.log('Mouse left feature item:', item.querySelector('h4').textContent);
            // e.g., item.style.backgroundColor = '#fff';
        });
    });

    // Helper function to display messages to the user without using alert().
    // This creates a simple div and appends it to the body.
    function displayMessage(messageText) {
        let messageBox = document.getElementById('app-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'app-message-box';
            document.body.appendChild(messageBox);

            // Basic styling for the message box
            messageBox.style.position = 'fixed';
            messageBox.style.bottom = '20px';
            messageBox.right = '20px';
            messageBox.backgroundColor = '#4CAF50';
            messageBox.color = 'white';
            messageBox.padding = '15px 20px';
            messageBox.borderRadius = '8px';
            messageBox.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            messageBox.zIndex = '1000';
            messageBox.opacity = '0';
            messageBox.transition = 'opacity 0.5s ease-in-out';
        }

        messageBox.textContent = messageText;
        messageBox.style.opacity = '1';

        // Hide the message after a few seconds
        setTimeout(() => {
            messageBox.style.opacity = '0';
            // Optional: remove the element after transition for cleanup
            setTimeout(() => {
                if (messageBox.parentNode) {
                    messageBox.parentNode.removeChild(messageBox);
                }
            }, 500); // Match transition duration
        }, 3000); // Display for 3 seconds
    }
});
