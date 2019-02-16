var w = "<img class='dot' src='white_dot.png'/>";
var b = "<img class='dot' src='black_dot.png'/>";
var n = "<img class='dot' src='no_dot.png'/>";

function make_tile(id, str) {
  var i = Math.floor(Math.random() * 6) + 1;
  return [
    "<div class='tile' id='tile_", id.toString(), "'>",
    "<div class='outer'><img class='container' src='tile_",
    i.toString(), ".png'>", "<div class='container'>",
    eval(str.split('').join('+')), "</div>", "</div>", "</div>"
  ].join('');
}

var tile_faces = [
  "nbbwwnnnn", "bnnbwnnnw", "bbbnwwwnn", "wwbnnbwnb", "bwbnwnwnb",
  "wnbbnwwnb", "wbnwnbwnb", "wnbwnbnwb", "bnbnnwnwn", "wwwbnnbnb",
  "bnwbnnnnw", "bbnwwnwnb", "wnbnwnbwb", "bwbnbnwnw", "nbbwwnnwb",
  "bnbnbwwwn", "bnwwbnbnw", "nbbbwnwwn", "bwwnwnbnb", "bnnbnwbww",
  "bbbwnnnww", "bbbwnwwnn", "bwnnwnbbw", "nwwbbnbnw", "bwnbwnnbw",
  "wnbnbnwbw", "wbnwnbwbn", "nwnwwbnbb", "bwwnnnwbb", "bnbbwnwnw",
  "bbwnwnnnn", "nnnbnwnnn", "nbnnnnbww", "bnnbnwnwn", "nnnnwbwnb",
  "wwnnnnbbn", "nnbbwwnnn", "nwnbnwnnb", "nbnnbnwnw", "bwnnnnbnw",
  "bbnnnwnnw", "bnnnbnwnw", "nwnbnnnbw", "wnnwnbnnb", "nnnnnwwbb",
  "bwnnnbwnn", "nwbbnnnnw", "nbnwnnbwn", "nnwwnbnnb", "bnwnnnwnb",
  "nnwnbnwnb", "nnwnnwbbn", "nnbwwnnbn", "nwwbnwbbn", "nnnnwnbnn",
  "nnwnbnnnn", "bnnnnnnnw", "nnnnnwnbn", "nnnnwbnnn", "nnnnnbnnw",
  "bnnnnwnnn", "nnnwnnbnn", "bbbwwwnnn", "nwwbbwbbw", "nwwwnbbbn",
  "wwbnwbnnb", "wnbwwnbnb", "bbbnnnwww", "bnbwnbwwn", "wbnnnwnbn",
  "nnnwwbnnb", "bbwnnnwnn", "nbnwnbwnn", "nbwbnwnnn", "wnwnnnbbn",
  "bnbnwnnwn", "nnwwnnnbb", "nnwnwnbnb", "nnbnwbnwn", "bnnwnwnnb",
  "nbnwnbnwn", "bbnwnwnnn", "bnwnnnnwb", "wnwnnnnbb", "bnbnnnwnw",
  "wnbnnnbwn", "bnwnnwbnn", "nbwbnnwnn", "bnwnnnbwn", "bwwnnnbnn",
  "bnwbnnwnn", "bnbnnnnww", "wnbwnnnnb", "nwnnnbnwb", "wnnbwnnnb",
  "nwnnbnbnw", "bnnnnbwwn", "wnbnwnbnn", "nwbnnnnwb", "nbbnnwwnn",
  "bbnnnwnwn", "nnnnbwnbw", "nwnnbnwnb", "bbnnnnwnw", "nnbwnnwbn",
  "wnnnnnbnn", "bnbwwwbwb", "nnbnwnnwb", "nnwnnnnbn", "nnnwwbnbn",
  "nnnnnnbnw", "bbbwnwnwn", "bnnnnwbwn", "wnwnbnnbn", "wnnwnbnbn",
  "nwwwnbbnb", "bwnnbnwnn", "wnbwnnnnb", "wbbnwbnwn", "nbnnbwwnn",
  "wbnnwnnnb", "nnnnnbnwn", "wbbwnbwwb", "bnnnwwbbw", "nwbwwbnnb",
  "nnbwnnnnn", "nnwwbnbnn", "nwnnwnbnb", "nwnnnbwnb", "nnnnnbwnn",
  "nbnwnwnbn", "wbbwbnnnw", "bnnnwnbwn", "wnbwwbnnb", "nwbwnnwbb",
  "wwnnnbbnn", "nnnbnnwwb", "bwnnnnnbw", "bnbnwnnnw", "bnbwnnwnn",
  "nbbbnwwwn", "nbnwnbnnw", "bbnnnnnww", "bnwnbnnnw"

];

function setup() {
  var i = 0;
  var src = "";
  for (; i < tile_faces.length; ++i) {
    src += make_tile(i, tile_faces[i]);
    if ((i % 12) == 11) {
      src += '<br/>';
    }
  }
  document.body.innerHTML = src;
  var d = 1000;
  for (i = 0; i < tile_faces.length; ++i) {
    $('#tile_' + i).draggable();
    $('#tile_' + i).mousedown(function() {
      $(this).css('z-index', d);
      d++;
    });

    (function() {
      var spin = 0;
      $('#tile_' + i).bind('mousewheel', function(e) {
        e.preventDefault();
        spin += e.originalEvent.wheelDelta / 12;
        $(this).css('transform', 'rotate(' + spin + 'deg)');
        $(this).css('z-index', d);
        d++;
      })
    })();
  }
}
