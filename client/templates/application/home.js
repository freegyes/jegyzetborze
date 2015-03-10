Template.home.created = function () {
  Session.set('author', '');
  Session.set('title', '');
  Session.set('cover', 'http://placehold.it/105x160');
};

Template.home.helpers({
  books: function() {
    return Books.find();
  },
  author: function () {
    return Session.get('author');
  },
  title: function () {
    return Session.get('title');
  },
  cover: function () {
    return Session.get('cover');
  }
});

Template.home.events({
  'click .callServer': function () {
    var isbn = $('#isbn').val(); 
    console.log(isbn);

    Meteor.call('checkMolyISBN', isbn, function(error, result) {
      if (error) return throwError ("Are you sure this is a valid URL?", "warning");

      var data = $.parseJSON(result.content);

      $('#author').val(data.author);
      $('#title').val(data.title);

      Session.set('author', data.author);
      Session.set('title', data.title);
      Session.set('cover', data.cover);

    });
  }
});