var w = "<img class='dot' src='white_dot.png'/>";
var b = "<img class='dot' src='black_dot.png'/>";
var n = "<img class='dot' src='no_dot.png'/>";

var tile_blank = {};

// The max z-index of any tile.
//
var max_z = 1000;

function mod(x, m) {
  if (x < 0) {
    return (m - (-x % m)) % m;
  }
  return x % m;
}

function snap_to_90deg(angle) {
  return Math.floor(mod(angle + 45, 360) / 90) * 90;
}

function rotate_xy(x, y, deg) {
  switch (snap_to_90deg(deg)) {
  case 0:
    return [ x, y ];
  case 90:
    return [ 2 - y, x ];
  case 180:
    return [ 2 - x, 2 - y ];
  case 270:
    return [ y, 2 - x ];
  }
}

function make_tile(id, str, rotate, placed) {
  var i = Math.floor(Math.random() * 6) + 1;
  if (id in tile_blank) {
    i = tile_blank[id];
  } else {
    tile_blank[id] = i;
  }
  if (rotate === undefined) {
    rotate = 0;
  }
  if (placed) {
    class_attr = "tile placed";
  } else {
    class_attr = "tile";
  }
  var r = rotate;
  return [
    "<div class='",
    class_attr,
    "' id='tile_",
    id.toString(),
    "' style='transform: rotate(",
    rotate,
    "deg);'>",
    "<div class='outer'><img class='container' src='tile_",
    i.toString(),
    ".png'>",
    "<div class='container'>",
    eval(str.split('').join('+')),
    "</div>",
    "<div class='container'>",   //
    "<div class='overlay_row'>", //
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(0, 0, r)[0], rotate_xy(0, 0, r)[1] ].join('_'),
    "'></div>",
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(1, 0, r)[0], rotate_xy(1, 0, r)[1] ].join('_'),
    "'></div>",
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(2, 0, r)[0], rotate_xy(2, 0, r)[1] ].join('_'),
    "'></div>",
    "</div>",                    //
    "<div class='overlay_row'>", //
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(0, 1, r)[0], rotate_xy(0, 1, r)[1] ].join('_'),
    "'></div>",
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(1, 1, r)[0], rotate_xy(1, 1, r)[1] ].join('_'),
    "'></div>",
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(2, 1, r)[0], rotate_xy(2, 1, r)[1] ].join('_'),
    "'></div>",
    "</div>",                    //
    "<div class='overlay_row'>", //
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(0, 2, r)[0], rotate_xy(0, 2, r)[1] ].join('_'),
    "'></div>",
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(1, 2, r)[0], rotate_xy(1, 2, r)[1] ].join('_'),
    "'></div>",
    "<div class='overlay_cell' id='dot_",
    [ id.toString(), rotate_xy(2, 2, r)[0], rotate_xy(2, 2, r)[1] ].join('_'),
    "'></div>",
    "</div>", //
    "</div>",
    "</div>",
    "</div>"
  ].join('');
}

function make_option(id) {
  return "<div class='option' id='" + (id.toString()) + "'></div>";
}

function tile_id(id) { return '#tile_' + id.toString(); }
function $tile(id) { return $(tile_id(id)); }

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

var bag = [];
var tile_spin = {};

var max_width = 5;
var max_height = 5;

for (var i = 0; i < 144; ++i) {
  bag[i] = i;
}

function take_random(bag) {
  var i = Math.floor(Math.random() * bag.length);
  var choice = bag[i];
  bag[i] = bag[bag.length - 1];
  bag.pop();
  return choice;
}

function make_board(bag) {
  var center = take_random(bag);
  return {
    0 : {
      0 : {
        "type" : "tile",
        "index" : center,
        "rotate" : 0,
      }
    }
  };
}

function each_cell(board, fn) {
  for (var x in board) {
    x = parseInt(x, 10);
    var column = board[x];
    for (var y in column) {
      y = parseInt(y, 10);
      fn(x, y, column[y]);
    }
  }
}

function find_extents(board) {
  var placed = {
    left : 10000,
    right : -10000,
    top : 10000,
    bottom : -10000,
  };
  var revealed = {
    left : 10000,
    right : -10000,
    top : 10000,
    bottom : -10000,
  };

  function update_box(box, x, y) {
    if (x < box.left) {
      box.left = x;
    }
    if (x > box.right) {
      box.right = x;
    }
    if (y < box.top) {
      box.top = y;
    }
    if (y > box.bottom) {
      box.bottom = y;
    }
    box.width = box.right - box.left + 1;
    box.height = box.bottom - box.top + 1;
  }

  each_cell(board, function(x, y, cell) {
    if (cell.type === "tile") {
      update_box(placed, x, y);
    }
    update_box(revealed, x, y);
  });

  return {
    placed : placed,
    revealed : revealed,
  };
}

