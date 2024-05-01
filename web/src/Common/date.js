const moment = require('moment');

export const formatDate = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD HH:mm");
};
