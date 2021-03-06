/* UTILITIES */
    
function getUint64(view) {
    var s = 0;
    var lo = view.getUint32(view.offset, true);
    var hi = view.getUint32(view.offset + 4, true);
    view.offset += 8;
    return ((hi * (1 << 32)) + lo);
}

function getUint32(view) {
    var s = view.getUint32(view.offset, true);
    view.offset += 4;
    return s;
}

function getUint16(view) {
    var s = view.getUint16(view.offset, true);
    view.offset += 2;
    return s;
}

function getFloat32(view) {
    var s = view.getFloat32(view.offset, true);
    view.offset += 4;
    return s;
}

/* MATRIX STUFF */

function vecMul(m, v, r) {
    var w = m[3]*v[0] + m[7]*v[1] + m[11]*v[2] + m[15];

    r[0] = (m[0]*v[0]  + m[4]*v[1]  + m[8 ]*v[2] + m[12 ])/w;
    r[1] = (m[1]*v[0]  + m[5]*v[1]  + m[9 ]*v[2] + m[13 ])/w;
    r[2] = (m[2]*v[0]  + m[6]*v[1]  + m[10]*v[2] + m[14])/w;
}


function matMul(a, b, r) {
    r[ 0] = a[0]*b[0] + a[4]*b[1] + a[8]*b[2] + a[12]*b[3];
    r[ 1] = a[1]*b[0] + a[5]*b[1] + a[9]*b[2] + a[13]*b[3];
    r[ 2] = a[2]*b[0] + a[6]*b[1] + a[10]*b[2] + a[14]*b[3];
    r[ 3] = a[3]*b[0] + a[7]*b[1] + a[11]*b[2] + a[15]*b[3];

    r[ 4] = a[0]*b[4] + a[4]*b[5] + a[8]*b[6] + a[12]*b[7];
    r[ 5] = a[1]*b[4] + a[5]*b[5] + a[9]*b[6] + a[13]*b[7];
    r[ 6] = a[2]*b[4] + a[6]*b[5] + a[10]*b[6] + a[14]*b[7];
    r[ 7] = a[3]*b[4] + a[7]*b[5] + a[11]*b[6] + a[15]*b[7];

    r[ 8] = a[0]*b[8] + a[4]*b[9] + a[8]*b[10] + a[12]*b[11];
    r[ 9] = a[1]*b[8] + a[5]*b[9] + a[9]*b[10] + a[13]*b[11];
    r[10] = a[2]*b[8] + a[6]*b[9] + a[10]*b[10] + a[14]*b[11];
    r[11] = a[3]*b[8] + a[7]*b[9] + a[11]*b[10] + a[15]*b[11];

    r[12] = a[0]*b[12] + a[4]*b[13] + a[8]*b[14] + a[12]*b[15];
    r[13] = a[1]*b[12] + a[5]*b[13] + a[9]*b[14] + a[13]*b[15];
    r[14] = a[2]*b[12] + a[6]*b[13] + a[10]*b[14] + a[14]*b[15];
    r[15] = a[3]*b[12] + a[7]*b[13] + a[11]*b[14] + a[15]*b[15];
}