function dot_graph(face, rotate) {
  var graph = {0 : {}, 1 : {}, 2 : {}};
  var i = 0;
  rotate = snap_to_90deg(rotate);
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 3; ++x) {
      var tx = rotate_xy(x, y, rotate)[0];
      var ty = rotate_xy(x, y, rotate)[1];
      switch (face.charAt(i++)) {
      case 'b':
        graph[tx][ty] = 'b';
        break;
      case 'w':
        graph[tx][ty] = 'w';
        break;
      }
    }
  }
  return graph;
}

function board_get(board, x, y) {
  if (!(x in board)) {
    return undefined;
  }
  if (!(y in board[x])) {
    return undefined;
  }
  return board[x][y];
}

function board_dot(board, x, y) {
  var cell_x = Math.floor(x / 3);
  var cell_y = Math.floor(y / 3);
  var cell = board_get(board, cell_x, cell_y);
  if (cell === undefined || cell.type !== "tile") {
    return undefined;
  }
  var cell_dots = dot_graph(tile_faces[cell.index], cell.rotate);
  return cell_dots[mod(x, 3)][mod(y, 3)];
}

function board_put(board, x, y, cell) {
  if (cell === undefined) {
    if (x in board) {
      delete board[x][y];
    }
    return;
  }
  if (!(x in board)) {
    board[x] = {};
  }
  board[x][y] = cell;
}

function update_options(board) {
  var extents = find_extents(board).placed;
  each_cell(board, function(x, y, cell) {
    if (extents.width >= max_width && (x < extents.left || x > extents.right)) {
      board_put(board, x, y, undefined);
    }
    if (extents.height >= max_height &&
        (y < extents.top || y > extents.bottom)) {
      board_put(board, x, y, undefined);
    }
    if (cell["type"] !== "tile") {
      return;
    }
    if (extents.width < max_width || x > extents.left) {
      if (board_get(board, x - 1, y) === undefined) {
        board_put(board, x - 1, y, {"type" : "option"});
      }
    }
    if (extents.width < max_width || x < extents.right) {
      if (board_get(board, x + 1, y) === undefined) {
        board_put(board, x + 1, y, {"type" : "option"});
      }
    }
    if (extents.height < max_height || y > extents.top) {
      if (board_get(board, x, y - 1) === undefined) {
        board_put(board, x, y - 1, {"type" : "option"});
      }
    }
    if (extents.height < max_height || y < extents.bottom) {
      if (board_get(board, x, y + 1) === undefined) {
        board_put(board, x, y + 1, {"type" : "option"});
      }
    }
  });
  return board;
}

function place_tile(board, x, y, tile_index) {
  board_put(board, x, y, {
    "type" : "tile",
    "index" : tile_index,
    "rotate" : snap_to_90deg(tile_spin[tile_index])
  });
  update_options(board);
  render_board(board);
}

function draw_tile() {
  // Pick a tile uniformly at random from the bag.
  //
  var t = take_random(bag);

  // Add the tile to the public tray.
  //
  $("#public_tray").html(make_tile(t, tile_faces[t]));
  $("#preview_tray").html(make_tile(t + "_preview", tile_faces[t]));

  // Add behaviors: draggable, bring-to-front, spinnable.
  //
  $tile(t).draggable();

  $tile(t).mousedown(function() { $(this).css('z-index', max_z++); });

  tile_spin[t] = 0;
  $tile(t).bind('mousewheel', function(e) {
    e.preventDefault();
    tile_spin[t] += e.originalEvent.wheelDelta / 12;
    $(this).css('transform', 'rotate(' + tile_spin[t] + 'deg)');
    $(this).css('z-index', max_z++);
    $("#tile_" + t + "_preview")
        .css("transform", "rotate(" + snap_to_90deg(tile_spin[t]) + "deg)");
  });

  $tile(t).attr('title', 'Tile Face: ' + t);
}

