// Function to find hotjar widget and minimize it
function hideFeedback() {
  const targetNode = document.querySelector('._hj_feedback_container');
  sessionStorage.setItem('feedbackVisible', 'false');
  const feedbackLabel = targetNode.querySelector('._hj-ETLL8__MinimizedWidgetMiddle__label');
  // Add listeners when the button is there
  if (feedbackLabel){
    addButtonEventListeners(feedbackLabel);
  } else {
    // Add observer when button is not there (feedback window shown)
    const observer = new MutationObserver(function(mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const feedbackLabel = targetNode.querySelector('._hj-ETLL8__MinimizedWidgetMiddle__label');
          addButtonEventListeners(feedbackLabel);
        }
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
  }
}


// Function to modify widget behavior to appear minimized
function addButtonEventListeners(feedbackLabel) {
  if(feedbackLabel){
    feedbackLabel.style.transform = 'translateX(30px)';
    feedbackLabel.addEventListener('mouseenter', () => {
      feedbackLabel.style.transform = 'translateX(0)';
    });
    feedbackLabel.addEventListener('mouseleave', () => {
      feedbackLabel.style.transform = 'translateX(30px)';
    });
  }
}


// After all the scripts load, then find the widget and add the event listener
window.onload = function() {
  // Check if the feedback should be visible based on the state stored in sessionStorage
  const feedbackVisible = sessionStorage.getItem('feedbackVisible');
  if (feedbackVisible === 'false') {
    hideFeedback();
  }
  // Add event listener to widget to hide it when clicked
  const widget = document.querySelector('._hj_feedback_container');
  if (widget) {
    widget.addEventListener('click', hideFeedback);
  }
};