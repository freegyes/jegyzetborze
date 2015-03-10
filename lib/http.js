Meteor.methods({
  checkMolyISBN: function (isbn) {
  check(isbn, String);
  this.unblock();

  var query = "http://moly.hu/api/book_by_isbn.json?q=" + isbn;
  try {
    var result = HTTP.call("GET", query);
    console.log(result);
    return result;
  } catch (e) {
    // Got a network error, time-out or HTTP error in the 400 or 500 range.
    return false;
  }
}});