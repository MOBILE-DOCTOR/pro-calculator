// script.js - JavaScript for your traditional index.html site with new content and links

document.addEventListener('DOMContentLoaded', () => {
    console.log('index.html script loaded and DOM is ready!');

    // Helper function to display messages to the user without using alert().
    function displayMessage(messageText) {
        let messageBox = document.getElementById('app-message-box');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'app-message-box';
            document.body.appendChild(messageBox);

            messageBox.style.position = 'fixed';
            messageBox.style.bottom = '20px';
            messageBox.style.right = '20px';
            messageBox.style.backgroundColor = '#4CAF50';
            messageBox.style.color = 'white';
            messageBox.style.padding = '15px 20px';
            messageBox.style.borderRadius = '8px';
            messageBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            messageBox.style.zIndex = '1000';
            messageBox.style.opacity = '0';
            messageBox.style.transition = 'opacity 0.5s ease-in-out';
        }

        messageBox.textContent = messageText;
        messageBox.style.opacity = '1';

        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                if (messageBox.parentNode) {
                    messageBox.parentNode.removeChild(messageBox);
                }
            }, 500); 
        }, 3000);
    }

    // --- Navigation Buttons ---
    document.getElementById('navHome').addEventListener('click', () => {
        window.location.href = 'https://sites.google.com/view/mobile-doct0r?usp=sharing';
    });

    document.getElementById('navAbout').addEventListener('click', () => {
        // Scroll to the About Us section within the current page
        document.getElementById('about-us').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navServices').addEventListener('click', () => {
        // Scroll to the Services section within the current page
        document.getElementById('our-services').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navContact').addEventListener('click', () => {
        window.location.href = 'https://sites.google.com/view/mobile-doct0r/contact-us';
    });

    // --- Hero Section Button ---
    document.getElementById('exploreServicesBtn').addEventListener('click', () => {
        document.getElementById('our-services').scrollIntoView({ behavior: 'smooth' });
    });

    // --- Feature Buttons ---
    document.getElementById('featureFileConverter').addEventListener('click', () => {
        window.location.href = 'https://mobile-doctor.github.io/file-converter/';
    });

    document.getElementById('featureAgeCalculator').addEventListener('click', () => {
        window.location.href = 'https://mobile-doctor.github.io/age-calculator/';
    });

    document.getElementById('featureUniversalCalculator').addEventListener('click', () => {
        // This links to your React app. UPDATED URL
        window.location.href = 'https://mobile-doctor.github.io/mobiledoctor.store/my-download-app/';
    });

    // --- Download App Call to Action Button ---
    document.getElementById('downloadAppButton').addEventListener('click', () => {
        // Redirect to the React app's main page. UPDATED URL
        window.location.href = 'https://mobile-doctor.github.io/mobiledoctor.store/my-download-app/'; 
    });

    // Example of a general button or interactive element for demo purposes
    const learnMoreButton = document.getElementById('learnMoreBtn'); // From original hero section
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', () => {
            displayMessage('You clicked the "Learn More" button!');
        });
    }

    // Generic feature item hover effects (still valid)
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            console.log('Mouse entered feature item:', item.querySelector('h4').textContent);
        });
        item.addEventListener('mouseleave', () => {
            console.log('Mouse left feature item:', item.querySelector('h4').textContent);
        });
    });
});