function matInv(m, t) {
    var s = 1.0/(
        m[12]* m[9]*m[6]*m[3]-m[8]*m[13]*m[6]*m[3]-m[12]*m[5]*m[10]*m[3]+m[4]*m[13]*m[10]*m[3]+
        m[8]*m[5]*m[14]*m[3]-m[4]*m[9]*m[14]*m[3]-m[12]*m[9]*m[2]*m[7]+m[8]*m[13]*m[2]*m[7]+
        m[12]*m[1]*m[10]*m[7]-m[0]*m[13]*m[10]*m[7]-m[8]*m[1]*m[14]*m[7]+m[0]*m[9]*m[14]*m[7]+
        m[12]*m[5]*m[2]*m[11]-m[4]*m[13]*m[2]*m[11]-m[12]*m[1]*m[6]*m[11]+m[0]*m[13]*m[6]*m[11]+
        m[4]*m[1]*m[14]*m[11]-m[0]*m[5]*m[14]*m[11]-m[8]*m[5]*m[2]*m[15]+m[4]*m[9]*m[2]*m[15]+
        m[8]*m[1]*m[6]*m[15]-m[0]*m[9]*m[6]*m[15]-m[4]*m[1]*m[10]*m[15]+m[0]*m[5]*m[10]*m[15]
    );

    t[ 0] = (m[9]*m[14]*m[7]-m[13]*m[10]*m[7]+m[13]*m[6]*m[11]-m[5]*m[14]*m[11]-m[9]*m[6]*m[15]+m[5]*m[10]*m[15])*s;
    t[ 1] = (m[13]*m[10]*m[3]-m[9]*m[14]*m[3]-m[13]*m[2]*m[11]+m[1]*m[14]*m[11]+m[9]*m[2]*m[15]-m[1]*m[10]*m[15])*s;
    t[ 2] = (m[5]*m[14]*m[3]-m[13]*m[6]*m[3]+m[13]*m[2]*m[7]-m[1]*m[14]*m[7]-m[5]*m[2]*m[15]+m[1]*m[6]*m[15])*s;
    t[ 3] = (m[9]*m[6]*m[3]-m[5]*m[10]*m[3]-m[9]*m[2]*m[7]+m[1]*m[10]*m[7]+m[5]*m[2]*m[11]-m[1]*m[6]*m[11])*s;

    t[ 4] = (m[12]*m[10]*m[7]-m[8]*m[14]*m[7]-m[12]*m[6]*m[11]+m[4]*m[14]*m[11]+m[8]*m[6]*m[15]-m[4]*m[10]*m[15])*s;
    t[ 5] = (m[8]*m[14]*m[3]-m[12]*m[10]*m[3]+m[12]*m[2]*m[11]-m[0]*m[14]*m[11]-m[8]*m[2]*m[15]+m[0]*m[10]*m[15])*s;
    t[ 6] = (m[12]*m[6]*m[3]-m[4]*m[14]*m[3]-m[12]*m[2]*m[7]+m[0]*m[14]*m[7]+m[4]*m[2]*m[15]-m[0]*m[6]*m[15])*s;
    t[ 7] = (m[4]*m[10]*m[3]-m[8]*m[6]*m[3]+m[8]*m[2]*m[7]-m[0]*m[10]*m[7]-m[4]*m[2]*m[11]+m[0]*m[6]*m[11])*s;

    t[ 8] = (m[8]*m[13]*m[7]-m[12]*m[9]*m[7]+m[12]*m[5]*m[11]-m[4]*m[13]*m[11]-m[8]*m[5]*m[15]+m[4]*m[9]*m[15])*s;
    t[ 9] = (m[12]*m[9]*m[3]-m[8]*m[13]*m[3]-m[12]*m[1]*m[11]+m[0]*m[13]*m[11]+m[8]*m[1]*m[15]-m[0]*m[9]*m[15])*s;
    t[10] = (m[4]*m[13]*m[3]-m[12]*m[5]*m[3]+m[12]*m[1]*m[7]-m[0]*m[13]*m[7]-m[4]*m[1]*m[15]+m[0]*m[5]*m[15])*s;
    t[11] = (m[8]*m[5]*m[3]-m[4]*m[9]*m[3]-m[8]*m[1]*m[7]+m[0]*m[9]*m[7]+m[4]*m[1]*m[11]-m[0]*m[5]*m[11])*s;

    t[12] = (m[12]*m[9]*m[6]-m[8]*m[13]*m[6]-m[12]*m[5]*m[10]+m[4]*m[13]*m[10]+m[8]*m[5]*m[14]-m[4]*m[9]*m[14])*s;
    t[13] = (m[8]*m[13]*m[2]-m[12]*m[9]*m[2]+m[12]*m[1]*m[10]-m[0]*m[13]*m[10]-m[8]*m[1]*m[14]+m[0]*m[9]*m[14])*s;
    t[14] = (m[12]*m[5]*m[2]-m[4]*m[13]*m[2]-m[12]*m[1]*m[6]+m[0]*m[13]*m[6]+m[4]*m[1]*m[14]-m[0]*m[5]*m[14])*s;
    t[15] = (m[4]*m[9]*m[2]-m[8]*m[5]*m[2]+m[8]*m[1]*m[6]-m[0]*m[9]*m[6]-m[4]*m[1]*m[10]+m[0]*m[5]*m[10])*s;
}

let binary = { 
    getUint64: getUint64,
    getUint32: getUint32,
    getUint16: getUint16,
    getFloat32: getFloat32,
    vecMul: vecMul,
    matMul: matMul,
    matInv: matInv
}

export { getUint64, getUint32, getUint16, getFloat32, vecMul, matMul, matInv }

