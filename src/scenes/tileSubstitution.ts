const enum EdgeDirection {
    top,
    bottom,
    left,
    right
}

const enum CornerDirection {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,

    innerTopLeft,
    innerTopRight,
    innerBottomLeft,
    innerBottomRight
}

export default {
    animated: {
        124: { frames: [124, 125, 126, 164, 165, 166], speed: 3 } // Water ripples
    },
    corner: {
        1: [
            { // Grass -> Water
                condition: 284,

                topLeft: 363,
                topRight: 364,
                bottomLeft: 403,
                bottomRight: 404,

                innerTopLeft: 243,
                innerTopRight: 245,
                innerBottomLeft: 323,
                innerBottomRight: 325
            }
        ]
    },
    edge: {
        1: [
            { // Grass -> Water
                condition: 284,
                top: 324,
                bottom: 244,
                left: 285,
                right: 283
            }
        ]
    }
} as {
    animated: { [key: number]: { frames: number[], speed: number } },
    corner: { [key: number]: ({ condition: number } & { [key in keyof typeof CornerDirection]: number })[] }
    edge: { [key: number]: ({ condition: number } & { [key in keyof typeof EdgeDirection]: number })[] }
};