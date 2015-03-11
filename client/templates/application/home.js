Template.home.created = function () {
  Session.set('author', '');
  Session.set('title', '');
  Session.set('id', '');
  Session.set('cover', '/moly-logo.jpeg');
  Session.set('link', 'http://moly.hu');
  Session.set('results', []);
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
  },
  link: function() {
    return Session.get('link');
  }
});

Template.home.events({
  // 'submit form': function(e) {
  //   e.preventDefault();
  //   
  //   var book = {
  //     title: $(e.target).find('[name=title]').val(),
  //     author: $(e.target).find('[name=author]').val(),
  //   };
  //       
  //   Meteor.call('bookInsert', book, function(error, result) {
  //      if (error)
  //        return console.log(error.reason);
  //        //return throwError(error.reason, "danger");
  //       //throwError("This new excellent thought was successfully added to your mind-palace.", "success");  
  //   });
  // },
  'click .callServer': function () {
    var isbn = $('#isbn').val(); 

    Meteor.call('checkMolyISBN', isbn, function(error, result) {
      if (error) {
        return console.log(error.reason);
        //return throwError("Are you sure this is a valid URL?", "warning");
      } else if (!(result.data)) {
        console.log("dog");
        return console.log(error.reason);
        //return throwError("Dunno this isbn", "warning");
      } else {

        var data = $.parseJSON(result.content);

        $('#author').val(data.author);
        $('#title').val(data.title);

        Session.set('author', data.author);
        Session.set('title', data.title);
        if (data.cover) {Session.set('cover', data.cover);};
        Session.set('id', data.id);

        var id = Session.get('id');

        Meteor.call('checkMolyId', id, function(error, result) {
          if (error) return console.log(error.reason);
          //if (error) return throwError("Are you sure this is a valid URL?", "warning");

          var linkData = $.parseJSON(result);

          Session.set('link', linkData.book.url);
        });

      }

    });

  },
  'click .searchServer': function(e) {
    e.preventDefault();
    var query = $('#search').val();
    var searchResults = $('#searchResults');

    searchResults.empty();

    Meteor.call('searchMoly', query, function (error, result) {
      if (error) {
        return console.log(error.reason);
      } else {
        var data = $.parseJSON(result);
        Session.set('results', data.books);
        for (var i = 0; i < data.books.length; i++) {

          var toAppend = "<a id=\"" + [i] + "\" class=\"list-group-item\"><strong>" + data.books[i].title + "</strong> - " + data.books[i].author + "</a>";
          searchResults.append(toAppend);
          
        };
      }
    });
  },
  'click .list-group-item': function() {
    var id = event.target.id;
    var selected = Session.get('results');
    var queryId = selected[id].id;

    Meteor.call('checkMolyId', queryId, function(error, result) {
      if (error) return console.log(error.reason);
      //if (error) return throwError("Are you sure this is a valid URL?", "warning");

      var data = $.parseJSON(result);

      Session.set('link', data.book.url);
      
      var authors = [];
      for (var i = 0; i < data.book.authors.length; i++) {
        authors.push(data.book.authors[i].name);
      };

      authors = authors.join(", ");
      console.log(authors);

      $('#author').val(authors);
      $('#title').val(data.book.title);

      Session.set('author', authors);
      Session.set('title', data.book.title);
      if (data.book.cover) {Session.set('cover', data.book.cover);};
      Session.set('id', data.book.id);

      $('#searchResults').empty();
      $('#search').val('');
    });

  }
});