function district_of(board, x, y) {
  function key_of(x, y) { return [ x, y ].join('_'); }

  var visited = {};
  visited[key_of(x, y)] = true;
  var stack = [ key_of(x, y) ];
  var d = {w_count : 0, b_count : 0, dots : []};
  while (stack.length > 0) {
    var next = stack.pop();
    var parts = next.split('_');
    var x = parseInt(parts[0]), y = parseInt(parts[1]);
    var dot = board_dot(board, x, y);
    if (dot !== 'w' && dot !== 'b') {
      continue;
    }
    switch (dot) {
    case 'w':
      d.w_count += 1;
      break;
    case 'b':
      d.b_count += 1;
      break;
    }
    d.dots.push([ x, y ]);
    if (!(key_of(x - 1, y) in visited)) {
      visited[key_of(x - 1, y)] = true;
      stack.push(key_of(x - 1, y));
    }
    if (!(key_of(x + 1, y) in visited)) {
      visited[key_of(x + 1, y)] = true;
      stack.push(key_of(x + 1, y));
    }
    if (!(key_of(x, y - 1) in visited)) {
      visited[key_of(x, y - 1)] = true;
      stack.push(key_of(x, y - 1));
    }
    if (!(key_of(x, y + 1) in visited)) {
      visited[key_of(x, y + 1)] = true;
      stack.push(key_of(x, y + 1));
    }
  }
  return d;
}

function render_board(board) {
  // Generate the HTML for the board.
  //
  var tile_ids = [];
  var html = [];
  var extents = find_extents(board).revealed;
  for (var y = extents.top; y <= extents.bottom; ++y) {
    html.push("<div>");
    for (var x = extents.left; x <= extents.right; ++x) {
      var cell = board_get(board, x, y);
      if (cell === undefined) {
        html.push("<div class='empty_cell'></div>");
      } else if (cell["type"] === "tile") {
        html.push(make_tile([ cell["index"], x, y ].join('_'),
                            tile_faces[cell["index"]], cell["rotate"],
                            /*placed=*/true));
      } else if (cell["type"] === "option") {
        html.push(make_option("cell_" + x + "_" + y));
      }
    }
    html.push("</div>");
  }

  // Replace the current board with the new HTML.
  //
  $("#board").html(html.join(''));

  // Add behavior.
  //
  // All "option" positions should be droppable.
  //
  $(".option").droppable({
    drop : function(event, ui) {
      var tile_elem = ui.draggable[0];
      var dropped_tile = parseInt(tile_elem.id.split("_")[1], 10);
      var parts = $(this)[0].id.split("_");
      var x = parseInt(parts[1], 10);
      var y = parseInt(parts[2], 10);
      ui.draggable.remove();
      place_tile(board, x, y, dropped_tile);
      draw_tile();
    }
  });

  $(".tile.placed .overlay_cell")
      .mouseenter(function() {
        var i = $(this)[0].id;
        var v = $.map($(i.split('_')), function(n) {
                   return parseInt(n, 10);
                 }).splice(1);
        var x = v[1] * 3 + v[3];
        var y = v[2] * 3 + v[4];
        var d = district_of(board, x, y);
        $("#private_tray").html([
          i, ": ", board_dot(board, x, y), "<br>black: ", d.b_count,
          "<br>white:", d.w_count
        ].join(''));
        console.log('------------------------');
        for (var j = 0; j < d.dots.length; ++j) {
          var cell_x = Math.floor(d.dots[j][0] / 3);
          var cell_y = Math.floor(d.dots[j][1] / 3);
          var inner_x = mod(d.dots[j][0], 3);
          var inner_y = mod(d.dots[j][1], 3);
          var tile_index = board_get(board, cell_x, cell_y).index;

          var dot_id = [
            "#dot",
            tile_index.toString(),
            cell_x.toString(),
            cell_y.toString(),
            inner_x.toString(),
            inner_y.toString(),
          ].join('_');
          console.log(dot_id);
          $(dot_id).addClass('dot_hover');
        }
        console.log('------------------------');
      })
      .mouseleave(function() { $("div").removeClass('dot_hover'); });
  return board;
}

