/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

// Show multiple objects on the screen.
function showObjects(objs) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = "";
  objs.forEach((obj) => {
    pre.innerText = JSON.stringify(obj, null, 4);
  });
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

function showResponses(responses) {
  let objects = responses.map((response) => 
    response.json().then(data => 
      ({
        data,
        status: response.status,
        statusText: response.statusText
      })
    )
  );
  showObjects(objects);
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'view-freet': viewFreet, // Add to formsAndHandlers to interact with on frontend
  'add-intent': createIntent,
  'get-intent': getIntent,
  'delete-intent': deleteIntent,
  'view-freets-with-intent': viewFreetsWithIntent,
  'view-all-tags': viewAllTags,
  'add-tag': addTag,
  'view-freets-with-tag': viewFreetsWithTag,
  'delete-tags': deleteFreetsTags,
  'view-own-suggestions': viewSuggestionById,
  'view-suggestions-by-type': viewSuggestionByType,
  'add-suggestion': addSuggestion,
  'delete-suggestion': deleteSuggestion,
  'view-freets-with-suggestion': viewFreetsWithSuggestion,
  'view-filters': viewFilters,
  'view-own-filters': viewOwnFilters,
  'create-filter': createFilter,
  'delete-filter': deleteFilter,
  'view-freets-by-filter': viewFreetsByFilter
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
