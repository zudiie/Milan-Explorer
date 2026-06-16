/* jslint browser: true */
// ensures JavaScript code is executed in "strict mode", preventing common errors.
"use strict";

// --- global variables ---
// used by slideshow (home.html)
let slideIndex = 1; // tracks the current slide being displayed (starts at the first slide)
let slideInterval; // holds the timer reference for the automatic slideshow

// used by info popup (food_drink.html)
// get references to the popup elements from the DOM once
const popupOverlay = document.getElementById('info-popup');
const popupTextElement = document.getElementById('info-popup-text');
const closeButton = document.querySelector('.info-popup-close');
const infoIcons = document.querySelectorAll('.info-icon'); // gets all info icons


// --- slideshow functions (home.html) ---

/**
 * displays a specific slide and updates the navigation dots.
 * hides all slides, removes 'active-dot' from all dots,
 * then displays the target slide and adds 'active-dot' to the corresponding dot.
 * @param {number} n - The index of the slide to show (1-based).
 */
function showSlides(n) {
    let i;
    // get all elements with class "slides" and "dot"
    const slides = document.getElementsByClassName("slides");
    const dots = document.getElementsByClassName("dot");

    // exit the function if no slides or dots are found on the page
    if (slides.length === 0 || dots.length === 0) {
        return;
    }

    // handle wrapping: if n is past the last slide, go to the first
    if (n > slides.length) { slideIndex = 1; }
    // handle wrapping: if n is before the first slide, go to the last
    if (n < 1) { slideIndex = slides.length; }

    // hide all slide elements
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // remove the "active-dot" class from all dot elements
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }

    // display the current slide (adjusting for 0-based array index)
    slides[slideIndex - 1].style.display = "block";
    // add the "active-dot" class to the corresponding dot
    dots[slideIndex - 1].className += " active-dot";
}

/**
 * advances the slideshow to the next or previous slide.
 * called by the arrow buttons in home.html (onclick).
 * @param {number} n - the number of slides to advance (1 for next, -1 for prev).
 */
function plusSlides(n) {
    showSlides(slideIndex += n); // update slideIndex and show the new slide
}

/**
 * displays a specific slide based on the dot clicked.
 * called by the dot buttons in home.html (onclick).
 * @param {number} n - the index of the slide to show (1-based).
 */
function currentSlide(n) {
    showSlides(slideIndex = n); // set slideIndex and show the specific slide
}


// --- scroll reveal function (used on multiple pages) ---

/**
 * checks elements with the '.reveal' class and adds the '.visible' class
 * if they are within the viewport, triggering the CSS animation.
 */
function revealSections() {
    // select all elements that should be revealed on scroll
    const reveals = document.querySelectorAll('.reveal');
    // get the height of the browser window
    const windowHeight = window.innerHeight;
    // how close to the bottom edge the element should be before revealing (in pixels)
    const elementVisibleThreshold = 50;

    // loop through each element marked with '.reveal'
    reveals.forEach(reveal => {
        // get the element's position relative to the viewport
        const elementTop = reveal.getBoundingClientRect().top; // returns the size of an element and its position relative to the viewport
        // check if the top of the element is within the visible part of the window
        // (less than window height minus the threshold)
        if (elementTop < windowHeight - elementVisibleThreshold) {
            // add the 'visible' class to trigger the CSS transition/animation
            reveal.classList.add('visible');
        }
    });
}


// --- info popup functions (food_drink.html) ---

/**
 * displays the info popup with the provided text.
 * @param {string} text - The text to display inside the popup.
 */
function showInfoPopup(text) {
    // check if popup elements exist before trying to use them
    if (popupTextElement && popupOverlay) {
        popupTextElement.textContent = text; // set the text content
        popupOverlay.classList.add('visible'); // make the overlay (and popup) visible
    }
}

/**
 * hides the info popup.
 */
function hideInfoPopup() {
    // check if overlay exists
    if (popupOverlay) {
        popupOverlay.classList.remove('visible'); // hide the overlay
    }
}


// --- initial setup & event listeners ---

/**
 * this function runs once the entire HTML document has been fully loaded and parsed.
 * it sets up event listeners and initializes components like the slideshow.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- slideshow initialization (home.html) ---
    // check if slideshow elements actually exist on the current page
    const slidesElements = document.getElementsByClassName("slides");
    const dotsElements = document.getElementsByClassName("dot");
    if (slidesElements.length > 0 && dotsElements.length > 0) {
        // show the initial slide (slideIndex is 1 by default)
        showSlides(slideIndex);
        // start the automatic slideshow timer
        clearInterval(slideInterval); // clear any previous timer first
        // set interval to call plusSlides(1) every 5000ms (5 seconds)
        slideInterval = setInterval(() => plusSlides(1), 5000);
    }

    // --- scroll reveal initialization (multiple pages) ---
    // add an event listener to run revealSections whenever the user scrolls
    window.addEventListener('scroll', revealSections);
    // run revealSections once on load in case elements are already visible
    revealSections();

    // --- enquiry form handler initialization (home.html) ---
    // get references to the form and its message display area
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    // check if the form elements exist on the current page
    if (contactForm && formMessage) {
        // add an event listener for when the form is submitted
        contactForm.addEventListener('submit', (event) => {
            // prevent the default form submission behavior (which would reload the page)
            event.preventDefault();

            // --- simple client-side validation ---
            // get trimmed values from form fields
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // clear any previous feedback message and set default color to red
            formMessage.textContent = '';
            formMessage.style.color = 'red';

            // check if any field is empty
            if (!firstName || !lastName || !email || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                return; // stop processing if validation fails
            }
            // email format check
            if (email.indexOf('@') === -1 || email.indexOf('.') === -1 || email.indexOf(' ') !== -1) {
                 formMessage.textContent = 'Please enter a valid email address.';
                 return; // stop processing if validation fails
            }

            // --- actions if validation passes ---
            // display success message and change color to green
            formMessage.textContent = 'Thank you for your enquiry! We will be in touch soon.';
            formMessage.style.color = 'green';
            // reset the form fields
            contactForm.reset();

            // hide the success message after 5 seconds (5000ms)
            
        });
    }

    // --- info popup listeners initialization (food_drink.html) ---
    // check if all necessary popup elements exist
    if (popupOverlay && closeButton && popupTextElement && infoIcons.length > 0) {

        // add a click listener to each info icon found
        infoIcons.forEach(icon => {
            // use 'function' here to correctly access 'this' referring to the clicked icon
            icon.addEventListener('click', function() {
                // get the text from the 'data-info' attribute of the clicked icon
                const infoText = this.getAttribute('data-info');
                // if text exists, show the popup with that text
                if (infoText) {
                    showInfoPopup(infoText);
                }
            });
        });

        // add click listener to the close button to hide the popup
        closeButton.addEventListener('click', hideInfoPopup);

        // add click listener to the overlay itself
        popupOverlay.addEventListener('click', (event) => {
            // check if the click was directly on the overlay (not the content inside)
            if (event.target === popupOverlay) {
                hideInfoPopup(); // hide the popup if overlay is clicked
            }
        });

        // add keyboard listener to close popup with the Escape key
        document.addEventListener('keydown', (event) => {
            // check if the pressed key is "Escape" and if the popup is currently visible
            if (event.key === "Escape" && popupOverlay.classList.contains('visible')) {
                hideInfoPopup(); // hide the popup
            }
        });
    }

});
