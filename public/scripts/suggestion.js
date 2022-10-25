/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewSuggestionByType(fields) {
  fetch(`/api/suggestions/${fields.freetId}?type=${fields.suggestionType}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewSuggestionById(fields) {
  fetch(`/api/suggestions/${fields.freetId}/mine`)
    .then(showResponse)
    .catch(showResponse);
}

function addSuggestion(fields) {
  fetch(`/api/suggestions/${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteSuggestion(fields) {
  fetch(`/api/suggestions/${fields.suggestionId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsWithSuggestion(fields){
  fetch(`/api/suggestions/view?type=${fields.suggestionType}&suggestion=${fields.suggestion}`)
    .then(showResponse)
    .catch(showResponse);
}