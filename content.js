submit = "false";
let currentSection;
let totalVideos;
let oldSection;
let lastClickedElement = null;
let currentVideo = 0;
let temp;
let totalSection;
let action = "true";
let autoForwardInterval; // Added variable to store the interval ID
let autoPlay;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    submit = request.submit;

    if (submit === "true") {
        console.log("action");

        console.log(action);
        if (action === "false") {
            autoForward();
            setInterval(checkAndPlayVideo, 4000);
            action = "true";
            console.log("active");
        } else if (action === "true") {
            clearInterval(autoForwardInterval); 
            clearInterval(autoPlay);// Clear the interval
            action = "false";
            console.log("Dactive");
        }
    }
});

function stopAutoForward() {
    // Clear the interval to stop the autoForward functionality
    clearInterval(autoForwardInterval);
}

function checkForArticleIcon() {
    console.log("Checking for article icon...");
    var currentListItem = document.querySelector('li[aria-current="true"]');

    if (currentListItem) {
        var useElement = currentListItem.querySelector('button:has(svg use[*|href="#icon-video"], svg use[href="#icon-video"])');
        
        if (!useElement) {
           

            console.log("No video icon found, attempting to find next video button...");

            // Use the newly identified element to go to the next lecture
            var nextLectureButton = document.getElementById('go-to-next-item');
            if (nextLectureButton) {
                console.log("Next lecture button found, clicking...");
                nextLectureButton.click();
            } else {
                console.log("Next lecture button not found");
            }
        } else {
            console.log("Video icon found, no action needed.");
        }
    }
}

function checkForDownloadableResource(liElement) {
    if (liElement) {
        var buttonElement = liElement.querySelector('button.ud-btn.ud-btn-large.ud-btn-link.ud-heading-md');

        if (buttonElement) {
            console.log('Button HTML content:', buttonElement.innerHTML);

            var useElement = buttonElement.querySelector('use');

            if (useElement) {
                var xlinkHrefValue = useElement.getAttribute('xlink:href');

                if (xlinkHrefValue === '#icon-video') {
                    var index = Array.from(liElement.querySelectorAll('button.ud-btn.ud-btn-large.ud-btn-link.ud-heading-md use')).indexOf(useElement);
                    currentVideo = temp;
                    console.log('Found <use> with xlink:href="#icon-video" at index:', currentVideo);
                } else {
                    console.log('No <use> with xlink:href="#icon-video" in the <li>');
                }
            } else {
                console.log('No <use> element in the <button>');
            }
        } else {
            console.log('No <button> with specified classes in the <li>');
        }
    } else {
        console.log('No <li> with the specified ID');
    }
}

function autoForward() {
    totalSection = document.getElementsByClassName("ud-btn ud-btn-large ud-btn-link ud-heading-md ud-accordion-panel-toggler accordion-panel-module--panel-toggler--1RjML accordion-panel-module--outer-panel-toggler--AgeEB").length;

    // Store the interval ID in autoForwardInterval
    autoForwardInterval = setInterval(checkForArticleIcon, 3000);
    autoPlay = setInterval(checkAndPlayVideo, 3000);
  
    var listItems = document.querySelectorAll('ul.ud-unstyled-list li.curriculum-item-link--curriculum-item--KX9MD');

    listItems.forEach(function (liElement, index) {
        liElement.addEventListener('click', function () {
            console.log("Clicked on <li> at position (index):", index);
            temp = index;
            checkForDownloadableResource(liElement);
        });
    });
}

// Add this function to stop the interval externally
function stopAutoForward() {
    clearInterval(autoForwardInterval);
}

function checkAndPlayVideo() {
    var video = document.getElementsByTagName("video")[0];

    // Check if the video element exists
    if (video) {
        // Check if the video is paused
        if (video.paused) {
            // If paused, play the video
            var c = document.getElementsByClassName("shaka-play-button-container")[0];
            var c1 = document.getElementsByClassName("video-popover-area shaka-control-bar--popover-area--1vJ7p")[0];
         
           if (c && c1) {
                console.warn("Both c and c1 are true. Choosing c1 to execute.");
                c1.click();
            } 
            else {
         
            if (c) {
                console.warn("c is true");
                c.click();
            } else if (c1) {
                c1.click();
                console.warn("c1 is true");
            } 

        }
        } else {
            // If already playing, you can handle this case as needed
            console.log("Video is already playing");
        }
    } else {
        console.log("Video element not found");

        var skipRating=document.getElementsByClassName('ud-btn ud-btn-large ud-btn-secondary ud-heading-md')[0]
        var skipQuiz = document.getElementsByClassName('item-link item-link--common--RP3fp ud-btn ud-btn-large ud-btn-ghost ud-heading-md ud-link-neutral')[0]
        if(skipQuiz){
            console.log('quiz found')
            skipQuiz.click()

        }else if(skipRating){
            console.log('rating found')
            skipRating.click()
        }
    }
}

autoForward(); // Initiate autoForward when the content script is loaded
