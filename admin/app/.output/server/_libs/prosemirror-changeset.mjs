function typeID(type) {
  let cache = type.schema.cached.changeSetIDs || (type.schema.cached.changeSetIDs = /* @__PURE__ */ Object.create(null));
  let id = cache[type.name];
  if (id == null)
    cache[type.name] = id = Object.keys(type.schema.nodes).indexOf(type.name) + 1;
  return id;
}
const DefaultEncoder = {
  encodeCharacter: (char) => char,
  encodeNodeStart: (node) => node.type.name,
  encodeNodeEnd: (node) => -typeID(node.type),
  compareTokens: (a, b) => a === b
};
function tokens(frag, encoder, start, end, target) {
  for (let i = 0, off = 0; i < frag.childCount; i++) {
    let child = frag.child(i), endOff = off + child.nodeSize;
    let from = Math.max(off, start), to = Math.min(endOff, end);
    if (from < to) {
      if (child.isText) {
        for (let j = from; j < to; j++)
          target.push(encoder.encodeCharacter(child.text.charCodeAt(j - off), child.marks));
      } else if (child.isLeaf) {
        target.push(encoder.encodeNodeStart(child));
      } else {
        if (from == off)
          target.push(encoder.encodeNodeStart(child));
        tokens(child.content, encoder, Math.max(off + 1, from) - off - 1, Math.min(endOff - 1, to) - off - 1, target);
        if (to == endOff)
          target.push(encoder.encodeNodeEnd(child));
      }
    }
    off = endOff;
  }
  return target;
}
const MAX_DIFF_SIZE = 5e3;
function minUnchanged(sizeA, sizeB) {
  return Math.min(15, Math.max(2, Math.floor(Math.max(sizeA, sizeB) / 10)));
}
function computeDiff(fragA, fragB, range, encoder = DefaultEncoder) {
  let tokA = tokens(fragA, encoder, range.fromA, range.toA, []);
  let tokB = tokens(fragB, encoder, range.fromB, range.toB, []);
  let start = 0, endA = tokA.length, endB = tokB.length;
  let cmp = encoder.compareTokens;
  while (start < tokA.length && start < tokB.length && cmp(tokA[start], tokB[start]))
    start++;
  if (start == tokA.length && start == tokB.length)
    return [];
  while (endA > start && endB > start && cmp(tokA[endA - 1], tokB[endB - 1]))
    endA--, endB--;
  if (endA == start || endB == start || endA == endB && endA == start + 1)
    return [range.slice(start, endA, start, endB)];
  let lenA = endA - start, lenB = endB - start;
  let max = Math.min(MAX_DIFF_SIZE, lenA + lenB), off = max + 1;
  let history = [];
  let frontier = [];
  for (let len = off * 2, i = 0; i < len; i++)
    frontier[i] = -1;
  for (let size = 0; size <= max; size++) {
    for (let diag = -size; diag <= size; diag += 2) {
      let next = frontier[diag + 1 + max], prev = frontier[diag - 1 + max];
      let x = next < prev ? prev : next + 1, y = x + diag;
      while (x < lenA && y < lenB && cmp(tokA[start + x], tokB[start + y]))
        x++, y++;
      frontier[diag + max] = x;
      if (x >= lenA && y >= lenB) {
        let diff = [], minSpan = minUnchanged(endA - start, endB - start);
        let fromA = -1, toA = -1, fromB = -1, toB = -1;
        let add = (fA, tA, fB, tB) => {
          if (fromA > -1 && fromA < tA + minSpan) {
            fromA = fA;
            fromB = fB;
          } else {
            if (fromA > -1)
              diff.push(range.slice(fromA, toA, fromB, toB));
            fromA = fA;
            toA = tA;
            fromB = fB;
            toB = tB;
          }
        };
        for (let i = size - 1; i >= 0; i--) {
          let next2 = frontier[diag + 1 + max], prev2 = frontier[diag - 1 + max];
          if (next2 < prev2) {
            diag--;
            x = prev2 + start;
            y = x + diag;
            add(x, x, y, y + 1);
          } else {
            diag++;
            x = next2 + start;
            y = x + diag;
            add(x, x + 1, y, y);
          }
          frontier = history[i >> 1];
        }
        if (fromA > -1)
          diff.push(range.slice(fromA, toA, fromB, toB));
        return diff.reverse();
      }
    }
    if (size % 2 == 0)
      history.push(frontier.slice());
  }
  return [range.slice(start, endA, start, endB)];
}
class Span {
  /**
  @internal
  */
  constructor(length, data) {
    this.length = length;
    this.data = data;
  }
  /**
  @internal
  */
  cut(length) {
    return length == this.length ? this : new Span(length, this.data);
  }
  /**
  @internal
  */
  static slice(spans, from, to) {
    if (from == to)
      return Span.none;
    if (from == 0 && to == Span.len(spans))
      return spans;
    let result = [];
    for (let i = 0, off = 0; off < to; i++) {
      let span = spans[i], end = off + span.length;
      let overlap = Math.min(to, end) - Math.max(from, off);
      if (overlap > 0)
        result.push(span.cut(overlap));
      off = end;
    }
    return result;
  }
  /**
  @internal
  */
  static join(a, b, combine) {
    if (a.length == 0)
      return b;
    if (b.length == 0)
      return a;
    let combined = combine(a[a.length - 1].data, b[0].data);
    if (combined == null)
      return a.concat(b);
    let result = a.slice(0, a.length - 1);
    result.push(new Span(a[a.length - 1].length + b[0].length, combined));
    for (let i = 1; i < b.length; i++)
      result.push(b[i]);
    return result;
  }
  /**
  @internal
  */
  static len(spans) {
    let len = 0;
    for (let i = 0; i < spans.length; i++)
      len += spans[i].length;
    return len;
  }
}
Span.none = [];
class Change {
  /**
  @internal
  */
  constructor(fromA, toA, fromB, toB, deleted, inserted) {
    this.fromA = fromA;
    this.toA = toA;
    this.fromB = fromB;
    this.toB = toB;
    this.deleted = deleted;
    this.inserted = inserted;
  }
  /**
  @internal
  */
  get lenA() {
    return this.toA - this.fromA;
  }
  /**
  @internal
  */
  get lenB() {
    return this.toB - this.fromB;
  }
  /**
  @internal
  */
  slice(startA, endA, startB, endB) {
    if (startA == 0 && startB == 0 && endA == this.toA - this.fromA && endB == this.toB - this.fromB)
      return this;
    return new Change(this.fromA + startA, this.fromA + endA, this.fromB + startB, this.fromB + endB, Span.slice(this.deleted, startA, endA), Span.slice(this.inserted, startB, endB));
  }
  /**
  This merges two changesets (the end document of x should be the
  start document of y) into a single one spanning the start of x to
  the end of y.
  */
  static merge(x, y, combine) {
    if (x.length == 0)
      return y;
    if (y.length == 0)
      return x;
    let result = [];
    for (let iX = 0, iY = 0, curX = x[0], curY = y[0]; ; ) {
      if (!curX && !curY) {
        return result;
      } else if (curX && (!curY || curX.toB < curY.fromA)) {
        let off = iY ? y[iY - 1].toB - y[iY - 1].toA : 0;
        result.push(off == 0 ? curX : new Change(curX.fromA, curX.toA, curX.fromB + off, curX.toB + off, curX.deleted, curX.inserted));
        curX = iX++ == x.length ? null : x[iX];
      } else if (curY && (!curX || curY.toA < curX.fromB)) {
        let off = iX ? x[iX - 1].toB - x[iX - 1].toA : 0;
        result.push(off == 0 ? curY : new Change(curY.fromA - off, curY.toA - off, curY.fromB, curY.toB, curY.deleted, curY.inserted));
        curY = iY++ == y.length ? null : y[iY];
      } else {
        let pos = Math.min(curX.fromB, curY.fromA);
        let fromA = Math.min(curX.fromA, curY.fromA - (iX ? x[iX - 1].toB - x[iX - 1].toA : 0)), toA = fromA;
        let fromB = Math.min(curY.fromB, curX.fromB + (iY ? y[iY - 1].toB - y[iY - 1].toA : 0)), toB = fromB;
        let deleted = Span.none, inserted = Span.none;
        let enteredX = false, enteredY = false;
        for (; ; ) {
          let nextX = !curX ? 2e8 : pos >= curX.fromB ? curX.toB : curX.fromB;
          let nextY = !curY ? 2e8 : pos >= curY.fromA ? curY.toA : curY.fromA;
          let next = Math.min(nextX, nextY);
          let inX = curX && pos >= curX.fromB, inY = curY && pos >= curY.fromA;
          if (!inX && !inY)
            break;
          if (inX && pos == curX.fromB && !enteredX) {
            deleted = Span.join(deleted, curX.deleted, combine);
            toA += curX.lenA;
            enteredX = true;
          }
          if (inX && !inY) {
            inserted = Span.join(inserted, Span.slice(curX.inserted, pos - curX.fromB, next - curX.fromB), combine);
            toB += next - pos;
          }
          if (inY && pos == curY.fromA && !enteredY) {
            inserted = Span.join(inserted, curY.inserted, combine);
            toB += curY.lenB;
            enteredY = true;
          }
          if (inY && !inX) {
            deleted = Span.join(deleted, Span.slice(curY.deleted, pos - curY.fromA, next - curY.fromA), combine);
            toA += next - pos;
          }
          if (inX && next == curX.toB) {
            curX = iX++ == x.length ? null : x[iX];
            enteredX = false;
          }
          if (inY && next == curY.toA) {
            curY = iY++ == y.length ? null : y[iY];
            enteredY = false;
          }
          pos = next;
        }
        if (fromA < toA || fromB < toB)
          result.push(new Change(fromA, toA, fromB, toB, deleted, inserted));
      }
    }
  }
  /**
  Deserialize a change from JSON format.
  */
  static fromJSON(json) {
    return new Change(json.fromA, json.toA, json.fromB, json.toB, json.deleted.map((d) => new Span(d.length, d.data)), json.inserted.map((d) => new Span(d.length, d.data)));
  }
  /**
  Returns a JSON-serializeable object to represent this change.
  */
  toJSON() {
    return this;
  }
}
let letter;
try {
  letter = new RegExp("[\\p{Alphabetic}_]", "u");
} catch (_) {
}
class ChangeSet {
  /**
  @internal
  */
  constructor(config, changes) {
    this.config = config;
    this.changes = changes;
  }
  /**
  Computes a new changeset by adding the given step maps and
  metadata (either as an array, per-map, or as a single value to be
  associated with all maps) to the current set. Will not mutate the
  old set.
  
  Note that due to simplification that happens after each add,
  incrementally adding steps might create a different final set
  than adding all those changes at once, since different document
  tokens might be matched during simplification depending on the
  boundaries of the current changed ranges.
  */
  addSteps(newDoc, maps, data) {
    let stepChanges = [];
    for (let i = 0; i < maps.length; i++) {
      let d = Array.isArray(data) ? data[i] : data;
      let off = 0;
      maps[i].forEach((fromA, toA, fromB, toB) => {
        stepChanges.push(new Change(fromA + off, toA + off, fromB, toB, fromA == toA ? Span.none : [new Span(toA - fromA, d)], fromB == toB ? Span.none : [new Span(toB - fromB, d)]));
        off = toB - fromB - (toA - fromA);
      });
    }
    if (stepChanges.length == 0)
      return this;
    let newChanges = mergeAll(stepChanges, this.config.combine);
    let changes = Change.merge(this.changes, newChanges, this.config.combine);
    let updated = changes;
    for (let i = 0; i < updated.length; i++) {
      let change = updated[i];
      if (change.fromA == change.toA || change.fromB == change.toB || // Only look at changes that touch newly added changed ranges
      !newChanges.some((r) => r.toB > change.fromB && r.fromB < change.toB))
        continue;
      let diff = computeDiff(this.config.doc.content, newDoc.content, change, this.config.encoder);
      if (diff.length == 1 && diff[0].fromB == 0 && diff[0].toB == change.toB - change.fromB)
        continue;
      if (updated == changes)
        updated = changes.slice();
      if (diff.length == 1) {
        updated[i] = diff[0];
      } else {
        updated.splice(i, 1, ...diff);
        i += diff.length - 1;
      }
    }
    return new ChangeSet(this.config, updated);
  }
  /**
  The starting document of the change set.
  */
  get startDoc() {
    return this.config.doc;
  }
  /**
  Map the span's data values in the given set through a function
  and construct a new set with the resulting data.
  */
  map(f) {
    let mapSpan = (span) => {
      let newData = f(span);
      return newData === span.data ? span : new Span(span.length, newData);
    };
    return new ChangeSet(this.config, this.changes.map((ch) => {
      return new Change(ch.fromA, ch.toA, ch.fromB, ch.toB, ch.deleted.map(mapSpan), ch.inserted.map(mapSpan));
    }));
  }
  /**
  Compare two changesets and return the range in which they are
  changed, if any. If the document changed between the maps, pass
  the maps for the steps that changed it as second argument, and
  make sure the method is called on the old set and passed the new
  set. The returned positions will be in new document coordinates.
  */
  changedRange(b, maps) {
    if (b == this)
      return null;
    let touched = maps && touchedRange(maps);
    let moved = touched ? touched.toB - touched.fromB - (touched.toA - touched.fromA) : 0;
    function map(p) {
      return !touched || p <= touched.fromA ? p : p + moved;
    }
    let from = touched ? touched.fromB : 2e8, to = touched ? touched.toB : -2e8;
    function add(start, end = start) {
      from = Math.min(start, from);
      to = Math.max(end, to);
    }
    let rA = this.changes, rB = b.changes;
    for (let iA = 0, iB = 0; iA < rA.length && iB < rB.length; ) {
      let rangeA = rA[iA], rangeB = rB[iB];
      if (rangeA && rangeB && sameRanges(rangeA, rangeB, map)) {
        iA++;
        iB++;
      } else if (rangeB && (!rangeA || map(rangeA.fromB) >= rangeB.fromB)) {
        add(rangeB.fromB, rangeB.toB);
        iB++;
      } else {
        add(map(rangeA.fromB), map(rangeA.toB));
        iA++;
      }
    }
    return from <= to ? { from, to } : null;
  }
  /**
  Create a changeset with the given base object and configuration.
  
  The `combine` function is used to compare and combine metadata—it
  should return null when metadata isn't compatible, and a combined
  version for a merged range when it is.
  
  When given, a token encoder determines how document tokens are
  serialized and compared when diffing the content produced by
  changes. The default is to just compare nodes by name and text
  by character, ignoring marks and attributes.
  
  To serialize a change set, you can store its document and
  change array as JSON, and then pass the deserialized (via
  [`Change.fromJSON`](https://prosemirror.net/docs/ref/#changes.Change^fromJSON)) set of changes
  as fourth argument to `create` to recreate the set.
  */
  static create(doc, combine = (a, b) => a === b ? a : null, tokenEncoder = DefaultEncoder, changes = []) {
    return new ChangeSet({ combine, doc, encoder: tokenEncoder }, changes);
  }
}
ChangeSet.computeDiff = computeDiff;
function mergeAll(ranges, combine, start = 0, end = ranges.length) {
  if (end == start + 1)
    return [ranges[start]];
  let mid = start + end >> 1;
  return Change.merge(mergeAll(ranges, combine, start, mid), mergeAll(ranges, combine, mid, end), combine);
}
function endRange(maps) {
  let from = 2e8, to = -2e8;
  for (let i = 0; i < maps.length; i++) {
    let map = maps[i];
    if (from != 2e8) {
      from = map.map(from, -1);
      to = map.map(to, 1);
    }
    map.forEach((_s, _e, start, end) => {
      from = Math.min(from, start);
      to = Math.max(to, end);
    });
  }
  return from == 2e8 ? null : { from, to };
}
function touchedRange(maps) {
  let b = endRange(maps);
  if (!b)
    return null;
  let a = endRange(maps.map((m) => m.invert()).reverse());
  return { fromA: a.from, toA: a.to, fromB: b.from, toB: b.to };
}
function sameRanges(a, b, map) {
  return map(a.fromB) == b.fromB && map(a.toB) == b.toB && sameSpans(a.deleted, b.deleted) && sameSpans(a.inserted, b.inserted);
}
function sameSpans(a, b) {
  if (a.length != b.length)
    return false;
  for (let i = 0; i < a.length; i++)
    if (a[i].length != b[i].length || a[i].data !== b[i].data)
      return false;
  return true;
}
export {
  ChangeSet as C,
  Change as a
};
