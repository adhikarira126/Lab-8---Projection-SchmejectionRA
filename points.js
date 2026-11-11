// /** @type {typeof import("gl-matrix")} */

// const glm = glMatrix;

// const { mat4, mat3, vec4, vec3, vec2 } = glm;

class Points {

    // the two points the page starts with (and returns to on Reset)
    static INITIAL_POINTS = [
        2, 1, -3,
        1, 2, -5
    ];

    points3D = [...Points.INITIAL_POINTS];

    // both of these are calculated from points3D by recalculatePointsNDC()
    points3DInsideViewVolume = [];
    pointsNDC = [];

    /** Throws away any added points and goes back to the starting points. */
    reset() {
        this.points3D = [...Points.INITIAL_POINTS];
    }

    render(projMat) {

        this.recalculatePointsNDC(projMat); // in case points have been added to points3D

        const aPositionLocation = gl.getAttribLocation(program, 'aPosition');
        const vertexBuffer = gl.createBuffer();       // one buffer for the vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pointsNDC), gl.STATIC_DRAW); // fill the buffer

        gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 3 * 4, 0); // how to read vertex data 
        gl.enableVertexAttribArray(aPositionLocation); // enable the bound array as the source for aPositionLocation


        gl.drawArrays(gl.POINTS, 0, this.pointsNDC.length / 3);

    }

    // called by render() 
    recalculatePointsNDC(projMat) {
        this.pointsNDC = [];
        this.points3DInsideViewVolume = [];

        for (let j = 0; j < this.points3D.length; j += 3) {
            let x = this.points3D[j];
            let y = this.points3D[j + 1];
            let z = this.points3D[j + 2];

            // 1. homogeneous coordinates
            const point = vec4.fromValues(x, y, z, 1);

            // 2. clip coordinates = projMat * point
            const clip = vec4.transformMat4(vec4.create(), point, projMat);

            // 3. perspective division
            const w = clip[3];
            const xNDC = clip[0] / w;
            const yNDC = clip[1] / w;
            const zNDC = clip[2] / w;

            // 4. visible only if all three NDC coordinates are in [-1, 1]
            const inside =
                Math.abs(xNDC) <= 1 &&
                Math.abs(yNDC) <= 1 &&
                Math.abs(zNDC) <= 1;
            this.points3DInsideViewVolume.push(inside);

            // 5. always record the NDC coordinates
            this.pointsNDC.push(xNDC, yNDC, zNDC);
        }
    }

    numPoints() {
        return this.points3D.length / 3;
    }
}