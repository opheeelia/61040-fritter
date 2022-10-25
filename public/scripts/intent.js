/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getIntent(fields) {
  fetch(`/api/intent/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function createIntent(fields) {
  fetch(`/api/intent/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteIntent(fields) {
  fetch(`/api/intent/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsWithIntent(fields){
  fetch(`/api/intent/view?intent=${fields.intent}`)
    .then(showResponse)
    .catch(showResponse);
}