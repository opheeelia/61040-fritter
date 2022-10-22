/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllTags(fields) {
  fetch(`/api/tags?prefix=${fields.prefix}`)
    .then(showResponse)
    .catch(showResponse);
}

function addTag(fields) {
  fields = {
    ...fields,
    tagLabels: fields.tagLabels.split(",")
  };
  fetch(`/api/tags/${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

// function viewFreetsWithTag(fields){
//   fetch(`/api/tags/${fields.tagLabel}`)
//     .then(showResponse)
//     .catch(showResponse);
// }