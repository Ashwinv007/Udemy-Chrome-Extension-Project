document.getElementById("g").onclick=autoForwarding;


function autoForwarding()
{
  

    var submit="true";
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        var data = {
     
          submit:submit
        };
        chrome.tabs.sendMessage(activeTab.id, data);
    });
    
 
}



const toggleButton = document.getElementById('g');

  // Variable to track the state (start or stop)
  let isRunning = false;

  // Function to handle button click
  function toggleStartStop() {
    // Toggle the state
    isRunning = !isRunning;

    // Update the button text based on the state
    toggleButton.textContent = isRunning ? 'Start' : 'Stop';

    // Perform actions based on the state (you can add your logic here)
    if (isRunning) {
      console.log('Started...');
      // Add your start logic here
    } else {
      console.log('Stopped.');
      // Add your stop logic here
    }
  }

  // Add click event listener to the button
  toggleButton.addEventListener('click', toggleStartStop);