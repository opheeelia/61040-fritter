/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFilters(fields) {
  fetch(`/api/filters?prefix=${fields.prefix}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewOwnFilters(fields) {
  fetch(`/api/filters/mine`)
    .then(showResponse)
    .catch(showResponse);
}

function createFilter(fields) {
  var include = [[], [], [], []]; // user, tag, intent, supplement
  // var exclude = [[], [], [], []]; // user, tag, intent, supplement
  if (fields.includeUser) include[0] = fields.includeUser.split(",").map((el) => el.replace(/[^\w]/gi, ""));
  if (fields.includeTag) include[1] = fields.includeTag.split(",").map((el) => el.replace(/[^\w]/gi, ""));
  if (fields.includeIntent) include[2] = fields.includeIntent.split(",").map((el) => el.replace(/[^\w]/gi, ""));
  // if (fields.includeSupplement) include[3] = fields.includeSupplement.split(",");
  // if (fields.excludeUser) exclude[0] = fields.excludeUser.split(",").map((el) => el.replace(/[^\w]/gi, ""));
  // if (fields.excludeTag) exclude[1] = fields.excludeTag.split(",").map((el) => el.replace(/[^\w]/gi, ""));
  // if (fields.excludeIntent) exclude[2] = fields.excludeIntent.split(",").map((el) => el.replace(/[^\w]/gi, ""));
  // if (fields.excludeSupplement) exclude[3] = fields.excludeSupplement.split(",");
  fields = {
    ...fields,
    include: include,
    // exclude: exclude
  }
  fetch(`/api/filters/`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFilter(fields) {
  fetch(`/api/filters/${fields.filterId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByFilter(fields){
  fetch(`/api/filters/view?filterId=${fields.filterId}`)
    .then(showResponse)
    .catch(showResponse);
}