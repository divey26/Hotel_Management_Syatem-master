const moment = require('moment');

export const formatDate = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD ");
};

export const formatDateOnly = (dateString) => {
  return moment(dateString).format("MM-DD-YYYY");
};

