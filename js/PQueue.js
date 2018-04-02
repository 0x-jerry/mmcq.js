// Simple priority queue
function PQueue(comparator) {
  var contents = [],
    sorted = false;

  function sort() {
    contents.sort(comparator);
    sorted = true;
  }

  return {
    push: function (o) {
      contents.push(o);
      sorted = false;
    },
    peek: function (index) {
      if (!sorted) sort();
      if (index === undefined) index = contents.length - 1;
      return contents[index];
    },
    pop: function () {
      if (!sorted) sort();
      return contents.pop();
    },
    size: function () {
      return contents.length;
    },
    map: function (f) {
      return contents.map(f);
    },
    debug: function () {
      if (!sorted) sort();
      return contents;
    }
  };
}

module.exports = PQueue
