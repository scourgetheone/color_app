
export function generateColors() {
    const colors = [];

    for (let r = 8; r <= 256; r += 8) {
        for (let g = 256; g > 0; g -= 8) {
            for (let b = 8; b <= 256; b += 8) {
                colors.push({r: r, g: g, b: b});
            }
        }
    }

    return colors;
}
