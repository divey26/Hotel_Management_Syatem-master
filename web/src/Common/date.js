const moment = require('moment');

export const formatDate = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD HH:mm");
};

export const formatDateOnly = (dateString) => {
  return moment(dateString).format("MM-DD-YYYY");
};

