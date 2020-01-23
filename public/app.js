$(document).on("click", "h1", function () {
  $("#notes").empty();
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' value='Title'></br>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea></br>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function () {
  let thisId = $(this).attr("data-id");
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });
});

$(document).on("click", ".scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).done(function (data) {
    alert("Articles have been scraped!")
    window.location = "/"
})
});