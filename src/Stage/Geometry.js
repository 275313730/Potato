export default function geometry() {
  function getData(unit1, unit2) {
    const { x: x1, y: y1, width: w1, height: h1 } = unit1;
    const { x: x2, y: y2, width: w2, height: h2 } = unit2;

    return { x1, y1, w1, h1, x2, y2, w2, h2 };
  }
  return {
    // 在上面
    above(unit1, unit2) {
      const { x1, y1, w1, h1, x2, y2, w2 } = getData(unit1, unit2);

      if (y1 + h1 <= y2 && x1 + w1 >= x2 && x1 <= x2 + w2) {
        return true;
      }
      return false;
    },
    // 包含
    contain(unit1, unit2) {
      const { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2);

      if (w1 < w2 && h1 < h2 &&
        (x1 <= x2 || x1 + w1 >= x2 + w2) &&
        (y1 <= y2 || y1 + h1 >= y2 + h2)) {
        return false;
      }
      return true;
    },
    // 距离()
    distance(type, unit1, unit2) {
      const { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2);
      // 纵向距离
      if (type === 'y') {
        if (y2 > y1 + h1) {
          return y2 - (y1 + h1);
        } else if (y1 > y2 + h2) {
          return y1 - (y2 + h2);
        } else {
          return 0;
        }
      }
      // 横向距离
      if (type === 'x') {
        if (x2 > x1 + w1) {
          return x2 - (x1 + w1);
        } else if (x1 > x2 + w2) {
          return x1 - (x2 + w2);
        } else {
          return 0;
        }
      }
      // 中心距离
      if (type === "o") {
        const o1 = [x1 + w1 / 2, y1 + h1 / 2];
        const o2 = [x2 + w2 / 2, y2 + h2 / 2];
        return Math.sqrt((o1[0] - o2[0]) ** 2 + (o1[1] - o2[1]) ** 2);
      }
    },
    // 相交
    intersect(unit1, unit2) {
      const { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2);

      if (x1 >= x2 + w2 ||
        x1 + w1 <= x2 ||
        y1 >= y2 + h2 ||
        y1 + h1 <= y2) {
        return false;
      }
      return true;
    },
    // 在右边
    onRight(unit1, unit2) {
      const { x1, y1, h1, x2, y2, w2, h2 } = getData(unit1, unit2);

      if (x1 >= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
        return true;
      }
      return false;
    },
    // 在左边
    onLeft(unit1, unit2) {
      const { x1, y1, w1, h1, x2, y2, h2 } = getData(unit1, unit2);

      if (x1 + w1 <= x2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
        return true;
      }
      return false;
    },
    // 相切
    tangent(unit1, unit2) {
      const { x1, y1, w1, h1, x2, y2, w2, h2 } = getData(unit1, unit2);

      if (x1 > x2 + w2 ||
        x1 + w1 < x2 ||
        y1 > y2 + h2 ||
        y1 + h1 < y2) {
        return false;
      }
      return true;
    },
    // 在下面
    under(unit1, unit2) {
      const { x1, y1, w1, x2, y2, w2, h2 } = getData(unit1, unit2);

      if (y1 >= y2 + h2 && x1 + w1 >= x2 && x1 <= x2 + w2) {
        return true;
      }
      return false;
    }
  };
}