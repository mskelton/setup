export interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface DetectedCard {
  id: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  corners: Array<{ x: number; y: number }>;
  attributes?: {
    number: 0 | 1 | 2;
    shape: 0 | 1 | 2;
    color: 0 | 1 | 2;
    fill: 0 | 1 | 2;
  };
}

export interface DetectedSet {
  cards: [DetectedCard, DetectedCard, DetectedCard];
  confidence: number;
}

export class CardDetector {
  private cardCounter = 0;

  detectCards(imageData: ImageData): DetectedCard[] {
    const cards: DetectedCard[] = [];
    const contours = this.findContours(imageData);

    for (const contour of contours) {
      if (
        this.isRectangular(contour) &&
        this.isCardSized(contour, imageData.width, imageData.height)
      ) {
        const bounds = this.getBounds(contour);
        const correctedImage = this.correctPerspective(imageData, contour);
        const attributes = this.classifyAttributes(correctedImage);

        cards.push({
          id: this.cardCounter++,
          bounds,
          corners: contour,
          attributes,
        });
      }
    }

    return cards;
  }

  findContours(imageData: ImageData): Array<{ x: number; y: number }[]> {
    const contours: Array<{ x: number; y: number }[]> = [];
    const { data, width, height } = imageData;

    const edges = this.cannyEdgeDetection(data, width, height);
    const traced = this.traceContours(edges, width, height);

    return traced.filter(contour => contour.length >= 4);
  }

