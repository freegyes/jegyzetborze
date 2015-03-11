Meteor.methods({
  checkMolyISBN: function (isbn) {
    check(isbn, String);
    this.unblock();

    var query = "http://moly.hu/api/book_by_isbn.json?q=" + isbn;
    try {
      var result = HTTP.call("GET", query);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      return false;
    }
  },
  checkMolyId: function (id) {
    check(id, Match.Any);
    this.unblock();

    var query = "http://moly.hu/api/book/" + id + ".json";
    try {
      var result = HTTP.call("GET", query);

      return result.content;
    } catch (e) {
      console.log(e);
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      return false;
    }
  }
});