var tile_groups = [
  {"i" : 0, "left" : "471px", "top" : "656px"},
  {"i" : 1, "left" : "779px", "top" : "714px"},
  {"i" : 2, "left" : "899px", "top" : "10px"},
  {"i" : 3, "left" : "979px", "top" : "14px"},
  {"i" : 4, "left" : "-39px", "top" : "253px"},
  {"i" : 5, "left" : "788px", "top" : "188px"},
  {"i" : 6, "left" : "318px", "top" : "91px"},
  {"i" : 7, "left" : "152px", "top" : "10px"},
  {"i" : 8, "left" : "847px", "top" : "589px"},
  {"i" : 9, "left" : "476px", "top" : "95px"},
  {"i" : 10, "left" : "333px", "top" : "636px"},
  {"i" : 11, "left" : "63px", "top" : "91px"},
  {"i" : 12, "left" : "379px", "top" : "169px"},
  {"i" : 13, "left" : "400px", "top" : "265px"},
  {"i" : 14, "left" : "325px", "top" : "-72px"},
  {"i" : 15, "left" : "1063px", "top" : "11px"},
  {"i" : 16, "left" : "230px", "top" : "265px"},
  {"i" : 17, "left" : "-173px", "top" : "9px"},
  {"i" : 18, "left" : "-21px", "top" : "169px"},
  {"i" : 19, "left" : "-259px", "top" : "11px"},
  {"i" : 20, "left" : "149px", "top" : "-74px"},
  {"i" : 21, "left" : "-427px", "top" : "-71px"},
  {"i" : 22, "left" : "-675px", "top" : "9px"},
  {"i" : 23, "left" : "390px", "top" : "-71px"},
  {"i" : 24, "left" : "247px", "top" : "-156px"},
  {"i" : 25, "left" : "213px", "top" : "167px"},
  {"i" : 26, "left" : "982px", "top" : "-73px"},
  {"i" : 27, "left" : "240px", "top" : "-73px"},
  {"i" : 28, "left" : "872px", "top" : "101px"},
  {"i" : 29, "left" : "-42px", "top" : "167px"},
  {"i" : 30, "left" : "-33px", "top" : "406px"},
  {"i" : 31, "left" : "-408px", "top" : "361px"},
  {"i" : 32, "left" : "-88px", "top" : "730px"},
  {"i" : 33, "left" : "251px", "top" : "548px"},
  {"i" : 34, "left" : "23px", "top" : "464px"},
  {"i" : 35, "left" : "-911px", "top" : "735px"},
  {"i" : 36, "left" : "308px", "top" : "322px"},
  {"i" : 37, "left" : "990px", "top" : "271px"},
  {"i" : 38, "left" : "1086px", "top" : "464px"},
  {"i" : 39, "left" : "958px", "top" : "192px"},
  {"i" : 40, "left" : "-242px", "top" : "651px"},
  {"i" : 41, "left" : "1086px", "top" : "-229px"},
  {"i" : 42, "left" : "486px", "top" : "353px"},
  {"i" : 43, "left" : "-307px", "top" : "653px"},
  {"i" : 44, "left" : "-364px", "top" : "241px"},
  {"i" : 45, "left" : "679px", "top" : "257px"},
  {"i" : 46, "left" : "595px", "top" : "338px"},
  {"i" : 47, "left" : "-167px", "top" : "-44px"},
  {"i" : 48, "left" : "502px", "top" : "562px"},
  {"i" : 49, "left" : "1423px", "top" : "-64px"},
  {"i" : 50, "left" : "1339px", "top" : "-150px"},
  {"i" : 51, "left" : "-76px", "top" : "567px"},
  {"i" : 52, "left" : "449px", "top" : "565px"},
  {"i" : 53, "left" : "688px", "top" : "-147px"},
  {"i" : 54, "left" : "-405px", "top" : "191px"},
  {"i" : 55, "left" : "-572px", "top" : "272px"},
  {"i" : 56, "left" : "-656px", "top" : "108px"},
  {"i" : 57, "left" : "-660px", "top" : "436px"},
  {"i" : 58, "left" : "-743px", "top" : "355px"},
  {"i" : 59, "left" : "-745px", "top" : "356px"},
  {"i" : 60, "left" : "97px", "top" : "188px"},
  {"i" : 61, "left" : "-67px", "top" : "270px"},
  {"i" : 62, "left" : "406px", "top" : "-325px"},
  {"i" : 63, "left" : "-236px", "top" : "-328px"},
  {"i" : 64, "left" : "956px", "top" : "-151px"},
  {"i" : 65, "left" : "155px", "top" : "-408px"},
  {"i" : 66, "left" : "61px", "top" : "-167px"},
  {"i" : 67, "left" : "519px", "top" : "-150px"},
  {"i" : 68, "left" : "68px", "top" : "-328px"},
  {"i" : 69, "left" : "234px", "top" : "103px"},
  {"i" : 70, "left" : "-450px", "top" : "72px"},
  {"i" : 71, "left" : "-142px", "top" : "93px"},
  {"i" : 72, "left" : "1006px", "top" : "295px"},
  {"i" : 73, "left" : "755px", "top" : "-296px"},
  {"i" : 74, "left" : "1005px", "top" : "212px"},
  {"i" : 75, "left" : "1000px", "top" : "378px"},
  {"i" : 76, "left" : "1081px", "top" : "212px"},
  {"i" : 77, "left" : "1004px", "top" : "-480px"},
  {"i" : 78, "left" : "-115px", "top" : "152px"},
  {"i" : 79, "left" : "-1px", "top" : "289px"},
  {"i" : 80, "left" : "836px", "top" : "-149px"},
  {"i" : 81, "left" : "82px", "top" : "-215px"},
  {"i" : 82, "left" : "371px", "top" : "21px"},
  {"i" : 83, "left" : "412px", "top" : "213px"},
  {"i" : 84, "left" : "1426px", "top" : "-316px"},
  {"i" : 85, "left" : "1209px", "top" : "-62px"},
  {"i" : 86, "left" : "1003px", "top" : "211px"},
  {"i" : 87, "left" : "336px", "top" : "-38px"},
  {"i" : 88, "left" : "957px", "top" : "-144px"},
  {"i" : 89, "left" : "281px", "top" : "-156px"},
  {"i" : 90, "left" : "278px", "top" : "-156px"},
  {"i" : 91, "left" : "581px", "top" : "293px"},
  {"i" : 92, "left" : "664px", "top" : "212px"},
  {"i" : 93, "left" : "1px", "top" : "-299px"},
  {"i" : 94, "left" : "26px", "top" : "313px"},
  {"i" : 95, "left" : "60px", "top" : "321px"},
  {"i" : 96, "left" : "1418px", "top" : "125px"},
  {"i" : 97, "left" : "1340px", "top" : "-485px"},
  {"i" : 98, "left" : "420px", "top" : "40px"},
  {"i" : 99, "left" : "448px", "top" : "-40px"},
  {"i" : 100, "left" : "1164px", "top" : "44px"},
  {"i" : 101, "left" : "-31px", "top" : "-98px"},
  {"i" : 102, "left" : "562px", "top" : "238px"},
  {"i" : 103, "left" : "749px", "top" : "-36px"},
  {"i" : 104, "left" : "30px", "top" : "147px"},
  {"i" : 105, "left" : "-577px", "top" : "-61px"},
  {"i" : 106, "left" : "-825px", "top" : "-497px"},
  {"i" : 107, "left" : "-140px", "top" : "148px"},
  {"i" : 108, "left" : "177px", "top" : "18px"},
  {"i" : 109, "left" : "387px", "top" : "-264px"},
  {"i" : 110, "left" : "13px", "top" : "-310px"},
  {"i" : 111, "left" : "898px", "top" : "-742px"},
  {"i" : 112, "left" : "1183px", "top" : "-248px"},
  {"i" : 113, "left" : "835px", "top" : "-120px"},
  {"i" : 114, "left" : "996px", "top" : "42px"},
  {"i" : 115, "left" : "415px", "top" : "-569px"},
  {"i" : 116, "left" : "110px", "top" : "-124px"},
  {"i" : 117, "left" : "579px", "top" : "127px"},
  {"i" : 118, "left" : "-429px", "top" : "-743px"},
  {"i" : 119, "left" : "-143px", "top" : "-42px"},
  {"i" : 120, "left" : "702px", "top" : "60px"},
  {"i" : 121, "left" : "-69px", "top" : "-69px"},
  {"i" : 122, "left" : "-152px", "top" : "-831px"},
  {"i" : 123, "left" : "816px", "top" : "-748px"},
  {"i" : 124, "left" : "74px", "top" : "-745px"},
  {"i" : 125, "left" : "-320px", "top" : "-395px"},
  {"i" : 126, "left" : "196px", "top" : "-126px"},
  {"i" : 127, "left" : "667px", "top" : "-43px"},
  {"i" : 128, "left" : "418px", "top" : "-123px"},
  {"i" : 129, "left" : "-739px", "top" : "-314px"},
  {"i" : 130, "left" : "586px", "top" : "-484px"},
  {"i" : 131, "left" : "61px", "top" : "-830px"},
  {"i" : 132, "left" : "866px", "top" : "-105px"},
  {"i" : 133, "left" : "81px", "top" : "-912px"},
  {"i" : 134, "left" : "835px", "top" : "-655px"},
  {"i" : 135, "left" : "837px", "top" : "-125px"},
  {"i" : 136, "left" : "-28px", "top" : "-268px"},
  {"i" : 137, "left" : "168px", "top" : "-293px"},
  {"i" : 138, "left" : "920px", "top" : "-818px"},
  {"i" : 139, "left" : "113px", "top" : "-411px"},
  {"i" : 140, "left" : "621px", "top" : "-737px"},
  {"i" : 141, "left" : "316px", "top" : "-318px"},
  {"i" : 142, "left" : "-477px", "top" : "-20px"},
  {"i" : 143, "left" : "583px", "top" : "-819px"},
];