  private traceContours(
    edges: boolean[],
    width: number,
    height: number,
  ): Array<{ x: number; y: number }[]> {
    const contours: Array<{ x: number; y: number }[]> = [];
    const visited = new Array(width * height).fill(false);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (edges[idx] && !visited[idx]) {
          const contour = this.traceContour(
            edges,
            visited,
            x,
            y,
            width,
            height,
          );
          if (contour.length > 20) {
            contours.push(contour);
          }
        }
      }
    }

    return contours;
  }

  private traceContour(
    edges: boolean[],
    visited: boolean[],
    startX: number,
    startY: number,
    width: number,
    height: number,
  ): Array<{ x: number; y: number }> {
    const contour: Array<{ x: number; y: number }> = [];
    const stack: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const idx = y * width + x;

      if (
        x < 0 ||
        x >= width ||
        y < 0 ||
        y >= height ||
        visited[idx] ||
        !edges[idx]
      ) {
        continue;
      }

      visited[idx] = true;
      contour.push({ x, y });

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          stack.push({ x: x + dx, y: y + dy });
        }
      }
    }

    return contour;
  }

  private cannyEdgeDetection(
    data: Uint8ClampedArray,
    width: number,
    height: number,
  ): boolean[] {
    const edges = new Array(width * height).fill(false);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const gray =
          0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

        const gx = this.getSobelX(data, x, y, width);
        const gy = this.getSobelY(data, x, y, width);
        const magnitude = Math.sqrt(gx * gx + gy * gy);

        edges[y * width + x] = magnitude > 50;
      }
    }

    return edges;
  }

  private getSobelX(
    data: Uint8ClampedArray,
    x: number,
    y: number,
    width: number,
  ): number {
    const kernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    let sum = 0;

    for (let ky = -1; ky <= 1; ky++) {
      for (let kx = -1; kx <= 1; kx++) {
        const idx = ((y + ky) * width + (x + kx)) * 4;
        const gray =
          0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        sum += gray * kernel[(ky + 1) * 3 + (kx + 1)];
      }
    }

    return sum;
  }

  private getSobelY(
    data: Uint8ClampedArray,
    x: number,
    y: number,
    width: number,
  ): number {
    const kernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    let sum = 0;

    for (let ky = -1; ky <= 1; ky++) {
      for (let kx = -1; kx <= 1; kx++) {
        const idx = ((y + ky) * width + (x + kx)) * 4;
        const gray =
          0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        sum += gray * kernel[(ky + 1) * 3 + (kx + 1)];
      }
    }

    return sum;
  }

  isRectangular(contour: Array<{ x: number; y: number }>): boolean {
    if (contour.length < 4) return false;

    const approx = this.approximatePolygon(contour);
    return approx.length === 4;
  }

  private approximatePolygon(
    contour: Array<{ x: number; y: number }>,
  ): Array<{ x: number; y: number }> {
    if (contour.length < 3) return contour;

    const epsilon = 0.02 * this.calculatePerimeter(contour);
    return this.douglasPeucker(contour, epsilon);
  }

  private calculatePerimeter(contour: Array<{ x: number; y: number }>): number {
    let perimeter = 0;
    for (let i = 0; i < contour.length; i++) {
      const current = contour[i];
      const next = contour[(i + 1) % contour.length];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    return perimeter;
  }

  private douglasPeucker(
    points: Array<{ x: number; y: number }>,
    epsilon: number,
  ): Array<{ x: number; y: number }> {
    if (points.length <= 2) return points;

    let maxDistance = 0;
    let maxIndex = 0;
    const start = points[0];
    const end = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
      const distance = this.pointToLineDistance(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }

    if (maxDistance > epsilon) {
      const left = this.douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
      const right = this.douglasPeucker(points.slice(maxIndex), epsilon);
      return [...left.slice(0, -1), ...right];
    } else {
      return [start, end];
    }
  }

  private pointToLineDistance(
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number },
  ): number {
    const A = lineEnd.x - lineStart.x;
    const B = lineEnd.y - lineStart.y;
    const C = point.x - lineStart.x;
    const D = point.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = A * A + B * B;

    if (lenSq === 0) return Math.sqrt(C * C + D * D);

    const param = dot / lenSq;

    let xx, yy;
    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * A;
      yy = lineStart.y + param * B;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private isCardSized(
    contour: Array<{ x: number; y: number }>,
    imageWidth: number,
    imageHeight: number,
  ): boolean {
    const bounds = this.getBounds(contour);
    const area = bounds.width * bounds.height;
    const imageArea = imageWidth * imageHeight;
    const relativeArea = area / imageArea;

    return relativeArea > 0.05 && relativeArea < 0.5;
  }

  private getBounds(contour: Array<{ x: number; y: number }>): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const xs = contour.map(p => p.x);
    const ys = contour.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  correctPerspective(
    imageData: ImageData,
    corners: Array<{ x: number; y: number }>,
  ): ImageData {
    if (corners.length !== 4) return imageData;

    const sortedCorners = this.sortCorners(corners);
    const cardWidth = 200;
    const cardHeight = 300;

    const correctedData = new Uint8ClampedArray(cardWidth * cardHeight * 4);
    const transform = this.getPerspectiveTransform(sortedCorners, [
      { x: 0, y: 0 },
      { x: cardWidth, y: 0 },
      { x: cardWidth, y: cardHeight },
      { x: 0, y: cardHeight },
    ]);

    for (let y = 0; y < cardHeight; y++) {
      for (let x = 0; x < cardWidth; x++) {
        const srcPoint = this.applyTransform(transform, { x, y });
        const srcX = Math.round(srcPoint.x);
        const srcY = Math.round(srcPoint.y);

        if (
          srcX >= 0 &&
          srcX < imageData.width &&
          srcY >= 0 &&
          srcY < imageData.height
        ) {
          const srcIdx = (srcY * imageData.width + srcX) * 4;
          const dstIdx = (y * cardWidth + x) * 4;

          correctedData[dstIdx] = imageData.data[srcIdx];
          correctedData[dstIdx + 1] = imageData.data[srcIdx + 1];
          correctedData[dstIdx + 2] = imageData.data[srcIdx + 2];
          correctedData[dstIdx + 3] = 255;
        }
      }
    }

    return {
      data: correctedData,
      width: cardWidth,
      height: cardHeight,
    };
  }

  private sortCorners(
    corners: Array<{ x: number; y: number }>,
  ): Array<{ x: number; y: number }> {
    const sorted = [...corners];
    sorted.sort((a, b) => a.y - b.y);

    const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
    const bottom = sorted.slice(2, 4).sort((a, b) => a.x - b.x);

    return [top[0], top[1], bottom[1], bottom[0]];
  }

  private getPerspectiveTransform(
    src: Array<{ x: number; y: number }>,
    dst: Array<{ x: number; y: number }>,
  ): number[][] {
    const A: number[][] = [];
    const B: number[] = [];

    for (let i = 0; i < 4; i++) {
      A.push([
        src[i].x,
        src[i].y,
        1,
        0,
        0,
        0,
        -dst[i].x * src[i].x,
        -dst[i].x * src[i].y,
      ]);
      A.push([
        0,
        0,
        0,
        src[i].x,
        src[i].y,
        1,
        -dst[i].y * src[i].x,
        -dst[i].y * src[i].y,
      ]);
      B.push(dst[i].x);
      B.push(dst[i].y);
    }

    const h = this.solveLinearSystem(A, B);
    return [
      [h[0], h[1], h[2]],
      [h[3], h[4], h[5]],
      [h[6], h[7], 1],
    ];
  }

  private solveLinearSystem(A: number[][], B: number[]): number[] {
    const n = A.length;
    const result = new Array(8).fill(0);

    for (let i = 0; i < Math.min(n, 8); i++) {
      result[i] = i < B.length ? B[i] / (A[i][i] || 1) : 0;
    }

    return result;
  }

  private applyTransform(
    transform: number[][],
    point: { x: number; y: number },
  ): { x: number; y: number } {
    const [h] = transform;
    const x = point.x;
    const y = point.y;
    const w = h[6] * x + h[7] * y + 1;

    return {
      x: (h[0] * x + h[1] * y + h[2]) / w,
      y: (h[3] * x + h[4] * y + h[5]) / w,
    };
  }

  classifyAttributes(cardImage: ImageData): {
    number: 0 | 1 | 2;
    shape: 0 | 1 | 2;
    color: 0 | 1 | 2;
    fill: 0 | 1 | 2;
  } {
    const number = this.classifyNumber(cardImage);
    const shape = this.classifyShape(cardImage);
    const color = this.classifyColor(cardImage);
    const fill = this.classifyFill(cardImage);

    return { number, shape, color, fill };
  }

  private classifyNumber(cardImage: ImageData): 0 | 1 | 2 {
    const components = this.findConnectedComponents(cardImage);
    if (components.length <= 1) return 0;
    if (components.length <= 2) return 1;
    return 2;
  }

  private classifyShape(cardImage: ImageData): 0 | 1 | 2 {
    return Math.floor(Math.random() * 3) as 0 | 1 | 2;
  }

  private classifyColor(cardImage: ImageData): 0 | 1 | 2 {
    const { data } = cardImage;
    let redSum = 0,
      greenSum = 0,
      blueSum = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      redSum += data[i];
      greenSum += data[i + 1];
      blueSum += data[i + 2];
    }

    const avgRed = redSum / pixelCount;
    const avgGreen = greenSum / pixelCount;
    const avgBlue = blueSum / pixelCount;

    if (avgRed > avgGreen && avgRed > avgBlue) return 0;
    if (avgGreen > avgRed && avgGreen > avgBlue) return 1;
    return 2;
  }

  private classifyFill(cardImage: ImageData): 0 | 1 | 2 {
    return Math.floor(Math.random() * 3) as 0 | 1 | 2;
  }

  private findConnectedComponents(
    imageData: ImageData,
  ): Array<{ x: number; y: number }[]> {
    const { data, width, height } = imageData;
    const binary = new Array(width * height).fill(false);
    const visited = new Array(width * height).fill(false);
    const components: Array<{ x: number; y: number }[]> = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      binary[i / 4] = brightness < 128;
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (binary[idx] && !visited[idx]) {
          const component = this.floodFill(
            binary,
            visited,
            x,
            y,
            width,
            height,
          );
          if (component.length > 50) {
            components.push(component);
          }
        }
      }
    }

    return components;
  }

  private floodFill(
    binary: boolean[],
    visited: boolean[],
    startX: number,
    startY: number,
    width: number,
    height: number,
  ): Array<{ x: number; y: number }> {
    const component: Array<{ x: number; y: number }> = [];
    const stack: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const idx = y * width + x;

      if (
        x < 0 ||
        x >= width ||
        y < 0 ||
        y >= height ||
        visited[idx] ||
        !binary[idx]
      ) {
        continue;
      }

      visited[idx] = true;
      component.push({ x, y });

      stack.push({ x: x + 1, y });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y + 1 });
      stack.push({ x, y: y - 1 });
    }

    return component;
  }

  encodeCard(attributes: {
    number: 0 | 1 | 2;
    shape: 0 | 1 | 2;
    color: 0 | 1 | 2;
    fill: 0 | 1 | 2;
  }): number {
    return (
      (attributes.fill << 6) |
      (attributes.color << 4) |
      (attributes.number << 2) |
      attributes.shape
    );
  }
}
