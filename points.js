// /** @type {typeof import("gl-matrix")} */

// const glm = glMatrix;

// const { mat4, mat3, vec4, vec3, vec2 } = glm;

class Points {

    points3D = [
        2, 1, -3,
        1, 2, -5
    ];

    points3DInsideViewVolume = [true, true];

    pointsNDC = [0.17, 0.11, 0.48, 0.05, 0.13, 0.78];

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

            // TODO:
            // 1. Represent this point in homogeneous coordinates.
            // 2. Apply projMat to obtain clip coordinates.
            // 3. Perform the perspective division to obtain NDC.
            // 4. Append a Boolean to points3DInsideViewVolume indicating
            //    whether all three NDC coordinates are within [-1, 1].
            // 5. Append the NDC x, y, and z coordinates to pointsNDC,
            //    regardless of whether the point is visible.
        }
    }

    numPoints() {
        return this.points3D.length / 3;
    }
}