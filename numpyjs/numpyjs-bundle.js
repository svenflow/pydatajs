var $e = Object.defineProperty;
var oe = (v, e) => () => (v && (e = v((v = 0))), e);
var fe = (v, e) => {
  for (var a in e) $e(v, a, { get: e[a], enumerable: !0 });
};
function Be(v) {
  switch (v) {
    case 'float64':
      return Float64Array;
    case 'float32':
      return Float32Array;
    case 'int32':
      return Int32Array;
    case 'int16':
      return Int16Array;
    case 'int8':
      return Int8Array;
    case 'uint8':
    case 'bool':
      return Uint8Array;
  }
}
function H(v, e) {
  return new (Be(v))(e);
}
function $(v, e) {
  return new (Be(v))(e);
}
function ye(v, e) {
  if (v === e) return v;
  if (v === 'float64' || e === 'float64') return 'float64';
  if (v === 'float32' || e === 'float32') return 'float32';
  let a = { bool: 0, int8: 1, uint8: 1, int16: 2, int32: 3 };
  return (a[v] || 0) >= (a[e] || 0) ? v : e;
}
var re,
  be = oe(() => {
    'use strict';
    re = 'float64';
  });
function se(v) {
  if (!Number.isFinite(v)) return v;
  let e = Math.floor(v),
    a = v - e;
  return Math.abs(2 * a - 1) === 0 ? (e % 2 === 0 ? e : e + 1) : Math.round(v);
}
function Ze(v) {
  if (!Array.isArray(v)) return { flat: [v], shape: [] };
  if (v.length === 0) return { flat: [], shape: [0] };
  if (!Array.isArray(v[0])) return { flat: v, shape: [v.length] };
  let e = [],
    a = v;
  for (; Array.isArray(a); ) (e.push(a.length), (a = a[0]));
  function t(r) {
    return Array.isArray(r) ? r.reduce((c, o) => c.concat(t(o)), []) : [r];
  }
  return { flat: t(v), shape: e };
}
var Y,
  ae,
  de = oe(() => {
    'use strict';
    be();
    ((Y = class v {
      data;
      shape;
      dtype;
      constructor(e, a, t = 'float64') {
        ((this.dtype = t),
          Array.isArray(e) ? (this.data = $(t, e)) : (this.data = e),
          (this.shape = a));
      }
      toArray() {
        return Array.from(this.data);
      }
      get ndim() {
        return this.shape.length;
      }
      get size() {
        return this.shape.reduce((e, a) => e * a, 1);
      }
      get T() {
        let e = this.shape.length;
        if (e <= 1) return this;
        let a = [...Array(e).keys()].reverse(),
          t = a.map(n => this.shape[n]),
          r = this.data.length,
          c = new Float64Array(r),
          o = new Array(e);
        o[e - 1] = 1;
        for (let n = e - 2; n >= 0; n--) o[n] = o[n + 1] * this.shape[n + 1];
        let s = new Array(e);
        s[e - 1] = 1;
        for (let n = e - 2; n >= 0; n--) s[n] = s[n + 1] * t[n + 1];
        for (let n = 0; n < r; n++) {
          let i = n,
            u = 0;
          for (let l = 0; l < e; l++) {
            let f = Math.floor(i / s[l]);
            ((i -= f * s[l]), (u += f * o[a[l]]));
          }
          c[n] = this.data[u];
        }
        return new v(c, t, this.dtype);
      }
      item() {
        if (this.data.length !== 1)
          throw new Error('can only convert an array of size 1 to a scalar');
        return this.data[0];
      }
    }),
      (ae = class v {
        pi = Math.PI;
        e = Math.E;
        inf = 1 / 0;
        nan = NaN;
        newaxis = null;
        _shapeSize(e) {
          return e.reduce((a, t) => a * t, 1);
        }
        _createCpuArray(e, a, t) {
          let r = t || 'float64',
            c = e instanceof Float64Array ? e : Array.isArray(e) ? new Float64Array(e) : e;
          return new Y(c, a, r);
        }
        _toCpu(e) {
          return e instanceof Y ? e : new Y(Float64Array.from(e.data), [...e.shape], e.dtype);
        }
        zeros(e, a = 'float64') {
          let t = e.reduce((r, c) => r * c, 1);
          return this.createArray(H(a, t), e, a);
        }
        ones(e, a = 'float64') {
          let t = e.reduce((c, o) => c * o, 1),
            r = H(a, t);
          for (let c = 0; c < t; c++) r[c] = 1;
          return this.createArray(r, e, a);
        }
        full(e, a, t = 'float64') {
          let r = e.reduce((o, s) => o * s, 1),
            c = H(t, r);
          for (let o = 0; o < r; o++) c[o] = a;
          return this.createArray(c, e, t);
        }
        arange(e, a, t, r = 'float64') {
          let c, o, s;
          if (
            (a === void 0
              ? ((c = 0), (o = e), (s = 1))
              : t === void 0
                ? ((c = e), (o = a), (s = 1))
                : ((c = e), (o = a), (s = t)),
            s === 0)
          )
            throw new Error('step cannot be zero');
          let n = [];
          if (s > 0) for (let i = c; i < o; i += s) n.push(i);
          else for (let i = c; i > o; i += s) n.push(i);
          return this.createArray($(r, n), [n.length], r);
        }
        linspace(e, a, t, r, c = 'float64') {
          if ((typeof r == 'string' && ((c = r), (r = !0)), r === void 0 && (r = !0), t === 0))
            return this.createArray(H(c, 0), [0], c);
          if (t === 1) return this.createArray($(c, [e]), [1], c);
          let o = r ? (a - e) / (t - 1) : (a - e) / t,
            s = [];
          for (let n = 0; n < t; n++) s.push(e + n * o);
          return this.createArray($(c, s), [t], c);
        }
        eye(e, a, t = 0, r = 'float64') {
          let c;
          typeof a == 'string' ? ((r = a), (c = e)) : (c = a ?? e);
          let o = H(r, e * c);
          for (let s = 0; s < e; s++) {
            let n = s + t;
            n >= 0 && n < c && (o[s * c + n] = 1);
          }
          return this.createArray(o, [e, c], r);
        }
        diag(e, a = 0) {
          if (e.shape.length === 1) {
            let t = e.shape[0] + Math.abs(a),
              r = new Float64Array(t * t);
            for (let c = 0; c < e.shape[0]; c++) {
              let o = a >= 0 ? c : c - a,
                s = a >= 0 ? c + a : c;
              r[o * t + s] = e.data[c];
            }
            return this.createArray(r, [t, t]);
          } else if (e.shape.length === 2) {
            let [t, r] = e.shape,
              c = a >= 0 ? 0 : -a,
              o = a >= 0 ? a : 0,
              s = Math.min(t - c, r - o),
              n = [];
            for (let i = 0; i < s; i++) n.push(e.data[(c + i) * r + (o + i)]);
            return this.createArray(n, [n.length]);
          }
          throw new Error('diag requires 1D or 2D array');
        }
        array(e, a, t = 'float64') {
          let r, c;
          if (Array.isArray(e) && e.length > 0 && Array.isArray(e[0])) {
            let o = Ze(e);
            ((r = o.flat), (c = a || o.shape));
          } else ((r = e), (c = a || [r.length]));
          return this.createArray($(t, r), c, t);
        }
        asarray(e, a) {
          if (typeof e == 'number') {
            let t = a || re;
            return this.createArray($(t, [e]), [], t);
          }
          if (Array.isArray(e)) {
            let t = a || re;
            return this.createArray($(t, e), [e.length], t);
          }
          return a && e.dtype !== a ? this.astype(e, a) : e;
        }
        fromfunction(e, a, t = 'float64') {
          let r = a.reduce((s, n) => s * n, 1),
            c = H(t, r),
            o = new Array(a.length);
          o[a.length - 1] = 1;
          for (let s = a.length - 2; s >= 0; s--) o[s] = o[s + 1] * a[s + 1];
          for (let s = 0; s < r; s++) {
            let n = [],
              i = s;
            for (let u = 0; u < a.length; u++) (n.push(Math.floor(i / o[u])), (i = i % o[u]));
            c[s] = e(...n);
          }
          return this.createArray(c, [...a], t);
        }
        fromiter(e, a, t = 'float64') {
          let r = [],
            c = 0;
          for (let o of e) if ((r.push(o), c++, a !== void 0 && c >= a)) break;
          return this.createArray($(t, r), [r.length], t);
        }
        real(e) {
          return this.createArray(new Float64Array(e.data), [...e.shape]);
        }
        imag(e) {
          return this.createArray(new Float64Array(e.data.length), [...e.shape]);
        }
        conj(e) {
          return this.createArray(new Float64Array(e.data), [...e.shape]);
        }
        astype(e, a) {
          let t = $(a, Array.from(e.data));
          return this.createArray(t, [...e.shape], a);
        }
        sin(e) {
          return this.createArray(Float64Array.from(e.data, Math.sin), e.shape);
        }
        cos(e) {
          return this.createArray(Float64Array.from(e.data, Math.cos), e.shape);
        }
        tan(e) {
          return this.createArray(Float64Array.from(e.data, Math.tan), e.shape);
        }
        arcsin(e) {
          return this.createArray(Float64Array.from(e.data, Math.asin), e.shape);
        }
        arccos(e) {
          return this.createArray(Float64Array.from(e.data, Math.acos), e.shape);
        }
        arctan(e) {
          return this.createArray(Float64Array.from(e.data, Math.atan), e.shape);
        }
        sinh(e) {
          return this.createArray(Float64Array.from(e.data, Math.sinh), e.shape);
        }
        cosh(e) {
          return this.createArray(Float64Array.from(e.data, Math.cosh), e.shape);
        }
        tanh(e) {
          return this.createArray(Float64Array.from(e.data, Math.tanh), e.shape);
        }
        exp(e) {
          return this.createArray(Float64Array.from(e.data, Math.exp), e.shape);
        }
        log(e) {
          return this.createArray(Float64Array.from(e.data, Math.log), e.shape);
        }
        log2(e) {
          return this.createArray(Float64Array.from(e.data, Math.log2), e.shape);
        }
        log10(e) {
          return this.createArray(Float64Array.from(e.data, Math.log10), e.shape);
        }
        sqrt(e) {
          return this.createArray(Float64Array.from(e.data, Math.sqrt), e.shape);
        }
        cbrt(e) {
          return this.createArray(Float64Array.from(e.data, Math.cbrt), e.shape);
        }
        abs(e) {
          return this.createArray(Float64Array.from(e.data, Math.abs), e.shape);
        }
        absolute(e) {
          return this.abs(e);
        }
        sign(e) {
          return this.createArray(Float64Array.from(e.data, Math.sign), e.shape);
        }
        floor(e) {
          return this.createArray(Float64Array.from(e.data, Math.floor), e.shape);
        }
        ceil(e) {
          return this.createArray(Float64Array.from(e.data, Math.ceil), e.shape);
        }
        round(e, a = 0) {
          if (a === 0) return this.createArray(Float64Array.from(e.data, se), e.shape);
          let t = Math.pow(10, a),
            r = new Float64Array(e.data.length);
          for (let c = 0; c < r.length; c++) r[c] = se(e.data[c] * t) / t;
          return this.createArray(r, [...e.shape]);
        }
        negative(e) {
          return this.createArray(
            Float64Array.from(e.data, a => -a),
            e.shape
          );
        }
        neg(e) {
          return this.negative(e);
        }
        reciprocal(e) {
          return this.createArray(
            Float64Array.from(e.data, a => 1 / a),
            e.shape
          );
        }
        square(e) {
          return this.createArray(
            Float64Array.from(e.data, a => a * a),
            e.shape
          );
        }
        arcsinh(e) {
          return this.createArray(
            Float64Array.from(e.data, a => Math.asinh(a)),
            e.shape
          );
        }
        arccosh(e) {
          return this.createArray(
            Float64Array.from(e.data, a => Math.acosh(a)),
            e.shape
          );
        }
        arctanh(e) {
          return this.createArray(
            Float64Array.from(e.data, a => Math.atanh(a)),
            e.shape
          );
        }
        expm1(e) {
          return this.createArray(
            Float64Array.from(e.data, a => Math.expm1(a)),
            e.shape
          );
        }
        log1p(e) {
          return this.createArray(
            Float64Array.from(e.data, a => Math.log1p(a)),
            e.shape
          );
        }
        trunc(e) {
          return this.createArray(
            Float64Array.from(e.data, a => Math.trunc(a)),
            e.shape
          );
        }
        sinc(e) {
          return this.createArray(
            Float64Array.from(e.data, a => {
              if (a === 0) return 1;
              let t = Math.PI * a;
              return Math.sin(t) / t;
            }),
            e.shape
          );
        }
        deg2rad(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (a * Math.PI) / 180),
            e.shape
          );
        }
        rad2deg(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (a * 180) / Math.PI),
            e.shape
          );
        }
        heaviside(e, a) {
          return this.createArray(
            Float64Array.from(e.data, t => (t < 0 ? 0 : t === 0 ? a : 1)),
            e.shape
          );
        }
        fix(e) {
          return this.trunc(e);
        }
        signbit(e) {
          return this.createArray(
            Float64Array.from(e.data, a =>
              Number.isNaN(a) ? 0 : Object.is(a, -0) || a < 0 ? 1 : 0
            ),
            e.shape
          );
        }
        modf(e) {
          let a = new Float64Array(e.data.length),
            t = new Float64Array(e.data.length);
          for (let r = 0; r < e.data.length; r++) {
            let c = e.data[r];
            ((t[r] = Math.trunc(c)), (a[r] = c - t[r]));
          }
          return { frac: this.createArray(a, e.shape), integ: this.createArray(t, e.shape) };
        }
        frexp(e) {
          let a = new Float64Array(e.data.length),
            t = new Float64Array(e.data.length);
          for (let r = 0; r < e.data.length; r++) {
            let c = e.data[r];
            if (c === 0 || !Number.isFinite(c) || Number.isNaN(c)) ((a[r] = c), (t[r] = 0));
            else {
              let o = Math.floor(Math.log2(Math.abs(c))) + 1;
              ((a[r] = c / Math.pow(2, o)), (t[r] = o));
            }
          }
          return { mantissa: this.createArray(a, e.shape), exponent: this.createArray(t, e.shape) };
        }
        ldexp(e, a) {
          this._checkSameShape(e, a);
          let t = new Float64Array(e.data.length);
          for (let r = 0; r < e.data.length; r++) t[r] = e.data[r] * Math.pow(2, a.data[r]);
          return this.createArray(t, e.shape);
        }
        divmod(e, a) {
          let t = this._toNDArray(e),
            r = this._toNDArray(a),
            c,
            o;
          t.data.length === 1 && r.data.length > 1
            ? ((c = r.data.length), (o = [...r.shape]))
            : r.data.length === 1 && t.data.length > 1
              ? ((c = t.data.length), (o = [...t.shape]))
              : (this._checkSameShape(t, r), (c = t.data.length), (o = [...t.shape]));
          let s = new Float64Array(c),
            n = new Float64Array(c);
          for (let i = 0; i < c; i++) {
            let u = t.data.length === 1 ? t.data[0] : t.data[i],
              l = r.data.length === 1 ? r.data[0] : r.data[i];
            s[i] = Math.floor(u / l);
            let f = u % l;
            n[i] = f !== 0 && Math.sign(f) !== Math.sign(l) ? f + l : f;
          }
          return { quotient: this.createArray(s, o), remainder: this.createArray(n, o) };
        }
        mod(e, a) {
          return this._binaryOp(e, a, (t, r) => {
            let c = t % r;
            return c !== 0 && Math.sign(c) !== Math.sign(r) ? c + r : c;
          });
        }
        fmod(e, a) {
          return this._binaryOp(e, a, (t, r) => t % r);
        }
        remainder(e, a) {
          return this.mod(e, a);
        }
        copysign(e, a) {
          return this._binaryOp(e, a, (t, r) => {
            let c = Math.abs(t);
            return r < 0 || Object.is(r, -0) ? -c : c;
          });
        }
        hypot(e, a) {
          return this._binaryOp(e, a, (t, r) => Math.hypot(t, r));
        }
        arctan2(e, a) {
          return this._binaryOp(e, a, (t, r) => Math.atan2(t, r));
        }
        logaddexp(e, a) {
          return this._binaryOp(e, a, (t, r) => {
            let c = Math.max(t, r);
            return c === -1 / 0 ? -1 / 0 : c + Math.log(Math.exp(t - c) + Math.exp(r - c));
          });
        }
        logaddexp2(e, a) {
          let t = Math.log(2);
          return this._binaryOp(e, a, (r, c) => {
            let o = Math.max(r, c);
            return o === -1 / 0
              ? -1 / 0
              : o + Math.log(Math.pow(2, r - o) + Math.pow(2, c - o)) / t;
          });
        }
        fmax(e, a) {
          return this._binaryOp(e, a, (t, r) =>
            Number.isNaN(t) ? r : Number.isNaN(r) ? t : Math.max(t, r)
          );
        }
        fmin(e, a) {
          return this._binaryOp(e, a, (t, r) =>
            Number.isNaN(t) ? r : Number.isNaN(r) ? t : Math.min(t, r)
          );
        }
        equal(e, a) {
          return this._binaryOp(e, a, (t, r) => (t === r ? 1 : 0));
        }
        notEqual(e, a) {
          return this._binaryOp(e, a, (t, r) => (t !== r ? 1 : 0));
        }
        less(e, a) {
          return this._binaryOp(e, a, (t, r) => (t < r ? 1 : 0));
        }
        lessEqual(e, a) {
          return this._binaryOp(e, a, (t, r) => (t <= r ? 1 : 0));
        }
        greater(e, a) {
          return this._binaryOp(e, a, (t, r) => (t > r ? 1 : 0));
        }
        greaterEqual(e, a) {
          return this._binaryOp(e, a, (t, r) => (t >= r ? 1 : 0));
        }
        isnan(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (Number.isNaN(a) ? 1 : 0)),
            e.shape
          );
        }
        isinf(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (!Number.isFinite(a) && !Number.isNaN(a) ? 1 : 0)),
            e.shape
          );
        }
        isfinite(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (Number.isFinite(a) ? 1 : 0)),
            e.shape
          );
        }
        setdiff1d(e, a) {
          let t = new Set(a.data),
            r = Array.from(e.data).filter(o => !t.has(o)),
            c = [...new Set(r)].sort((o, s) => o - s);
          return this.createArray(new Float64Array(c), [c.length]);
        }
        union1d(e, a) {
          let r = [...new Set([...e.data, ...a.data])].sort((c, o) => c - o);
          return this.createArray(new Float64Array(r), [r.length]);
        }
        intersect1d(e, a) {
          let t = new Set(a.data),
            r = [...new Set(Array.from(e.data).filter(c => t.has(c)))].sort((c, o) => c - o);
          return this.createArray(new Float64Array(r), [r.length]);
        }
        isin(e, a) {
          let t = new Set(a.data);
          return this.createArray(
            Float64Array.from(e.data, r => (t.has(r) ? 1 : 0)),
            e.shape
          );
        }
        insert(e, a, t, r) {
          if (r === void 0) {
            let c = Array.from(this.flatten(e).data),
              o = typeof t == 'number' ? [t] : Array.from(t.data);
            return (
              a < 0 && (a = c.length + a + 1),
              c.splice(a, 0, ...o),
              this.createArray(new Float64Array(c), [c.length])
            );
          }
          throw new Error('insert with axis not yet implemented');
        }
        deleteArr(e, a, t) {
          if (t === void 0) {
            let r = Array.from(this.flatten(e).data),
              o = (Array.isArray(a) ? a : [a])
                .map(s => (s < 0 ? r.length + s : s))
                .sort((s, n) => n - s);
            for (let s of o) r.splice(s, 1);
            return this.createArray(new Float64Array(r), [r.length]);
          }
          throw new Error('delete with axis not yet implemented');
        }
        append(e, a, t) {
          if (t === void 0) {
            let r = this.flatten(e),
              c = this.flatten(a),
              o = new Float64Array(r.data.length + c.data.length);
            return (o.set(r.data), o.set(c.data, r.data.length), this.createArray(o, [o.length]));
          }
          return this.concatenate([e, a], t);
        }
        atleast1d(e) {
          return e.shape.length === 0 ? this.createArray(e.data, [1]) : e;
        }
        atleast2d(e) {
          return e.shape.length === 0
            ? this.createArray(e.data, [1, 1])
            : e.shape.length === 1
              ? this.createArray(e.data, [1, e.shape[0]])
              : e;
        }
        atleast3d(e) {
          return e.shape.length === 0
            ? this.createArray(e.data, [1, 1, 1])
            : e.shape.length === 1
              ? this.createArray(e.data, [1, e.shape[0], 1])
              : e.shape.length === 2
                ? this.createArray(e.data, [e.shape[0], e.shape[1], 1])
                : e;
        }
        countNonzero(e, a, t) {
          if (a === void 0) {
            let f = 0;
            for (let h = 0; h < e.data.length; h++) e.data[h] !== 0 && f++;
            return f;
          }
          let r = a < 0 ? e.shape.length + a : a,
            c = e.shape.filter((f, h) => h !== r),
            o = c.reduce((f, h) => f * h, 1) || 1,
            s = new Float64Array(o),
            n = this._computeStrides(e.shape),
            i = c.length > 0 ? this._computeStrides(c) : [1],
            u = e.shape[r];
          for (let f = 0; f < o; f++) {
            let h = new Array(c.length),
              m = f;
            for (let g = 0; g < c.length; g++) ((h[g] = Math.floor(m / i[g])), (m = m % i[g]));
            let d = 0;
            for (let g = 0; g < u; g++) {
              let b = new Array(e.shape.length),
                p = 0;
              for (let A = 0; A < e.shape.length; A++) A === r ? (b[A] = g) : (b[A] = h[p++]);
              let _ = 0;
              for (let A = 0; A < e.shape.length; A++) _ += b[A] * n[A];
              e.data[_] !== 0 && d++;
            }
            s[f] = d;
          }
          let l = this.createArray(s, c);
          if (t) {
            let f = [...e.shape];
            return ((f[r] = 1), this.reshape(l, f));
          }
          return l;
        }
        matrixPower(e, a) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('matrixPower requires square 2D array');
          if (a === 0) return this.eye(e.shape[0]);
          a < 0 && ((e = this.inv(e)), (a = -a));
          let t = this.eye(e.shape[0]),
            r = e;
          for (; a > 0; )
            (a % 2 === 1 && (t = this.matmul(t, r)),
              (r = this.matmul(r, r)),
              (a = Math.floor(a / 2)));
          return t;
        }
        kron(e, a) {
          let t = e.shape.length === 1 ? this.reshape(e, [e.shape[0], 1]) : e,
            r = a.shape.length === 1 ? this.reshape(a, [a.shape[0], 1]) : a;
          if (t.shape.length !== 2 || r.shape.length !== 2)
            throw new Error('kron requires 1D or 2D arrays');
          let [c, o] = t.shape,
            [s, n] = r.shape,
            i = [c * s, o * n],
            u = new Float64Array(i[0] * i[1]);
          for (let l = 0; l < c; l++)
            for (let f = 0; f < o; f++) {
              let h = t.data[l * o + f];
              for (let m = 0; m < s; m++)
                for (let d = 0; d < n; d++) {
                  let g = l * s + m,
                    b = f * n + d;
                  u[g * i[1] + b] = h * r.data[m * n + d];
                }
            }
          return this.createArray(u, i);
        }
        cond(e, a = 2) {
          if (e.shape.length !== 2) throw new Error('cond requires a 2D matrix');
          if (a === 2 || a === -2) {
            let { s } = this.svd(e),
              n = s.data,
              i = Math.max(...n),
              u = Math.min(...n.filter(l => l > 0));
            return u === 0 || n.length === 0 ? 1 / 0 : a === 2 ? i / u : u / i;
          }
          if (a === 1 || a === 1 / 0 || a === -1 || a === -1 / 0 || a === 'fro') {
            let s = this.norm(e, a),
              n;
            try {
              n = this.inv(e);
            } catch {
              return 1 / 0;
            }
            let i = this.norm(n, a);
            return s * i;
          }
          let { s: t } = this.svd(e),
            r = t.data,
            c = Math.max(...r),
            o = Math.min(...r.filter(s => s > 0));
          return o === 0 || r.length === 0 ? 1 / 0 : c / o;
        }
        slogdet(e) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('slogdet requires a square 2D matrix');
          let a = this.det(e);
          return a === 0
            ? { sign: 0, logabsdet: -1 / 0 }
            : { sign: a > 0 ? 1 : -1, logabsdet: Math.log(Math.abs(a)) };
        }
        multiDot(e) {
          if (e.length === 0) throw new Error('multiDot requires at least one array');
          if (e.length === 1) return this.createArray(e[0].data.slice(), e[0].shape);
          let a = e[0];
          for (let t = 1; t < e.length; t++) a = this.matmul(a, e[t]);
          return a;
        }
        polyval(e, a) {
          let t = this.flatten(e).data;
          return this.createArray(
            Float64Array.from(a.data, r => {
              let c = 0;
              for (let o = 0; o < t.length; o++) c = c * r + t[o];
              return c;
            }),
            a.shape
          );
        }
        polyadd(e, a) {
          let t = Array.from(this.flatten(e).data),
            r = Array.from(this.flatten(a).data),
            c = Math.max(t.length, r.length),
            o = new Float64Array(c),
            s = new Array(c - t.length).fill(0).concat(t),
            n = new Array(c - r.length).fill(0).concat(r);
          for (let i = 0; i < c; i++) o[i] = s[i] + n[i];
          return this.createArray(o, [c]);
        }
        polymul(e, a) {
          let t = Array.from(this.flatten(e).data),
            r = Array.from(this.flatten(a).data),
            c = t.length + r.length - 1,
            o = new Float64Array(c);
          for (let s = 0; s < t.length; s++)
            for (let n = 0; n < r.length; n++) o[s + n] += t[s] * r[n];
          return this.createArray(o, [c]);
        }
        polyfit(e, a, t) {
          let r = this.flatten(e).data,
            c = this.flatten(a).data,
            o = r.length,
            s = t + 1,
            n = new Float64Array(o * s);
          for (let m = 0; m < o; m++)
            for (let d = 0; d < s; d++) n[m * s + d] = Math.pow(r[m], t - d);
          let i = new Float64Array(s * s),
            u = new Float64Array(s);
          for (let m = 0; m < s; m++) {
            for (let g = 0; g < s; g++) {
              let b = 0;
              for (let p = 0; p < o; p++) b += n[p * s + m] * n[p * s + g];
              i[m * s + g] = b;
            }
            let d = 0;
            for (let g = 0; g < o; g++) d += n[g * s + m] * c[g];
            u[m] = d;
          }
          let l = Array.from(i),
            f = Array.from(u);
          for (let m = 0; m < s; m++) {
            let d = Math.abs(l[m * s + m]),
              g = m;
            for (let b = m + 1; b < s; b++)
              Math.abs(l[b * s + m]) > d && ((d = Math.abs(l[b * s + m])), (g = b));
            if (g !== m) {
              for (let p = 0; p < s; p++) {
                let _ = l[m * s + p];
                ((l[m * s + p] = l[g * s + p]), (l[g * s + p] = _));
              }
              let b = f[m];
              ((f[m] = f[g]), (f[g] = b));
            }
            for (let b = m + 1; b < s; b++) {
              let p = l[b * s + m] / l[m * s + m];
              for (let _ = m; _ < s; _++) l[b * s + _] -= p * l[m * s + _];
              f[b] -= p * f[m];
            }
          }
          let h = new Float64Array(s);
          for (let m = s - 1; m >= 0; m--) {
            let d = f[m];
            for (let g = m + 1; g < s; g++) d -= l[m * s + g] * h[g];
            h[m] = d / l[m * s + m];
          }
          return this.createArray(h, [s]);
        }
        roots(e) {
          let a = Array.from(this.flatten(e).data);
          for (; a.length > 0 && a[0] === 0; ) a.shift();
          if (a.length === 0) return this.createArray(new Float64Array(0), [0]);
          if (a.length === 1) return this.createArray(new Float64Array(0), [0]);
          let t = a.length - 1,
            r = a[0];
          for (let l = 0; l < a.length; l++) a[l] /= r;
          let c = new Float64Array(t * t);
          for (let l = 1; l < t; l++) c[l * t + (l - 1)] = 1;
          for (let l = 0; l < t; l++) c[l * t + (t - 1)] = -a[t - l];
          let o = 100,
            s = 1e-10,
            n = [],
            i = Array.from(c),
            u = t;
          for (let l = 0; l < t && u !== 0; l++) {
            if (u === 1) {
              n.push(i[0]);
              break;
            }
            for (let f = 0; f < o; f++) {
              let h = Math.abs(i[(u - 1) * t + (u - 2)]),
                m = Math.abs(i[(u - 2) * t + (u - 2)]),
                d = Math.abs(i[(u - 1) * t + (u - 1)]);
              if (h < s * (m + d + s)) {
                (n.push(i[(u - 1) * t + (u - 1)]), u--);
                break;
              }
              let g = (i[(u - 2) * t + (u - 2)] - i[(u - 1) * t + (u - 1)]) / 2,
                b = i[(u - 1) * t + (u - 2)],
                p =
                  i[(u - 1) * t + (u - 1)] -
                  (b * b) / (g + Math.sign(g || 1) * Math.sqrt(g * g + b * b));
              for (let _ = 0; _ < u; _++) i[_ * t + _] -= p;
              for (let _ = 0; _ < u - 1; _++) {
                let A = i[_ * t + _],
                  w = i[(_ + 1) * t + _],
                  y = Math.sqrt(A * A + w * w);
                if (y < s) continue;
                let D = A / y,
                  C = w / y;
                for (let O = 0; O < u; O++) {
                  let M = i[_ * t + O],
                    E = i[(_ + 1) * t + O];
                  ((i[_ * t + O] = D * M + C * E), (i[(_ + 1) * t + O] = -C * M + D * E));
                }
                for (let O = 0; O < u; O++) {
                  let M = i[O * t + _],
                    E = i[O * t + (_ + 1)];
                  ((i[O * t + _] = D * M + C * E), (i[O * t + (_ + 1)] = -C * M + D * E));
                }
              }
              for (let _ = 0; _ < u; _++) i[_ * t + _] += p;
            }
            n.length === l && (n.push(i[(u - 1) * t + (u - 1)]), u--);
          }
          return (n.sort((l, f) => f - l), this.createArray(new Float64Array(n), [n.length]));
        }
        interp(e, a, t) {
          let r = this.flatten(a).data,
            c = this.flatten(t).data;
          return this.createArray(
            Float64Array.from(e.data, o => {
              if (o <= r[0]) return c[0];
              if (o >= r[r.length - 1]) return c[c.length - 1];
              let s = 0,
                n = r.length - 1;
              for (; n - s > 1; ) {
                let u = Math.floor((s + n) / 2);
                r[u] <= o ? (s = u) : (n = u);
              }
              let i = (o - r[s]) / (r[n] - r[s]);
              return c[s] + i * (c[n] - c[s]);
            }),
            e.shape
          );
        }
        bincount(e, a, t) {
          let r = this.flatten(e).data,
            c = a ? this.flatten(a).data : null,
            o = 0;
          for (let i = 0; i < r.length; i++) {
            let u = Math.floor(r[i]);
            if (u < 0) throw new Error('bincount requires non-negative integers');
            u > o && (o = u);
          }
          let s = Math.max(o + 1, t || 0),
            n = new Float64Array(s);
          for (let i = 0; i < r.length; i++) {
            let u = Math.floor(r[i]);
            n[u] += c ? c[i] : 1;
          }
          return this.createArray(n, [s]);
        }
        partition(e, a, t = -1) {
          let r = e.shape.length;
          if (((t = t < 0 ? t + r : t), t < 0 || t >= r))
            throw new Error(`axis ${t} is out of bounds for array of dimension ${r}`);
          let c = new Float64Array(e.data),
            o = this._computeStrides(e.shape),
            s = e.shape[t];
          if (a < 0 || a >= s) throw new Error(`kth(=${a}) out of bounds (${s})`);
          let n = e.shape.filter((l, f) => f !== t),
            i = n.length > 0 ? this._computeStrides(n) : [1],
            u = n.reduce((l, f) => l * f, 1) || 1;
          for (let l = 0; l < u; l++) {
            let f = new Array(n.length),
              h = l;
            for (let p = 0; p < n.length; p++) ((f[p] = Math.floor(h / i[p])), (h = h % i[p]));
            let m = new Array(r),
              d = 0;
            for (let p = 0; p < r; p++) p === t ? (m[p] = 0) : (m[p] = f[d++]);
            let g = [];
            for (let p = 0; p < s; p++) {
              let _ = [...m];
              _[t] = p;
              let A = 0;
              for (let w = 0; w < r; w++) A += _[w] * o[w];
              g.push({ value: e.data[A], idx: A });
            }
            ((p, _, A, w) => {
              for (; A < w; ) {
                let y = p[Math.floor((A + w) / 2)].value,
                  D = A,
                  C = w;
                for (; D <= C; ) {
                  for (; p[D].value < y; ) D++;
                  for (; p[C].value > y; ) C--;
                  if (D <= C) {
                    let O = p[D];
                    ((p[D] = p[C]), (p[C] = O), D++, C--);
                  }
                }
                if (_ <= C) w = C;
                else if (_ >= D) A = D;
                else break;
              }
            })(g, a, 0, s - 1);
            for (let p = 0; p < s; p++) {
              let _ = [...m];
              _[t] = p;
              let A = 0;
              for (let w = 0; w < r; w++) A += _[w] * o[w];
              c[A] = g[p].value;
            }
          }
          return this.createArray(c, e.shape);
        }
        argpartition(e, a, t = -1) {
          let r = e.shape.length;
          if (((t = t < 0 ? t + r : t), t < 0 || t >= r))
            throw new Error(`axis ${t} is out of bounds for array of dimension ${r}`);
          let c = new Float64Array(e.data.length),
            o = this._computeStrides(e.shape),
            s = e.shape[t];
          if (a < 0 || a >= s) throw new Error(`kth(=${a}) out of bounds (${s})`);
          let n = e.shape.filter((l, f) => f !== t),
            i = n.length > 0 ? this._computeStrides(n) : [1],
            u = n.reduce((l, f) => l * f, 1) || 1;
          for (let l = 0; l < u; l++) {
            let f = new Array(n.length),
              h = l;
            for (let p = 0; p < n.length; p++) ((f[p] = Math.floor(h / i[p])), (h = h % i[p]));
            let m = new Array(r),
              d = 0;
            for (let p = 0; p < r; p++) p === t ? (m[p] = 0) : (m[p] = f[d++]);
            let g = [];
            for (let p = 0; p < s; p++) {
              let _ = [...m];
              _[t] = p;
              let A = 0;
              for (let w = 0; w < r; w++) A += _[w] * o[w];
              g.push({ value: e.data[A], origIdx: p });
            }
            ((p, _, A, w) => {
              for (; A < w; ) {
                let y = p[Math.floor((A + w) / 2)].value,
                  D = A,
                  C = w;
                for (; D <= C; ) {
                  for (; p[D].value < y; ) D++;
                  for (; p[C].value > y; ) C--;
                  if (D <= C) {
                    let O = p[D];
                    ((p[D] = p[C]), (p[C] = O), D++, C--);
                  }
                }
                if (_ <= C) w = C;
                else if (_ >= D) A = D;
                else break;
              }
            })(g, a, 0, s - 1);
            for (let p = 0; p < s; p++) {
              let _ = [...m];
              _[t] = p;
              let A = 0;
              for (let w = 0; w < r; w++) A += _[w] * o[w];
              c[A] = g[p].origIdx;
            }
          }
          return this.createArray(c, e.shape);
        }
        lexsort(e) {
          if (e.length === 0) return this.createArray(new Float64Array(0), [0]);
          let a = e[0].data.length;
          for (let r of e)
            if (r.data.length !== a) throw new Error('all keys must have the same length');
          let t = Array.from({ length: a }, (r, c) => c);
          return (
            t.sort((r, c) => {
              for (let o = e.length - 1; o >= 0; o--) {
                let s = e[o].data[r],
                  n = e[o].data[c];
                if (s < n) return -1;
                if (s > n) return 1;
              }
              return 0;
            }),
            this.createArray(new Float64Array(t), [a])
          );
        }
        compress(e, a, t) {
          let r = this.flatten(e).data;
          if (t === void 0) {
            let m = this.flatten(a).data,
              d = [],
              g = Math.min(r.length, m.length);
            for (let b = 0; b < g; b++) r[b] !== 0 && d.push(m[b]);
            return this.createArray(new Float64Array(d), [d.length]);
          }
          let c = a.shape.length;
          if (((t = t < 0 ? t + c : t), t < 0 || t >= c))
            throw new Error(`axis ${t} is out of bounds`);
          let o = 0,
            s = a.shape[t];
          for (let m = 0; m < Math.min(r.length, s); m++) r[m] !== 0 && o++;
          let n = [...a.shape];
          n[t] = o;
          let i = n.reduce((m, d) => m * d, 1),
            u = new Float64Array(i),
            l = this._computeStrides(a.shape),
            f = this._computeStrides(n),
            h = [];
          for (let m = 0; m < Math.min(r.length, s); m++) r[m] !== 0 && h.push(m);
          for (let m = 0; m < i; m++) {
            let d = new Array(c),
              g = m;
            for (let p = 0; p < c; p++) ((d[p] = Math.floor(g / f[p])), (g = g % f[p]));
            d[t] = h[d[t]];
            let b = 0;
            for (let p = 0; p < c; p++) b += d[p] * l[p];
            u[m] = a.data[b];
          }
          return this.createArray(u, n);
        }
        extract(e, a) {
          let t = this.flatten(e).data,
            r = this.flatten(a).data,
            c = [],
            o = Math.min(t.length, r.length);
          for (let s = 0; s < o; s++) t[s] !== 0 && c.push(r[s]);
          return this.createArray(new Float64Array(c), [c.length]);
        }
        place(e, a, t) {
          let r = this.flatten(a).data,
            c = this.flatten(t).data,
            o = 0;
          for (let s = 0; s < e.data.length && s < r.length; s++)
            r[s] !== 0 && ((e.data[s] = c[o % c.length]), o++);
        }
        select(e, a, t = 0) {
          if (e.length !== a.length)
            throw new Error('condlist and choicelist must have same length');
          if (e.length === 0) throw new Error('condlist and choicelist must not be empty');
          let r = [...e, ...a],
            c = this.broadcastArrays(...r),
            o = c[0].shape,
            s = c[0].data.length,
            n = c.slice(0, e.length),
            i = c.slice(e.length),
            u = new Float64Array(s).fill(t),
            l = new Uint8Array(s);
          for (let f = 0; f < e.length; f++)
            for (let h = 0; h < s; h++)
              !l[h] && n[f].data[h] !== 0 && ((u[h] = i[f].data[h]), (l[h] = 1));
          return this.createArray(u, o);
        }
        add(e, a) {
          return this._binaryOp(e, a, (t, r) => t + r);
        }
        subtract(e, a) {
          return this._binaryOp(e, a, (t, r) => t - r);
        }
        sub(e, a) {
          return this.subtract(e, a);
        }
        multiply(e, a) {
          return this._binaryOp(e, a, (t, r) => t * r);
        }
        mul(e, a) {
          return this.multiply(e, a);
        }
        divide(e, a) {
          return this._binaryOp(e, a, (t, r) => t / r);
        }
        div(e, a) {
          return this.divide(e, a);
        }
        power(e, a) {
          return this._binaryOp(e, a, (t, r) => Math.pow(t, r));
        }
        pow(e, a) {
          return this.power(e, a);
        }
        floorDivide(e, a) {
          return this._binaryOp(e, a, (t, r) => Math.floor(t / r));
        }
        maximum(e, a) {
          return this._binaryOp(e, a, (t, r) => Math.max(t, r));
        }
        minimum(e, a) {
          return this._binaryOp(e, a, (t, r) => Math.min(t, r));
        }
        addScalar(e, a) {
          return this.createArray(
            Float64Array.from(e.data, t => t + a),
            e.shape
          );
        }
        subScalar(e, a) {
          return this.createArray(
            Float64Array.from(e.data, t => t - a),
            e.shape
          );
        }
        mulScalar(e, a) {
          return this.createArray(
            Float64Array.from(e.data, t => t * a),
            e.shape
          );
        }
        divScalar(e, a) {
          return this.createArray(
            Float64Array.from(e.data, t => t / a),
            e.shape
          );
        }
        powScalar(e, a) {
          return this.createArray(
            Float64Array.from(e.data, t => Math.pow(t, a)),
            e.shape
          );
        }
        clip(e, a, t) {
          return this.createArray(
            Float64Array.from(e.data, r => {
              let c = r;
              return (a !== null && (c = Math.max(c, a)), t !== null && (c = Math.min(c, t)), c);
            }),
            e.shape
          );
        }
        sum(e, a, t, r) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let s = this.sumAxis(e, a);
            if ((r && (s = this.astype(s, r)), t)) {
              let n = [...e.shape];
              return ((n[a] = 1), this.reshape(s, n));
            }
            return s;
          }
          let c = e.data,
            o = 0;
          for (let s = 0; s < c.length; s++) o += c[s];
          return o;
        }
        prod(e, a, t, r) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let s = this.prodAxis(e, a);
            if ((r && (s = this.astype(s, r)), t)) {
              let n = [...e.shape];
              return ((n[a] = 1), this.reshape(s, n));
            }
            return s;
          }
          let c = e.data,
            o = 1;
          for (let s = 0; s < c.length; s++) o *= c[s];
          return o;
        }
        mean(e, a, t, r) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let c = this.meanAxis(e, a);
            if ((r && (c = this.astype(c, r)), t)) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          return e.data.length === 0 ? NaN : this.sum(e) / e.data.length;
        }
        var(e, a, t = 0, r) {
          if (a != null) {
            a = this._normalizeAxis(a, e.shape.length);
            let n = this.varAxis(e, a, t);
            if (r) {
              let i = [...e.shape];
              return ((i[a] = 1), this.reshape(n, i));
            }
            return n;
          }
          if (e.data.length === 0) return NaN;
          let c = this.mean(e),
            o = e.data,
            s = 0;
          for (let n = 0; n < o.length; n++) s += (o[n] - c) ** 2;
          return s / (o.length - t);
        }
        std(e, a, t = 0, r) {
          if (a != null) {
            a = this._normalizeAxis(a, e.shape.length);
            let c = this.stdAxis(e, a, t);
            if (r) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          return Math.sqrt(this.var(e, null, t));
        }
        min(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let c = this.minAxis(e, a);
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          if (e.data.length === 0) throw new Error('zero-size array');
          let r = 1 / 0;
          for (let c = 0; c < e.data.length; c++) {
            if (Number.isNaN(e.data[c])) return NaN;
            e.data[c] < r && (r = e.data[c]);
          }
          return r;
        }
        max(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let c = this.maxAxis(e, a);
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          if (e.data.length === 0) throw new Error('zero-size array');
          let r = -1 / 0;
          for (let c = 0; c < e.data.length; c++) {
            if (Number.isNaN(e.data[c])) return NaN;
            e.data[c] > r && (r = e.data[c]);
          }
          return r;
        }
        argmin(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let c = this.argminAxis(e, a);
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          if (e.data.length === 0) throw new Error('zero-size array');
          let r = 0;
          for (let c = 1; c < e.data.length; c++) e.data[c] < e.data[r] && (r = c);
          return r;
        }
        argmax(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let c = this.argmaxAxis(e, a);
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          if (e.data.length === 0) throw new Error('zero-size array');
          let r = 0;
          for (let c = 1; c < e.data.length; c++) e.data[c] > e.data[r] && (r = c);
          return r;
        }
        cumsum(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let s = this.cumsumAxis(e, a);
            return t ? this.astype(s, t) : s;
          }
          let r = new Float64Array(e.data.length),
            c = 0;
          for (let s = 0; s < e.data.length; s++) ((c += e.data[s]), (r[s] = c));
          let o = this.createArray(r, [e.data.length]);
          return t ? this.astype(o, t) : o;
        }
        cumprod(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let s = this.cumprodAxis(e, a);
            return t ? this.astype(s, t) : s;
          }
          let r = new Float64Array(e.data.length),
            c = 1;
          for (let s = 0; s < e.data.length; s++) ((c *= e.data[s]), (r[s] = c));
          let o = this.createArray(r, [e.data.length]);
          return t ? this.astype(o, t) : o;
        }
        all(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let r = this.allAxis(e, a);
            if (t) {
              let c = [...e.shape];
              return ((c[a] = 1), this.reshape(r, c));
            }
            return r;
          }
          return e.data.every(r => r !== 0);
        }
        any(e, a, t) {
          if (a !== void 0) {
            a = this._normalizeAxis(a, e.shape.length);
            let r = this.anyAxis(e, a);
            if (t) {
              let c = [...e.shape];
              return ((c[a] = 1), this.reshape(r, c));
            }
            return r;
          }
          return e.data.some(r => r !== 0);
        }
        sumAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = 0;
            for (let c = 0; c < t.length; c++) r += t[c];
            return r;
          });
        }
        meanAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = 0;
            for (let c = 0; c < t.length; c++) r += t[c];
            return r / t.length;
          });
        }
        minAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = t[0];
            for (let c = 1; c < t.length; c++) {
              if (Number.isNaN(t[c])) return NaN;
              t[c] < r && (r = t[c]);
            }
            return r;
          });
        }
        maxAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = t[0];
            for (let c = 1; c < t.length; c++) {
              if (Number.isNaN(t[c])) return NaN;
              t[c] > r && (r = t[c]);
            }
            return r;
          });
        }
        argminAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = 0;
            for (let c = 1; c < t.length; c++) t[c] < t[r] && (r = c);
            return r;
          });
        }
        argmaxAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = 0;
            for (let c = 1; c < t.length; c++) t[c] > t[r] && (r = c);
            return r;
          });
        }
        varAxis(e, a, t = 0) {
          let r = e.shape[a];
          return this._reduceAlongAxis(e, a, c => {
            let o = 0;
            for (let i = 0; i < c.length; i++) o += c[i];
            let s = o / c.length,
              n = 0;
            for (let i = 0; i < c.length; i++) {
              let u = c[i] - s;
              n += u * u;
            }
            return n / (r - t);
          });
        }
        stdAxis(e, a, t = 0) {
          let r = this.varAxis(e, a, t);
          return this.createArray(Float64Array.from(r.data, Math.sqrt), r.shape);
        }
        prodAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            let r = 1;
            for (let c = 0; c < t.length; c++) r *= t[c];
            return r;
          });
        }
        allAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            for (let r = 0; r < t.length; r++) if (t[r] === 0) return 0;
            return 1;
          });
        }
        anyAxis(e, a) {
          return this._reduceAlongAxis(e, a, t => {
            for (let r = 0; r < t.length; r++) if (t[r] !== 0) return 1;
            return 0;
          });
        }
        cumsumAxis(e, a) {
          return this._cumAlongAxis(e, a, (t, r) => t + r);
        }
        cumprodAxis(e, a) {
          return this._cumAlongAxis(e, a, (t, r) => t * r);
        }
        _cumAlongAxis(e, a, t) {
          let r = e.shape,
            c = r.length;
          if (a < 0 || a >= c) throw new Error(`Invalid axis ${a}`);
          let o = new Float64Array(e.data),
            s = r[a];
          if (s <= 1) return this.createArray(o, [...r]);
          let n = new Array(c);
          n[c - 1] = 1;
          for (let h = c - 2; h >= 0; h--) n[h] = n[h + 1] * r[h + 1];
          let i = n[a],
            u = r.filter((h, m) => m !== a),
            l = u.length > 0 ? u.reduce((h, m) => h * m, 1) : 1,
            f = new Array(u.length);
          if (u.length > 0) {
            f[u.length - 1] = 1;
            for (let h = u.length - 2; h >= 0; h--) f[h] = f[h + 1] * u[h + 1];
          }
          for (let h = 0; h < l; h++) {
            let m = h,
              d = new Array(c),
              g = 0;
            for (let p = 0; p < c; p++)
              p === a ? (d[p] = 0) : ((d[p] = Math.floor(m / f[g])), (m %= f[g]), g++);
            let b = 0;
            for (let p = 0; p < c; p++) b += d[p] * n[p];
            for (let p = 1; p < s; p++) o[b + p * i] = t(o[b + (p - 1) * i], o[b + p * i]);
          }
          return this.createArray(o, [...r]);
        }
        matmul(e, a) {
          if (e.shape.length !== 2 || a.shape.length !== 2)
            throw new Error('matmul requires 2D arrays');
          let [t, r] = e.shape,
            [c, o] = a.shape;
          if (r !== c) throw new Error('matmul dimension mismatch');
          let s = new Float64Array(t * o);
          for (let n = 0; n < t; n++)
            for (let i = 0; i < r; i++) {
              let u = e.data[n * r + i];
              for (let l = 0; l < o; l++) s[n * o + l] += u * a.data[i * o + l];
            }
          return this.createArray(s, [t, o]);
        }
        dot(e, a) {
          if (e.shape.length === 1 && a.shape.length === 1) {
            if (e.shape[0] !== a.shape[0]) throw new Error('dot dimension mismatch');
            let t = 0;
            for (let r = 0; r < e.data.length; r++) t += e.data[r] * a.data[r];
            return this.createArray([t], [1]);
          }
          return this.matmul(e, a);
        }
        inner(e, a) {
          if (e.shape[0] !== a.shape[0]) throw new Error('inner dimension mismatch');
          let t = 0;
          for (let r = 0; r < e.data.length; r++) t += e.data[r] * a.data[r];
          return t;
        }
        outer(e, a) {
          let t = e.data.length,
            r = a.data.length,
            c = new Float64Array(t * r);
          for (let o = 0; o < t; o++)
            for (let s = 0; s < r; s++) c[o * r + s] = e.data[o] * a.data[s];
          return this.createArray(c, [t, r]);
        }
        transpose(e, a) {
          let t = e.shape.length;
          if (t === 1) return this.createArray(e.data.slice(), e.shape);
          let r = a || [...Array(t).keys()].reverse();
          if (r.length !== t)
            throw new Error(`axes don't match array: expected ${t} axes, got ${r.length}`);
          let c = r.map(u => e.shape[u]),
            o = e.data.length,
            s = new Float64Array(o),
            n = new Array(t);
          n[t - 1] = 1;
          for (let u = t - 2; u >= 0; u--) n[u] = n[u + 1] * e.shape[u + 1];
          let i = new Array(t);
          i[t - 1] = 1;
          for (let u = t - 2; u >= 0; u--) i[u] = i[u + 1] * c[u + 1];
          for (let u = 0; u < o; u++) {
            let l = u,
              f = 0;
            for (let h = 0; h < t; h++) {
              let m = Math.floor(l / i[h]);
              ((l -= m * i[h]), (f += m * n[r[h]]));
            }
            s[u] = e.data[f];
          }
          return this.createArray(s, c);
        }
        trace(e) {
          if (e.shape.length !== 2) throw new Error('trace requires 2D');
          let [a, t] = e.shape,
            r = Math.min(a, t),
            c = 0;
          for (let o = 0; o < r; o++) c += e.data[o * t + o];
          return c;
        }
        det(e) {
          if (e.shape.length !== 2) throw new Error('det requires 2D');
          let [a, t] = e.shape;
          if (a !== t) throw new Error('det requires square matrix');
          if (a === 2) return e.data[0] * e.data[3] - e.data[1] * e.data[2];
          if (a === 3) {
            let [o, s, n, i, u, l, f, h, m] = e.data;
            return o * (u * m - l * h) - s * (i * m - l * f) + n * (i * h - u * f);
          }
          let r = this._luDecompose(e),
            c = r.sign;
          for (let o = 0; o < a; o++) c *= r.u.data[o * t + o];
          return c;
        }
        inv(e) {
          if (e.shape.length !== 2) throw new Error('inv requires 2D');
          let [a, t] = e.shape;
          if (a !== t) throw new Error('inv requires square matrix');
          let r = a,
            c = new Float64Array(r * 2 * r);
          for (let s = 0; s < r; s++) {
            for (let n = 0; n < r; n++) c[s * 2 * r + n] = e.data[s * r + n];
            c[s * 2 * r + r + s] = 1;
          }
          for (let s = 0; s < r; s++) {
            let n = s;
            for (let u = s + 1; u < r; u++)
              Math.abs(c[u * 2 * r + s]) > Math.abs(c[n * 2 * r + s]) && (n = u);
            for (let u = 0; u < 2 * r; u++) {
              let l = c[s * 2 * r + u];
              ((c[s * 2 * r + u] = c[n * 2 * r + u]), (c[n * 2 * r + u] = l));
            }
            let i = c[s * 2 * r + s];
            if (Math.abs(i) < 1e-10) throw new Error('singular matrix');
            for (let u = 0; u < 2 * r; u++) c[s * 2 * r + u] /= i;
            for (let u = 0; u < r; u++)
              if (u !== s) {
                let l = c[u * 2 * r + s];
                for (let f = 0; f < 2 * r; f++) c[u * 2 * r + f] -= l * c[s * 2 * r + f];
              }
          }
          let o = new Float64Array(r * r);
          for (let s = 0; s < r; s++)
            for (let n = 0; n < r; n++) o[s * r + n] = c[s * 2 * r + r + n];
          return this.createArray(o, [r, r]);
        }
        solve(e, a) {
          let t = e.shape[0];
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('solve requires square matrix');
          let r = a.shape.length === 1,
            c = r ? 1 : a.shape[1],
            o = new Float64Array(t * t);
          for (let n = 0; n < t * t; n++) o[n] = e.data[n];
          let s = new Float64Array(t * c);
          if (r) for (let n = 0; n < t; n++) s[n] = a.data[n];
          else for (let n = 0; n < t * c; n++) s[n] = a.data[n];
          for (let n = 0; n < t; n++) {
            let i = Math.abs(o[n * t + n]),
              u = n;
            for (let l = n + 1; l < t; l++) {
              let f = Math.abs(o[l * t + n]);
              f > i && ((i = f), (u = l));
            }
            if (i < 1e-15) throw new Error('Singular matrix');
            if (u !== n) {
              for (let l = 0; l < t; l++) {
                let f = o[n * t + l];
                ((o[n * t + l] = o[u * t + l]), (o[u * t + l] = f));
              }
              for (let l = 0; l < c; l++) {
                let f = s[n * c + l];
                ((s[n * c + l] = s[u * c + l]), (s[u * c + l] = f));
              }
            }
            for (let l = n + 1; l < t; l++) {
              let f = o[l * t + n] / o[n * t + n];
              o[l * t + n] = f;
              for (let h = n + 1; h < t; h++) o[l * t + h] -= f * o[n * t + h];
              for (let h = 0; h < c; h++) s[l * c + h] -= f * s[n * c + h];
            }
          }
          for (let n = t - 1; n >= 0; n--)
            for (let i = 0; i < c; i++) {
              for (let u = n + 1; u < t; u++) s[n * c + i] -= o[n * t + u] * s[u * c + i];
              s[n * c + i] /= o[n * t + n];
            }
          return r ? this.createArray(s, [t]) : this.createArray(s, [t, c]);
        }
        norm(e, a = 2, t) {
          if (a === 'fro') {
            let o = e.data,
              s = 0;
            for (let n = 0; n < o.length; n++) s += o[n] * o[n];
            return Math.sqrt(s);
          }
          if (a === 'nuc') {
            let { s: o } = this.svd(e),
              s = 0;
            for (let n = 0; n < o.data.length; n++) s += o.data[n];
            return s;
          }
          if (t !== void 0) {
            if (e.shape.length !== 2) throw new Error('norm with axis only supports 2D arrays');
            let [o, s] = e.shape;
            if (t < 0 || t >= 2) throw new Error('invalid axis for 2D array');
            if (t === 0) {
              let n = new Float64Array(s);
              for (let i = 0; i < s; i++) {
                let u = 0;
                for (let l = 0; l < o; l++) {
                  let f = e.data[l * s + i];
                  a === 1
                    ? (u += Math.abs(f))
                    : a === 1 / 0
                      ? (u = Math.max(u, Math.abs(f)))
                      : a === -1 / 0
                        ? (u = l === 0 ? Math.abs(f) : Math.min(u, Math.abs(f)))
                        : (u += f * f);
                }
                n[i] =
                  a === 2
                    ? Math.sqrt(u)
                    : a === 1 || a === 1 / 0 || a === -1 / 0
                      ? u
                      : Math.pow(u, 1 / a);
              }
              return this.createArray(n, [s]);
            } else {
              let n = new Float64Array(o);
              for (let i = 0; i < o; i++) {
                let u = 0;
                for (let l = 0; l < s; l++) {
                  let f = e.data[i * s + l];
                  a === 1
                    ? (u += Math.abs(f))
                    : a === 1 / 0
                      ? (u = Math.max(u, Math.abs(f)))
                      : a === -1 / 0
                        ? (u = l === 0 ? Math.abs(f) : Math.min(u, Math.abs(f)))
                        : (u += f * f);
                }
                n[i] =
                  a === 2
                    ? Math.sqrt(u)
                    : a === 1 || a === 1 / 0 || a === -1 / 0
                      ? u
                      : Math.pow(u, 1 / a);
              }
              return this.createArray(n, [o]);
            }
          }
          let r = e.data;
          if (a === 1) {
            let o = 0;
            for (let s = 0; s < r.length; s++) o += Math.abs(r[s]);
            return o;
          }
          if (a === 1 / 0) {
            let o = -1 / 0;
            for (let s = 0; s < r.length; s++) {
              let n = Math.abs(r[s]);
              n > o && (o = n);
            }
            return o;
          }
          if (a === -1 / 0) {
            let o = 1 / 0;
            for (let s = 0; s < r.length; s++) {
              let n = Math.abs(r[s]);
              n < o && (o = n);
            }
            return o;
          }
          if (a === 2) {
            let o = 0;
            for (let s = 0; s < r.length; s++) o += r[s] * r[s];
            return Math.sqrt(o);
          }
          let c = 0;
          for (let o = 0; o < r.length; o++) c += Math.pow(Math.abs(r[o]), a);
          return Math.pow(c, 1 / a);
        }
        qr(e, a = 'reduced') {
          if (e.shape.length !== 2) throw new Error('qr requires 2D');
          let [t, r] = e.shape,
            c = Math.min(t, r);
          if (a === 'complete') {
            let n = new Float64Array(t * t),
              i = new Float64Array(t * r);
            for (let u = 0; u < t; u++)
              for (let l = 0; l < r; l++) i[u * r + l] = e.data[u * r + l];
            for (let u = 0; u < t; u++) n[u * t + u] = 1;
            for (let u = 0; u < c; u++) {
              let l = new Float64Array(t - u);
              for (let d = u; d < t; d++) l[d - u] = i[d * r + u];
              let f = Math.sqrt(l.reduce((d, g) => d + g * g, 0));
              if (f < 1e-15) continue;
              let h = l[0] >= 0 ? 1 : -1;
              l[0] += h * f;
              let m = Math.sqrt(l.reduce((d, g) => d + g * g, 0));
              if (!(m < 1e-15)) {
                for (let d = 0; d < l.length; d++) l[d] /= m;
                for (let d = 0; d < r; d++) {
                  let g = 0;
                  for (let b = 0; b < l.length; b++) g += l[b] * i[(u + b) * r + d];
                  for (let b = 0; b < l.length; b++) i[(u + b) * r + d] -= 2 * l[b] * g;
                }
                for (let d = 0; d < t; d++) {
                  let g = 0;
                  for (let b = 0; b < l.length; b++) g += n[d * t + (u + b)] * l[b];
                  for (let b = 0; b < l.length; b++) n[d * t + (u + b)] -= 2 * g * l[b];
                }
              }
            }
            return { q: this.createArray(n, [t, t]), r: this.createArray(i, [t, r]) };
          }
          let o = new Float64Array(t * r),
            s = new Float64Array(r * r);
          for (let n = 0; n < t * r; n++) o[n] = e.data[n];
          for (let n = 0; n < r; n++) {
            let i = 0;
            for (let u = 0; u < t; u++) i += o[u * r + n] ** 2;
            if (((i = Math.sqrt(i)), (s[n * r + n] = i), !(i < 1e-15))) {
              for (let u = 0; u < t; u++) o[u * r + n] /= i;
              for (let u = n + 1; u < r; u++) {
                let l = 0;
                for (let f = 0; f < t; f++) l += o[f * r + n] * o[f * r + u];
                s[n * r + u] = l;
                for (let f = 0; f < t; f++) o[f * r + u] -= l * o[f * r + n];
              }
            }
          }
          return { q: this.createArray(o, [t, r]), r: this.createArray(s, [r, r]) };
        }
        svd(e, a = !0) {
          if (e.shape.length !== 2) throw new Error('svd requires 2D');
          let [t, r] = e.shape;
          if (t < r) {
            let d = this.transpose(e),
              g = this.svd(d, a);
            return { u: this.transpose(g.vt), s: g.s, vt: this.transpose(g.u) };
          }
          let c = new Float64Array(t * r);
          for (let d = 0; d < t; d++)
            for (let g = 0; g < r; g++) c[d + g * t] = Number(e.data[d * r + g]);
          let o = new Float64Array(r * r);
          for (let d = 0; d < r; d++) o[d + d * r] = 1;
          let s = 100,
            n = 1e-15;
          for (let d = 0; d < s; d++) {
            let g = 0,
              b = 0;
            for (let p = 0; p < r; p++) {
              for (let A = p + 1; A < r; A++) {
                let w = 0;
                for (let y = 0; y < t; y++) w += c[y + p * t] * c[y + A * t];
                g += w * w;
              }
              let _ = 0;
              for (let A = 0; A < t; A++) _ += c[A + p * t] * c[A + p * t];
              b += _ * _;
            }
            if (b === 0 || Math.sqrt(g) <= n * Math.sqrt(b)) break;
            for (let p = 0; p < r; p++)
              for (let _ = p + 1; _ < r; _++) {
                let A = 0,
                  w = 0,
                  y = 0;
                for (let E = 0; E < t; E++) {
                  let R = c[E + p * t],
                    x = c[E + _ * t];
                  ((A += R * R), (w += x * x), (y += R * x));
                }
                if (Math.abs(y) <= n * Math.sqrt(A * w)) continue;
                let D = (w - A) / (2 * y),
                  C;
                D >= 0
                  ? (C = 1 / (D + Math.sqrt(1 + D * D)))
                  : (C = -1 / (-D + Math.sqrt(1 + D * D)));
                let O = 1 / Math.sqrt(1 + C * C),
                  M = C * O;
                for (let E = 0; E < t; E++) {
                  let R = c[E + p * t],
                    x = c[E + _ * t];
                  ((c[E + p * t] = O * R - M * x), (c[E + _ * t] = M * R + O * x));
                }
                for (let E = 0; E < r; E++) {
                  let R = o[E + p * r],
                    x = o[E + _ * r];
                  ((o[E + p * r] = O * R - M * x), (o[E + _ * r] = M * R + O * x));
                }
              }
          }
          let i = new Float64Array(r);
          for (let d = 0; d < r; d++) {
            let g = 0;
            for (let b = 0; b < t; b++) g += c[b + d * t] * c[b + d * t];
            i[d] = Math.sqrt(g);
          }
          let u = Array.from({ length: r }, (d, g) => g);
          u.sort((d, g) => i[g] - i[d]);
          let l = new Float64Array(r);
          for (let d = 0; d < r; d++) l[d] = i[u[d]];
          let f = new Float64Array(t * r);
          for (let d = 0; d < r; d++) {
            let g = u[d],
              b = i[g];
            if (b > 1e-15) for (let p = 0; p < t; p++) f[p * r + d] = c[p + g * t] / b;
          }
          let h = new Float64Array(r * r);
          for (let d = 0; d < r; d++) {
            let g = u[d];
            for (let b = 0; b < r; b++) h[d * r + b] = o[b + g * r];
          }
          if (!a || t === r)
            return {
              u: this.createArray(f, [t, r]),
              s: this.createArray(l, [r]),
              vt: this.createArray(h, [r, r]),
            };
          let m = new Float64Array(t * t);
          for (let d = 0; d < t; d++) for (let g = 0; g < r; g++) m[d * t + g] = f[d * r + g];
          for (let d = r; d < t; d++)
            for (let g = 0; g < t; g++) {
              for (let p = 0; p < t; p++) m[p * t + d] = p === g ? 1 : 0;
              for (let p = 0; p < 2; p++)
                for (let _ = 0; _ < d; _++) {
                  let A = 0;
                  for (let w = 0; w < t; w++) A += m[w * t + d] * m[w * t + _];
                  for (let w = 0; w < t; w++) m[w * t + d] -= A * m[w * t + _];
                }
              let b = 0;
              for (let p = 0; p < t; p++) b += m[p * t + d] ** 2;
              if (((b = Math.sqrt(b)), b > 1e-12)) {
                for (let p = 0; p < t; p++) m[p * t + d] /= b;
                break;
              }
            }
          return {
            u: this.createArray(m, [t, t]),
            s: this.createArray(l, [r]),
            vt: this.createArray(h, [r, r]),
          };
        }
        _toNDArray(e) {
          return typeof e == 'number' ? this.createArray(new Float64Array([e]), [1], 'float64') : e;
        }
        _binaryOp(e, a, t) {
          let r = this._toNDArray(e),
            c = this._toNDArray(a),
            o = r.data,
            s = c.data,
            n = r.shape.length === c.shape.length;
          if (n) {
            for (let w = 0; w < r.shape.length; w++)
              if (r.shape[w] !== c.shape[w]) {
                n = !1;
                break;
              }
          }
          if (n) {
            let w = new Float64Array(o.length);
            for (let y = 0; y < o.length; y++) w[y] = t(o[y], s[y]);
            return this.createArray(w, [...r.shape]);
          }
          if (o.length === 1) {
            let w = new Float64Array(s.length),
              y = o[0];
            for (let D = 0; D < s.length; D++) w[D] = t(y, s[D]);
            return this.createArray(w, [...c.shape]);
          }
          if (s.length === 1) {
            let w = new Float64Array(o.length),
              y = s[0];
            for (let D = 0; D < o.length; D++) w[D] = t(o[D], y);
            return this.createArray(w, [...r.shape]);
          }
          let i = Math.max(r.shape.length, c.shape.length),
            u = new Array(i).fill(1),
            l = new Array(i).fill(1);
          for (let w = 0; w < r.shape.length; w++) u[i - r.shape.length + w] = r.shape[w];
          for (let w = 0; w < c.shape.length; w++) l[i - c.shape.length + w] = c.shape[w];
          let f = new Array(i);
          for (let w = 0; w < i; w++)
            if (u[w] === l[w]) f[w] = u[w];
            else if (u[w] === 1) f[w] = l[w];
            else if (l[w] === 1) f[w] = u[w];
            else
              throw new Error(
                `operands could not be broadcast together with shapes (${r.shape}) (${c.shape})`
              );
          let h = f.reduce((w, y) => w * y, 1),
            m = new Float64Array(h),
            d = new Array(i),
            g = new Array(i),
            b = 1,
            p = 1;
          for (let w = i - 1; w >= 0; w--)
            ((d[w] = u[w] === 1 ? 0 : b), (g[w] = l[w] === 1 ? 0 : p), (b *= u[w]), (p *= l[w]));
          let _ = new Array(i),
            A = 1;
          for (let w = i - 1; w >= 0; w--) ((_[w] = A), (A *= f[w]));
          if (i === 2) {
            let w = f[0],
              y = f[1],
              D = d[0],
              C = d[1],
              O = g[0],
              M = g[1],
              E = 0;
            for (let R = 0; R < w; R++) {
              let x = R * D,
                N = R * O;
              for (let U = 0; U < y; U++) m[E++] = t(o[x + U * C], s[N + U * M]);
            }
            return this.createArray(m, f);
          }
          if (i === 3) {
            let w = f[0],
              y = f[1],
              D = f[2],
              C = d[0],
              O = d[1],
              M = d[2],
              E = g[0],
              R = g[1],
              x = g[2],
              N = 0;
            for (let U = 0; U < w; U++) {
              let F = U * C,
                L = U * E;
              for (let z = 0; z < y; z++) {
                let V = F + z * O,
                  J = L + z * R;
                for (let X = 0; X < D; X++) m[N++] = t(o[V + X * M], s[J + X * x]);
              }
            }
            return this.createArray(m, f);
          }
          for (let w = 0; w < h; w++) {
            let y = 0,
              D = 0,
              C = w;
            for (let O = 0; O < i; O++) {
              let M = Math.floor(C / _[O]);
              ((C %= _[O]), (y += M * d[O]), (D += M * g[O]));
            }
            m[w] = t(o[y], s[D]);
          }
          return this.createArray(m, f);
        }
        _checkSameShape(e, a) {
          if (e.shape.length !== a.shape.length) throw new Error('shape mismatch');
          for (let t = 0; t < e.shape.length; t++)
            if (e.shape[t] !== a.shape[t]) throw new Error('shape mismatch');
        }
        _luDecompose(e) {
          let a = e.shape[0],
            t = new Float64Array(a * a),
            r = new Float64Array(a * a),
            c = 1;
          for (let o = 0; o < a * a; o++) r[o] = e.data[o];
          for (let o = 0; o < a; o++) t[o * a + o] = 1;
          for (let o = 0; o < a; o++) {
            let s = o;
            for (let n = o + 1; n < a; n++)
              Math.abs(r[n * a + o]) > Math.abs(r[s * a + o]) && (s = n);
            if (s !== o) {
              c *= -1;
              for (let n = 0; n < a; n++) {
                let i = r[o * a + n];
                ((r[o * a + n] = r[s * a + n]), (r[s * a + n] = i));
              }
            }
            for (let n = o + 1; n < a; n++) {
              let i = r[n * a + o] / r[o * a + o];
              t[n * a + o] = i;
              for (let u = o; u < a; u++) r[n * a + u] -= i * r[o * a + u];
            }
          }
          return { l: this.createArray(t, [a, a]), u: this.createArray(r, [a, a]), sign: c };
        }
        zerosLike(e, a) {
          let t = a ?? e.dtype ?? 'float64';
          return this.zeros(e.shape, t);
        }
        onesLike(e, a) {
          let t = a ?? e.dtype ?? 'float64';
          return this.ones(e.shape, t);
        }
        emptyLike(e, a) {
          let t = a ?? e.dtype ?? 'float64';
          return this.zeros(e.shape, t);
        }
        fullLike(e, a, t) {
          let r = t ?? e.dtype ?? 'float64';
          return this.full(e.shape, a, r);
        }
        broadcastTo(e, a) {
          let t = e.shape;
          if (t.length > a.length)
            throw new Error('Cannot broadcast to smaller number of dimensions');
          let r = new Array(a.length - t.length).fill(1).concat(t);
          for (let i = 0; i < a.length; i++)
            if (r[i] !== 1 && r[i] !== a[i])
              throw new Error(`Cannot broadcast shape [${t}] to [${a}]`);
          let c = a.reduce((i, u) => i * u, 1),
            o = new Float64Array(c),
            s = this._computeStrides(a),
            n = this._computeBroadcastStrides(r, a);
          for (let i = 0; i < c; i++) {
            let u = 0,
              l = i;
            for (let f = 0; f < a.length; f++) {
              let h = Math.floor(l / s[f]);
              ((l = l % s[f]), (u += h * n[f]));
            }
            o[i] = e.data[u];
          }
          return this.createArray(o, a);
        }
        broadcastArrays(...e) {
          if (e.length === 0) return [];
          if (e.length === 1) return [this.createArray(e[0].data.slice(), e[0].shape)];
          let a = e.map(o => o.shape),
            t = Math.max(...a.map(o => o.length)),
            r = a.map(o => new Array(t - o.length).fill(1).concat(o)),
            c = [];
          for (let o = 0; o < t; o++) {
            let s = r.map(i => i[o]),
              n = Math.max(...s);
            for (let i of s)
              if (i !== 1 && i !== n) throw new Error('Shapes are not broadcastable');
            c.push(n);
          }
          return e.map(o => this.broadcastTo(o, c));
        }
        _computeStrides(e) {
          let a = new Array(e.length),
            t = 1;
          for (let r = e.length - 1; r >= 0; r--) ((a[r] = t), (t *= e[r]));
          return a;
        }
        _computeBroadcastStrides(e, a) {
          let t = new Array(a.length),
            r = 1;
          for (let c = e.length - 1; c >= 0; c--) ((t[c] = e[c] === 1 ? 0 : r), (r *= e[c]));
          return t;
        }
        _normalizeAxis(e, a) {
          if ((e < 0 && (e += a), e < 0 || e >= a))
            throw new Error(`axis ${e} is out of bounds for array of dimension ${a}`);
          return e;
        }
        swapaxes(e, a, t) {
          let r = e.shape.length;
          if (((a = this._normalizeAxis(a, r)), (t = this._normalizeAxis(t, r)), a === t))
            return this.createArray(e.data.slice(), e.shape);
          let c = [...e.shape];
          [c[a], c[t]] = [c[t], c[a]];
          let o = Array.from({ length: r }, (s, n) => n);
          return (([o[a], o[t]] = [o[t], o[a]]), this._transposeGeneral(e, o, c));
        }
        moveaxis(e, a, t) {
          let r = e.shape.length,
            c = Array.isArray(a) ? a : [a],
            o = Array.isArray(t) ? t : [t];
          if (c.length !== o.length)
            throw new Error('source and destination must have the same number of elements');
          let s = c.map(f => this._normalizeAxis(f, r)),
            n = o.map(f => this._normalizeAxis(f, r)),
            i = [];
          for (let f = 0; f < r; f++) s.includes(f) || i.push(f);
          let u = n.map((f, h) => ({ dst: f, src: s[h] }));
          u.sort((f, h) => f.dst - h.dst);
          for (let { dst: f, src: h } of u) i.splice(f, 0, h);
          let l = i.map(f => e.shape[f]);
          return this._transposeGeneral(e, i, l);
        }
        _transposeGeneral(e, a, t) {
          let r = e.data.length,
            c = new Float64Array(r),
            o = this._computeStrides(e.shape),
            s = this._computeStrides(t);
          for (let n = 0; n < r; n++) {
            let i = new Array(t.length),
              u = n;
            for (let f = 0; f < t.length; f++) ((i[f] = Math.floor(u / s[f])), (u = u % s[f]));
            let l = 0;
            for (let f = 0; f < a.length; f++) l += i[f] * o[a[f]];
            c[n] = e.data[l];
          }
          return this.createArray(c, t);
        }
        squeeze(e, a) {
          if (a !== void 0) {
            let c = (Array.isArray(a) ? a : [a]).map(s => this._normalizeAxis(s, e.shape.length));
            for (let s of c)
              if (e.shape[s] !== 1)
                throw new Error(`cannot squeeze axis ${s} with size ${e.shape[s]}`);
            let o = e.shape.filter((s, n) => !c.includes(n));
            return this.createArray(e.data.slice(), o.length === 0 ? [1] : o);
          }
          let t = e.shape.filter(r => r !== 1);
          return this.createArray(e.data.slice(), t.length === 0 ? [1] : t);
        }
        expandDims(e, a) {
          let t = e.shape.length + 1;
          if ((a < 0 && (a += t), a < 0 || a >= t)) throw new Error(`axis ${a} is out of bounds`);
          let r = [...e.shape];
          return (r.splice(a, 0, 1), this.createArray(e.data.slice(), r));
        }
        reshape(e, a) {
          let t = -1,
            r = 1;
          for (let s = 0; s < a.length; s++)
            if (a[s] === -1) {
              if (t !== -1) throw new Error('can only specify one unknown dimension');
              t = s;
            } else r *= a[s];
          let c = [...a];
          if (
            (t !== -1 && (c[t] = e.data.length / r), c.reduce((s, n) => s * n, 1) !== e.data.length)
          )
            throw new Error(`cannot reshape array of size ${e.data.length} into shape [${c}]`);
          return this.createArray(e.data.slice(), c);
        }
        resize(e, a) {
          let t = a.reduce((o, s) => o * s, 1),
            r = new Float64Array(t),
            c = e.data.length;
          if (c === 0) return this.createArray(r, [...a]);
          for (let o = 0; o < t; o++) r[o] = e.data[o % c];
          return this.createArray(r, [...a]);
        }
        flatten(e) {
          return this.createArray(e.data.slice(), [e.data.length]);
        }
        concatenate(e, a = 0) {
          if (e.length === 0) throw new Error('need at least one array to concatenate');
          if (a == null) {
            let i = e.map(h => this.flatten(h)),
              u = i.reduce((h, m) => h + m.data.length, 0),
              l = new Float64Array(u),
              f = 0;
            for (let h of i) (l.set(h.data, f), (f += h.data.length));
            return this.createArray(l, [u]);
          }
          if (e.length === 1) return this.createArray(e[0].data.slice(), e[0].shape);
          let t = e[0].shape.length;
          a = this._normalizeAxis(a, t);
          for (let i = 1; i < e.length; i++) {
            if (e[i].shape.length !== t)
              throw new Error('all input arrays must have same number of dimensions');
            for (let u = 0; u < t; u++)
              if (u !== a && e[i].shape[u] !== e[0].shape[u])
                throw new Error('all input array dimensions except concat axis must match');
          }
          let r = [...e[0].shape];
          r[a] = e.reduce((i, u) => i + u.shape[a], 0);
          let c = r.reduce((i, u) => i * u, 1),
            o = new Float64Array(c);
          if (t === 1) {
            let i = 0;
            for (let u of e) (o.set(u.data, i), (i += u.data.length));
            return this.createArray(o, r);
          }
          let s = this._computeStrides(r),
            n = 0;
          for (let i of e) {
            let u = this._computeStrides(i.shape),
              l = i.data.length;
            for (let f = 0; f < l; f++) {
              let h = new Array(t),
                m = f;
              for (let g = 0; g < t; g++) ((h[g] = Math.floor(m / u[g])), (m = m % u[g]));
              h[a] += n;
              let d = 0;
              for (let g = 0; g < t; g++) d += h[g] * s[g];
              o[d] = i.data[f];
            }
            n += i.shape[a];
          }
          return this.createArray(o, r);
        }
        stack(e, a = 0) {
          if (e.length === 0) throw new Error('need at least one array to stack');
          let t = e[0].shape;
          for (let c = 1; c < e.length; c++) {
            if (e[c].shape.length !== t.length)
              throw new Error('all input arrays must have the same shape');
            for (let o = 0; o < t.length; o++)
              if (e[c].shape[o] !== t[o])
                throw new Error('all input arrays must have the same shape');
          }
          let r = e.map(c => this.expandDims(c, a));
          return this.concatenate(r, a);
        }
        split(e, a, t = 0) {
          let r = e.shape.length;
          t = this._normalizeAxis(t, r);
          let c = e.shape[t],
            o;
          if (typeof a == 'number') {
            if (c % a !== 0)
              throw new Error(`array of size ${c} cannot be split into ${a} equal parts`);
            let u = c / a;
            o = [];
            for (let l = u; l < c; l += u) o.push(l);
          } else o = a;
          let s = [],
            n = 0,
            i = (u, l) => {
              let f = [...e.shape];
              f[t] = l - u;
              let h = f.reduce((b, p) => b * p, 1),
                m = new Float64Array(h),
                d = this._computeStrides(e.shape),
                g = this._computeStrides(f);
              for (let b = 0; b < h; b++) {
                let p = new Array(r),
                  _ = b;
                for (let w = 0; w < r; w++) ((p[w] = Math.floor(_ / g[w])), (_ = _ % g[w]));
                p[t] += u;
                let A = 0;
                for (let w = 0; w < r; w++) A += p[w] * d[w];
                m[b] = e.data[A];
              }
              return this.createArray(m, f);
            };
          for (let u of o) (s.push(i(n, u)), (n = u));
          return (s.push(i(n, c)), s);
        }
        where(e, a, t) {
          if (a === void 0 || t === void 0) return this.nonzero(e);
          let [r, c, o] = this.broadcastArrays(e, a, t),
            s = r.data.length,
            n = new Float64Array(s);
          for (let i = 0; i < s; i++) n[i] = r.data[i] !== 0 ? c.data[i] : o.data[i];
          return this.createArray(n, r.shape);
        }
        take(e, a, t) {
          let r = Array.isArray(a) ? a : Array.from(a.data);
          if (t === void 0) {
            let l = new Float64Array(r.length);
            for (let f = 0; f < r.length; f++) {
              let h = r[f];
              (h < 0 && (h += e.data.length), (l[f] = e.data[h]));
            }
            return this.createArray(l, [r.length]);
          }
          let c = e.shape.length;
          t = this._normalizeAxis(t, c);
          let o = [...e.shape];
          o[t] = r.length;
          let s = o.reduce((l, f) => l * f, 1),
            n = new Float64Array(s),
            i = this._computeStrides(e.shape),
            u = this._computeStrides(o);
          for (let l = 0; l < s; l++) {
            let f = new Array(c),
              h = l;
            for (let g = 0; g < c; g++) ((f[g] = Math.floor(h / u[g])), (h = h % u[g]));
            let m = r[f[t]];
            (m < 0 && (m += e.shape[t]), (f[t] = m));
            let d = 0;
            for (let g = 0; g < c; g++) d += f[g] * i[g];
            n[l] = e.data[d];
          }
          return this.createArray(n, o);
        }
        put(e, a, t) {
          let r = Array.isArray(a) ? a : Array.from(a.data),
            c = typeof t == 'number' ? [t] : t;
          for (let o = 0; o < r.length; o++) {
            let s = r[o];
            (s < 0 && (s += e.data.length), (e.data[s] = c[o % c.length]));
          }
        }
        ix_(...e) {
          let a = e.length,
            t = [];
          for (let r = 0; r < a; r++) {
            let c = new Array(a).fill(1);
            ((c[r] = e[r].data.length), t.push(this.reshape(this.copy(e[r]), c)));
          }
          return t;
        }
        batchedMatmul(e, a) {
          if (e.shape.length < 2 || a.shape.length < 2)
            throw new Error('batchedMatmul requires at least 2D arrays');
          let t = e.shape[e.shape.length - 2],
            r = e.shape[e.shape.length - 1],
            c = a.shape[a.shape.length - 2],
            o = a.shape[a.shape.length - 1];
          if (r !== c) throw new Error('matmul inner dimensions must match');
          let s = e.shape.slice(0, -2),
            n = a.shape.slice(0, -2),
            i = Math.max(s.length, n.length),
            u = new Array(i - s.length).fill(1).concat(s),
            l = new Array(i - n.length).fill(1).concat(n),
            f = [];
          for (let y = 0; y < i; y++) {
            let D = u[y],
              C = l[y];
            if (D !== 1 && C !== 1 && D !== C)
              throw new Error('batch dimensions are not broadcastable');
            f.push(Math.max(D, C));
          }
          let h = [...f, t, o],
            m = f.reduce((y, D) => y * D, 1),
            d = t * o,
            g = new Float64Array(m * d),
            b = this._computeStrides(u),
            p = this._computeStrides(l),
            _ = this._computeStrides(f),
            A = t * r,
            w = c * o;
          for (let y = 0; y < m; y++) {
            let D = new Array(i),
              C = y;
            for (let R = 0; R < i; R++) ((D[R] = Math.floor(C / _[R])), (C = C % _[R]));
            let O = 0,
              M = 0;
            for (let R = 0; R < i; R++) {
              let x = u[R] === 1 ? 0 : D[R],
                N = l[R] === 1 ? 0 : D[R];
              ((O += x * b[R]), (M += N * p[R]));
            }
            ((O *= A), (M *= w));
            let E = y * d;
            for (let R = 0; R < t; R++)
              for (let x = 0; x < r; x++) {
                let N = e.data[O + R * r + x];
                for (let U = 0; U < o; U++) g[E + R * o + U] += N * a.data[M + x * o + U];
              }
          }
          return this.createArray(g, h);
        }
        einsum(e, ...a) {
          let [t, r] = e.split('->').map(_ => _.trim()),
            c = t.split(',').map(_ => _.trim());
          if (c.length !== a.length)
            throw new Error(`einsum: expected ${c.length} operands, got ${a.length}`);
          let o = new Map(),
            s = [];
          for (let _ = 0; _ < a.length; _++) {
            let A = c[_].split('');
            if ((s.push(A), A.length !== a[_].shape.length))
              throw new Error(
                `einsum: operand ${_} has ${a[_].shape.length} dimensions but subscripts specify ${A.length}`
              );
            for (let w = 0; w < A.length; w++) {
              let y = A[w],
                D = a[_].shape[w];
              if (o.has(y)) {
                if (o.get(y) !== D) throw new Error(`einsum: inconsistent size for label '${y}'`);
              } else o.set(y, D);
            }
          }
          let n;
          if (r !== void 0) n = r.split('');
          else {
            let _ = new Map();
            for (let w of s) for (let y of w) _.set(y, (_.get(y) || 0) + 1);
            n = [];
            let A = Array.from(o.keys()).sort();
            for (let w of A) _.get(w) === 1 && n.push(w);
          }
          let i = n.map(_ => o.get(_)),
            u = i.length === 0 ? 1 : i.reduce((_, A) => _ * A, 1),
            l = new Set(n),
            h = Array.from(o.keys()).filter(_ => !l.has(_)),
            m = h.map(_ => o.get(_)),
            d = m.length === 0 ? 1 : m.reduce((_, A) => _ * A, 1),
            g = new Float64Array(u),
            b = a.map(_ => this._computeStrides(_.shape)),
            p = i.length === 0 ? [] : this._computeStrides(i);
          for (let _ = 0; _ < u; _++) {
            let A = new Map(),
              w = _;
            for (let D = 0; D < n.length; D++) {
              let C = Math.floor(w / p[D]);
              ((w = w % p[D]), A.set(n[D], C));
            }
            let y = 0;
            for (let D = 0; D < d; D++) {
              let C = new Map(),
                O = D;
              for (let R = 0; R < h.length; R++) {
                let x = R < m.length - 1 ? m.slice(R + 1).reduce((U, F) => U * F, 1) : 1,
                  N = Math.floor(O / x);
                ((O = O % x), C.set(h[R], N));
              }
              let M = new Map([...A, ...C]),
                E = 1;
              for (let R = 0; R < a.length; R++) {
                let x = s[R],
                  N = b[R],
                  U = 0;
                for (let F = 0; F < x.length; F++) U += M.get(x[F]) * N[F];
                E *= a[R].data[U];
              }
              y += E;
            }
            g[_] = y;
          }
          return this.createArray(g, i.length === 0 ? [1] : i);
        }
        diff(e, a = 1, t = -1, r, c) {
          let o = e.shape.length;
          t = this._normalizeAxis(t, o);
          let s = e;
          if (r !== void 0 || c !== void 0) {
            let i = [];
            if (r !== void 0)
              if (typeof r == 'number') {
                let u = [...e.shape];
                u[t] = 1;
                let l = u.reduce((h, m) => h * m, 1),
                  f = new Float64Array(l);
                (f.fill(r), i.push(this.createArray(f, u)));
              } else i.push(r);
            if ((i.push(e), c !== void 0))
              if (typeof c == 'number') {
                let u = [...e.shape];
                u[t] = 1;
                let l = u.reduce((h, m) => h * m, 1),
                  f = new Float64Array(l);
                (f.fill(c), i.push(this.createArray(f, u)));
              } else i.push(c);
            s = this.concatenate(i, t);
          }
          let n = s;
          for (let i = 0; i < a; i++) n = this._diffOnce(n, t);
          return n;
        }
        _diffOnce(e, a) {
          let t = e.shape;
          if (t[a] < 2) throw new Error('diff requires at least 2 elements along axis');
          let r = [...t];
          r[a] -= 1;
          let c = r.reduce((i, u) => i * u, 1),
            o = new Float64Array(c),
            s = this._computeStrides(t),
            n = this._computeStrides(r);
          for (let i = 0; i < c; i++) {
            let u = new Array(t.length),
              l = i;
            for (let m = 0; m < t.length; m++) ((u[m] = Math.floor(l / n[m])), (l = l % n[m]));
            let f = 0,
              h = 0;
            for (let m = 0; m < t.length; m++)
              m === a
                ? ((f += (u[m] + 1) * s[m]), (h += u[m] * s[m]))
                : ((f += u[m] * s[m]), (h += u[m] * s[m]));
            o[i] = e.data[f] - e.data[h];
          }
          return this.createArray(o, r);
        }
        gradient(e, a = -1, t = 1) {
          let r = e.shape.length;
          a = this._normalizeAxis(a, r);
          let c = e.shape,
            o = c[a];
          if (o < 2) throw new Error('gradient requires at least 2 elements along axis');
          if (t === 2 && o < 3)
            throw new Error('gradient with edge_order=2 requires at least 3 elements along axis');
          let s = new Float64Array(e.data.length),
            n = this._computeStrides(c),
            i = u => {
              let l = 0;
              for (let f = 0; f < r; f++) l += u[f] * n[f];
              return l;
            };
          for (let u = 0; u < e.data.length; u++) {
            let l = new Array(r),
              f = u;
            for (let d = 0; d < r; d++) ((l[d] = Math.floor(f / n[d])), (f = f % n[d]));
            let h = l[a],
              m;
            if (h === 0)
              if (t === 2) {
                let d = [...l];
                d[a] = 1;
                let g = [...l];
                ((g[a] = 2), (m = (-3 * e.data[u] + 4 * e.data[i(d)] - e.data[i(g)]) / 2));
              } else {
                let d = [...l];
                ((d[a] = 1), (m = e.data[i(d)] - e.data[u]));
              }
            else if (h === o - 1)
              if (t === 2) {
                let d = [...l];
                d[a] = o - 2;
                let g = [...l];
                ((g[a] = o - 3), (m = (3 * e.data[u] - 4 * e.data[i(d)] + e.data[i(g)]) / 2));
              } else {
                let d = [...l];
                ((d[a] = o - 2), (m = e.data[u] - e.data[i(d)]));
              }
            else {
              let d = [...l],
                g = [...l];
              ((d[a] = h - 1), (g[a] = h + 1), (m = (e.data[i(g)] - e.data[i(d)]) / 2));
            }
            s[u] = m;
          }
          return this.createArray(s, c);
        }
        ediff1d(e) {
          let a = this.flatten(e);
          return this.diff(a, 1, 0);
        }
        cross(e, a) {
          let t = this.flatten(e),
            r = this.flatten(a);
          if (t.data.length !== 3 || r.data.length !== 3)
            throw new Error('cross product only supports 3D vectors');
          let [c, o, s] = t.data,
            [n, i, u] = r.data;
          return this.createArray(
            new Float64Array([o * u - s * i, s * n - c * u, c * i - o * n]),
            [3]
          );
        }
        cov(e, a, t = !0, r = !1, c) {
          let o = s => (c != null ? s - c : r ? s : s - 1);
          if (a === void 0) {
            let s;
            if (e.shape.length === 1) s = this.reshape(e, [1, e.data.length]);
            else if (e.shape.length === 2) s = e;
            else throw new Error('cov requires 1D or 2D array when y is not provided');
            t || (s = this.transpose(s));
            let [n, i] = s.shape,
              u = o(i),
              l = new Float64Array(n * n),
              f = new Float64Array(n);
            for (let h = 0; h < n; h++) {
              let m = 0;
              for (let d = 0; d < i; d++) m += s.data[h * i + d];
              f[h] = m / i;
            }
            for (let h = 0; h < n; h++)
              for (let m = 0; m < n; m++) {
                let d = 0;
                for (let g = 0; g < i; g++)
                  d += (s.data[h * i + g] - f[h]) * (s.data[m * i + g] - f[m]);
                l[h * n + m] = u > 0 ? d / u : 0;
              }
            return this.createArray(l, [n, n]);
          } else {
            let s = this.flatten(e),
              n = this.flatten(a);
            if (s.data.length !== n.data.length) throw new Error('x and y must have same length');
            let i = s.data.length,
              u = o(i),
              l = this.mean(s),
              f = this.mean(n),
              h = 0,
              m = 0,
              d = 0;
            for (let b = 0; b < i; b++) {
              let p = s.data[b] - l,
                _ = n.data[b] - f;
              ((h += p * _), (m += p * p), (d += _ * _));
            }
            let g = u > 0 ? u : 1;
            return this.createArray(new Float64Array([m / g, h / g, h / g, d / g]), [2, 2]);
          }
        }
        corrcoef(e, a, t = !0) {
          let r = this.cov(e, a, t),
            c = r.shape[0],
            o = new Float64Array(c * c);
          for (let s = 0; s < c; s++)
            for (let n = 0; n < c; n++) {
              let i = r.data[s * c + n],
                u = r.data[s * c + s],
                l = r.data[n * c + n];
              o[s * c + n] = i / Math.sqrt(u * l);
            }
          return this.createArray(o, [c, c]);
        }
        convolve(e, a, t = 'full') {
          let r = this.flatten(e),
            c = this.flatten(a),
            o = r.data.length,
            s = c.data.length,
            n,
            i;
          t === 'full'
            ? ((n = o + s - 1), (i = 0))
            : t === 'same'
              ? ((n = o), (i = Math.floor((s - 1) / 2)))
              : ((n = Math.max(o - s + 1, 0)), (i = s - 1));
          let u = new Float64Array(n),
            l = o + s - 1,
            f = new Float64Array(l);
          for (let h = 0; h < l; h++) {
            let m = 0;
            for (let d = 0; d < s; d++) {
              let g = h - d;
              g >= 0 && g < o && (m += r.data[g] * c.data[d]);
            }
            f[h] = m;
          }
          for (let h = 0; h < n; h++) u[h] = f[i + h];
          return this.createArray(u, [n]);
        }
        correlate(e, a, t = 'valid') {
          let r = this.flatten(a),
            c = this.createArray(new Float64Array([...r.data].reverse()), r.shape);
          return this.convolve(e, c, t);
        }
        identity(e, a = 'float64') {
          return this.eye(e, a);
        }
        tril(e, a = 0) {
          if (e.shape.length !== 2) throw new Error('tril requires 2D array');
          let [t, r] = e.shape,
            c = new Float64Array(t * r);
          for (let o = 0; o < t; o++)
            for (let s = 0; s < r; s++) s <= o + a && (c[o * r + s] = e.data[o * r + s]);
          return this.createArray(c, [t, r]);
        }
        triu(e, a = 0) {
          if (e.shape.length !== 2) throw new Error('triu requires 2D array');
          let [t, r] = e.shape,
            c = new Float64Array(t * r);
          for (let o = 0; o < t; o++)
            for (let s = 0; s < r; s++) s >= o + a && (c[o * r + s] = e.data[o * r + s]);
          return this.createArray(c, [t, r]);
        }
        meshgrid(...e) {
          let a = 'xy',
            t = [];
          for (let f of e) f === 'xy' || f === 'ij' ? (a = f) : t.push(f);
          if (t.length < 2) throw new Error('meshgrid requires at least 2 arrays');
          let r = t.map(f => this.flatten(f).data.length),
            c = t.map(f => this.flatten(f)),
            o = t.length,
            s;
          a === 'ij' ? (s = r) : (s = [r[1], r[0], ...r.slice(2)]);
          let n = s.reduce((f, h) => f * h, 1),
            i = new Array(o),
            u = 1;
          for (let f = o - 1; f >= 0; f--) ((i[f] = u), (u *= s[f]));
          let l = [];
          for (let f = 0; f < o; f++) {
            let h = new Float64Array(n),
              m = c[f].data,
              d = f;
            a === 'xy' && f < 2 && (d = 1 - f);
            for (let g = 0; g < n; g++) {
              let b = Math.floor(g / i[d]) % s[d];
              h[g] = m[b];
            }
            l.push(this.createArray(h, [...s]));
          }
          return l;
        }
        logspace(e, a, t, r = 10, c = !0, o = 'float64') {
          let s = this.linspace(e, a, t, c),
            n = H(o, t);
          for (let i = 0; i < t; i++) n[i] = Math.pow(r, s.data[i]);
          return this.createArray(n, [t], o);
        }
        geomspace(e, a, t, r = !0, c = 'float64') {
          if (e === 0 || a === 0) throw new Error('geomspace: start and stop must be non-zero');
          if (e < 0 != a < 0) throw new Error('geomspace: start and stop must have same sign');
          let o = Math.log(Math.abs(e)),
            s = Math.log(Math.abs(a)),
            n = this.linspace(o, s, t, r),
            i = H(c, t),
            u = e < 0 ? -1 : 1;
          for (let l = 0; l < t; l++) i[l] = u * Math.exp(n.data[l]);
          return this.createArray(i, [t], c);
        }
        vstack(e) {
          let a = e.map(t => (t.shape.length === 1 ? this.reshape(t, [1, t.shape[0]]) : t));
          return this.concatenate(a, 0);
        }
        rowStack(e) {
          return this.vstack(e);
        }
        hstack(e) {
          return e[0].shape.length === 1 ? this.concatenate(e, 0) : this.concatenate(e, 1);
        }
        dstack(e) {
          let a = e.map(t =>
            t.shape.length === 1
              ? this.reshape(t, [1, t.shape[0], 1])
              : t.shape.length === 2
                ? this.reshape(t, [t.shape[0], t.shape[1], 1])
                : t
          );
          return this.concatenate(a, 2);
        }
        vsplit(e, a) {
          if (e.shape.length < 2)
            throw new Error('vsplit requires array with at least 2 dimensions');
          return this.split(e, a, 0);
        }
        hsplit(e, a) {
          return e.shape.length === 1 ? this.split(e, a, 0) : this.split(e, a, 1);
        }
        dsplit(e, a) {
          if (e.shape.length < 3)
            throw new Error('dsplit requires array with at least 3 dimensions');
          return this.split(e, a, 2);
        }
        tile(e, a) {
          let t = Array.isArray(a) ? a : [a],
            r = Math.max(e.shape.length, t.length),
            c = new Array(r - t.length).fill(1).concat(t),
            o = new Array(r - e.shape.length).fill(1).concat(e.shape),
            s = o.map((f, h) => f * c[h]),
            n = s.reduce((f, h) => f * h, 1),
            i = new Float64Array(n),
            u = this._computeStrides(s),
            l = this._computeStrides(o);
          for (let f = 0; f < n; f++) {
            let h = new Array(r),
              m = f;
            for (let g = 0; g < r; g++) ((h[g] = Math.floor(m / u[g])), (m = m % u[g]));
            let d = 0;
            for (let g = 0; g < r; g++) d += (h[g] % o[g]) * l[g];
            i[f] = e.data[d];
          }
          return this.createArray(i, s);
        }
        repeat(e, a, t) {
          if (t === void 0) {
            let u = this.flatten(e),
              l = new Float64Array(u.data.length * a);
            for (let f = 0; f < u.data.length; f++)
              for (let h = 0; h < a; h++) l[f * a + h] = u.data[f];
            return this.createArray(l, [l.length]);
          }
          let r = e.shape.length;
          t = this._normalizeAxis(t, r);
          let c = [...e.shape];
          c[t] *= a;
          let o = c.reduce((u, l) => u * l, 1),
            s = new Float64Array(o),
            n = this._computeStrides(e.shape),
            i = this._computeStrides(c);
          for (let u = 0; u < o; u++) {
            let l = new Array(r),
              f = u;
            for (let m = 0; m < r; m++) ((l[m] = Math.floor(f / i[m])), (f = f % i[m]));
            l[t] = Math.floor(l[t] / a);
            let h = 0;
            for (let m = 0; m < r; m++) h += l[m] * n[m];
            s[u] = e.data[h];
          }
          return this.createArray(s, c);
        }
        nonzero(e) {
          let a = Array.from({ length: e.shape.length }, () => []),
            t = this._computeStrides(e.shape);
          for (let r = 0; r < e.data.length; r++)
            if (e.data[r] !== 0) {
              let c = r;
              for (let o = 0; o < e.shape.length; o++) {
                let s = Math.floor(c / t[o]);
                ((c = c % t[o]), a[o].push(s));
              }
            }
          return a.map(r => this.createArray(new Float64Array(r), [r.length]));
        }
        argwhere(e) {
          let a = this.nonzero(e);
          if (a.length === 0 || a[0].data.length === 0)
            return this.createArray(new Float64Array(0), [0, e.shape.length]);
          let t = a[0].data.length,
            r = e.shape.length,
            c = new Float64Array(t * r);
          for (let o = 0; o < t; o++) for (let s = 0; s < r; s++) c[o * r + s] = a[s].data[o];
          return this.createArray(c, [t, r]);
        }
        flatnonzero(e) {
          let a = [];
          for (let t = 0; t < e.data.length; t++) e.data[t] !== 0 && a.push(t);
          return this.createArray(new Float64Array(a), [a.length]);
        }
        nanToNum(e, a = 0, t, r) {
          let c = Number.MAX_VALUE,
            o = t ?? c,
            s = r ?? -c,
            n = new Float64Array(e.data.length);
          for (let i = 0; i < e.data.length; i++) {
            let u = e.data[i];
            Number.isNaN(u)
              ? (n[i] = a)
              : u === 1 / 0
                ? (n[i] = o)
                : u === -1 / 0
                  ? (n[i] = s)
                  : (n[i] = u);
          }
          return this.createArray(n, e.shape);
        }
        sort(e, a = -1, t) {
          let r = e.shape.length;
          a = this._normalizeAxis(a, r);
          let c = new Float64Array(e.data),
            o = e.shape,
            s = this._computeStrides(o),
            n = o[a],
            i = o.filter((f, h) => h !== a),
            u = i.length > 0 ? this._computeStrides(i) : [1],
            l = i.reduce((f, h) => f * h, 1) || 1;
          for (let f = 0; f < l; f++) {
            let h = new Float64Array(n),
              m = new Array(i.length),
              d = f;
            for (let _ = 0; _ < i.length; _++) ((m[_] = Math.floor(d / u[_])), (d = d % u[_]));
            let g = new Array(r),
              b = 0;
            for (let _ = 0; _ < r; _++) _ === a ? (g[_] = 0) : (g[_] = m[b++]);
            for (let _ = 0; _ < n; _++) {
              let A = [...g];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * s[y];
              h[_] = e.data[w];
            }
            let p = Array.from(h).sort((_, A) =>
              Number.isNaN(_) && Number.isNaN(A)
                ? 0
                : Number.isNaN(_)
                  ? 1
                  : Number.isNaN(A)
                    ? -1
                    : _ - A
            );
            for (let _ = 0; _ < n; _++) {
              let A = [...g];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * s[y];
              c[w] = p[_];
            }
          }
          return this.createArray(c, o);
        }
        argsort(e, a = -1, t) {
          let r = e.shape.length;
          a = this._normalizeAxis(a, r);
          let c = new Float64Array(e.data.length),
            o = e.shape,
            s = this._computeStrides(o),
            n = o[a],
            i = o.filter((f, h) => h !== a),
            u = i.length > 0 ? this._computeStrides(i) : [1],
            l = i.reduce((f, h) => f * h, 1) || 1;
          for (let f = 0; f < l; f++) {
            let h = new Array(i.length),
              m = f;
            for (let _ = 0; _ < i.length; _++) ((h[_] = Math.floor(m / u[_])), (m = m % u[_]));
            let d = new Array(r),
              g = 0;
            for (let _ = 0; _ < r; _++) _ === a ? (d[_] = 0) : (d[_] = h[g++]);
            let b = Array.from({ length: n }, (_, A) => A),
              p = new Array(n);
            for (let _ = 0; _ < n; _++) {
              let A = [...d];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * s[y];
              p[_] = e.data[w];
            }
            b.sort((_, A) => {
              let w = p[_],
                y = p[A];
              return Number.isNaN(w) && Number.isNaN(y)
                ? 0
                : Number.isNaN(w)
                  ? 1
                  : Number.isNaN(y)
                    ? -1
                    : w - y;
            });
            for (let _ = 0; _ < n; _++) {
              let A = [...d];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * s[y];
              c[w] = b[_];
            }
          }
          return this.createArray(c, o);
        }
        searchsorted(e, a, t = 'left', r) {
          let c = this.flatten(e),
            o;
          if (r) {
            let n = new Float64Array(c.data.length);
            for (let i = 0; i < c.data.length; i++) n[i] = c.data[r.data[i]];
            o = n;
          } else o = c.data;
          let s = n => {
            let i = 0,
              u = o.length;
            for (; i < u; ) {
              let l = Math.floor((i + u) / 2);
              t === 'left' ? (o[l] < n ? (i = l + 1) : (u = l)) : o[l] <= n ? (i = l + 1) : (u = l);
            }
            return i;
          };
          if (typeof a == 'number') return s(a);
          {
            let n = this.flatten(a),
              i = new Float64Array(n.data.length);
            for (let u = 0; u < n.data.length; u++) i[u] = s(n.data[u]);
            return this.createArray(i, n.shape);
          }
        }
        unique(e, a, t, r) {
          let c = this.flatten(e),
            o = Array.from(c.data),
            s = new Set(),
            n = [];
          for (let l = 0; l < o.length; l++) {
            let f = o[l];
            s.has(f) || (s.add(f), n.push(f));
          }
          n.sort((l, f) =>
            Number.isNaN(l) && Number.isNaN(f)
              ? 0
              : Number.isNaN(l)
                ? 1
                : Number.isNaN(f)
                  ? -1
                  : l - f
          );
          let i = this.createArray(new Float64Array(n), [n.length]);
          if (!a && !t && !r) return i;
          let u = { values: i };
          if (a) {
            let l = n.map(f => o.indexOf(f));
            u.indices = this.createArray(new Float64Array(l), [l.length]);
          }
          if (t) {
            let l = new Map(n.map((h, m) => [h, m])),
              f = o.map(h => l.get(h));
            u.inverse = this.createArray(new Float64Array(f), [f.length]);
          }
          if (r) {
            let l = new Map();
            for (let h of o) l.set(h, (l.get(h) || 0) + 1);
            let f = n.map(h => l.get(h));
            u.counts = this.createArray(new Float64Array(f), [f.length]);
          }
          return u;
        }
        async materializeAll() {}
        _reduceAlongAxis(e, a, t) {
          let r = e.shape;
          a = this._normalizeAxis(a, r.length);
          let c = r[a],
            o = r.filter((h, m) => m !== a);
          o.length === 0 && o.push(1);
          let s = r.slice(0, a).reduce((h, m) => h * m, 1),
            n = r.slice(a + 1).reduce((h, m) => h * m, 1),
            i = s * n,
            u = new Float64Array(i),
            l = e.data,
            f = new Float64Array(c);
          for (let h = 0; h < s; h++)
            for (let m = 0; m < n; m++) {
              let d = h * c * n + m;
              for (let g = 0; g < c; g++) f[g] = l[d + g * n];
              u[h * n + m] = t(f);
            }
          return this.createArray(u, o);
        }
        nansum(e, a, t) {
          if (a !== void 0) {
            let c = this._reduceAlongAxis(e, a, o => {
              let s = 0;
              for (let n = 0; n < o.length; n++) Number.isNaN(o[n]) || (s += o[n]);
              return s;
            });
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          let r = 0;
          for (let c = 0; c < e.data.length; c++) Number.isNaN(e.data[c]) || (r += e.data[c]);
          return r;
        }
        nanmean(e, a, t) {
          if (a !== void 0) {
            let o = this._reduceAlongAxis(e, a, s => {
              let n = 0,
                i = 0;
              for (let u = 0; u < s.length; u++) Number.isNaN(s[u]) || ((n += s[u]), i++);
              return i > 0 ? n / i : NaN;
            });
            if (t) {
              let s = [...e.shape];
              return ((s[a] = 1), this.reshape(o, s));
            }
            return o;
          }
          let r = 0,
            c = 0;
          for (let o = 0; o < e.data.length; o++)
            Number.isNaN(e.data[o]) || ((r += e.data[o]), c++);
          return c > 0 ? r / c : NaN;
        }
        nanvar(e, a, t = 0, r) {
          if (a != null) {
            let n = this._reduceAlongAxis(e, a, i => {
              let u = 0,
                l = 0;
              for (let m = 0; m < i.length; m++) Number.isNaN(i[m]) || ((u += i[m]), l++);
              if (l === 0) return NaN;
              let f = u / l,
                h = 0;
              for (let m = 0; m < i.length; m++)
                if (!Number.isNaN(i[m])) {
                  let d = i[m] - f;
                  h += d * d;
                }
              return l > t ? h / (l - t) : NaN;
            });
            if (r) {
              let i = [...e.shape];
              return ((i[a] = 1), this.reshape(n, i));
            }
            return n;
          }
          let c = this.nanmean(e);
          if (Number.isNaN(c)) return NaN;
          let o = 0,
            s = 0;
          for (let n = 0; n < e.data.length; n++)
            if (!Number.isNaN(e.data[n])) {
              let i = e.data[n] - c;
              ((o += i * i), s++);
            }
          return s > t ? o / (s - t) : NaN;
        }
        nanstd(e, a, t = 0, r) {
          if (a != null) {
            let c = this.nanvar(e, a, t),
              o = this.sqrt(c);
            if (r) {
              let s = [...e.shape];
              return ((s[a] = 1), this.reshape(o, s));
            }
            return o;
          }
          return Math.sqrt(this.nanvar(e, null, t));
        }
        nanmin(e, a, t) {
          if (a !== void 0) {
            let c = this._reduceAlongAxis(e, a, o => {
              let s = 1 / 0;
              for (let n = 0; n < o.length; n++) !Number.isNaN(o[n]) && o[n] < s && (s = o[n]);
              return s === 1 / 0 ? NaN : s;
            });
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          let r = 1 / 0;
          for (let c = 0; c < e.data.length; c++)
            !Number.isNaN(e.data[c]) && e.data[c] < r && (r = e.data[c]);
          return r === 1 / 0 ? NaN : r;
        }
        nanmax(e, a, t) {
          if (a !== void 0) {
            let c = this._reduceAlongAxis(e, a, o => {
              let s = -1 / 0;
              for (let n = 0; n < o.length; n++) !Number.isNaN(o[n]) && o[n] > s && (s = o[n]);
              return s === -1 / 0 ? NaN : s;
            });
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          let r = -1 / 0;
          for (let c = 0; c < e.data.length; c++)
            !Number.isNaN(e.data[c]) && e.data[c] > r && (r = e.data[c]);
          return r === -1 / 0 ? NaN : r;
        }
        nanargmin(e, a) {
          if (a !== void 0)
            return this._reduceAlongAxis(e, a, c => {
              let o = -1,
                s = 1 / 0;
              for (let n = 0; n < c.length; n++)
                !Number.isNaN(c[n]) && c[n] < s && ((s = c[n]), (o = n));
              return o;
            });
          let t = -1,
            r = 1 / 0;
          for (let c = 0; c < e.data.length; c++)
            !Number.isNaN(e.data[c]) && e.data[c] < r && ((r = e.data[c]), (t = c));
          return t;
        }
        nanargmax(e, a) {
          if (a !== void 0)
            return this._reduceAlongAxis(e, a, c => {
              let o = -1,
                s = -1 / 0;
              for (let n = 0; n < c.length; n++)
                !Number.isNaN(c[n]) && c[n] > s && ((s = c[n]), (o = n));
              return o;
            });
          let t = -1,
            r = -1 / 0;
          for (let c = 0; c < e.data.length; c++)
            !Number.isNaN(e.data[c]) && e.data[c] > r && ((r = e.data[c]), (t = c));
          return t;
        }
        nanprod(e, a, t) {
          if (a !== void 0) {
            let c = this._reduceAlongAxis(e, a, o => {
              let s = 1;
              for (let n = 0; n < o.length; n++) Number.isNaN(o[n]) || (s *= o[n]);
              return s;
            });
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          let r = 1;
          for (let c = 0; c < e.data.length; c++) Number.isNaN(e.data[c]) || (r *= e.data[c]);
          return r;
        }
        _sortedData(e) {
          return Array.from(e.data).sort((a, t) => a - t);
        }
        _sortedNonNaN(e) {
          return Array.from(e.data)
            .filter(a => !Number.isNaN(a))
            .sort((a, t) => a - t);
        }
        static _medianOfSorted(e) {
          if (e.length === 0) return NaN;
          let a = Math.floor(e.length / 2);
          return e.length % 2 === 0 ? (e[a - 1] + e[a]) / 2 : e[a];
        }
        static _quantileOfSorted(e, a, t = 'linear') {
          if (e.length === 0) return NaN;
          if (e.length === 1) return e[0];
          let r = a * (e.length - 1),
            c = Math.floor(r),
            o = Math.ceil(r);
          switch (t) {
            case 'lower':
              return e[c];
            case 'higher':
              return e[o];
            case 'midpoint':
              return (e[c] + e[o]) / 2;
            case 'nearest':
              return r - c <= o - r ? e[c] : e[o];
            default: {
              let s = r - c;
              return e[c] * (1 - s) + e[o] * s;
            }
          }
        }
        median(e, a, t) {
          if (a !== void 0) {
            let c = this._reduceAlongAxis(e, a, o => {
              let s = Array.from(o).sort((n, i) => n - i);
              return v._medianOfSorted(s);
            });
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          let r = this._sortedData(e);
          return v._medianOfSorted(r);
        }
        percentile(e, a, t, r, c = 'linear') {
          if (a < 0 || a > 100) throw new Error('percentile must be 0-100');
          return this.quantile(e, a / 100, t, r, c);
        }
        quantile(e, a, t, r, c = 'linear') {
          if (a < 0 || a > 1) throw new Error('quantile must be 0-1');
          if (t !== void 0) {
            let s = this._reduceAlongAxis(e, t, n => {
              let i = Array.from(n).sort((u, l) => u - l);
              return v._quantileOfSorted(i, a, c);
            });
            if (r) {
              let n = [...e.shape];
              return ((n[t] = 1), this.reshape(s, n));
            }
            return s;
          }
          let o = this._sortedData(e);
          return v._quantileOfSorted(o, a, c);
        }
        nanmedian(e, a, t) {
          if (a !== void 0) {
            let c = this._reduceAlongAxis(e, a, o => {
              let s = Array.from(o)
                .filter(n => !Number.isNaN(n))
                .sort((n, i) => n - i);
              return v._medianOfSorted(s);
            });
            if (t) {
              let o = [...e.shape];
              return ((o[a] = 1), this.reshape(c, o));
            }
            return c;
          }
          let r = this._sortedNonNaN(e);
          return v._medianOfSorted(r);
        }
        nanpercentile(e, a, t, r, c = 'linear') {
          if (a < 0 || a > 100) throw new Error('percentile must be 0-100');
          if (t !== void 0) {
            let s = this._reduceAlongAxis(e, t, n => {
              let i = Array.from(n)
                .filter(u => !Number.isNaN(u))
                .sort((u, l) => u - l);
              return v._quantileOfSorted(i, a / 100, c);
            });
            if (r) {
              let n = [...e.shape];
              return ((n[t] = 1), this.reshape(s, n));
            }
            return s;
          }
          let o = this._sortedNonNaN(e);
          return v._quantileOfSorted(o, a / 100, c);
        }
        _computeOptimalBins(e, a) {
          let t = [];
          for (let d = 0; d < e.length; d++) Number.isNaN(e[d]) || t.push(e[d]);
          let r = t.length;
          if (r === 0) return 10;
          t.sort((d, g) => d - g);
          let c = t[0],
            s = t[r - 1] - c || 1,
            n = Math.floor(r * 0.25),
            i = Math.floor(r * 0.75),
            u = t[i] - t[n],
            l = 0;
          for (let d = 0; d < r; d++) l += t[d];
          let f = l / r,
            h = 0;
          for (let d = 0; d < r; d++) h += (t[d] - f) ** 2;
          let m = Math.sqrt(h / r);
          switch (a) {
            case 'sqrt':
              return Math.max(1, Math.ceil(Math.sqrt(r)));
            case 'sturges':
              return Math.max(1, Math.ceil(Math.log2(r) + 1));
            case 'rice':
              return Math.max(1, Math.ceil(2 * Math.cbrt(r)));
            case 'scott': {
              let d = 3.5 * m * Math.pow(r, -0.3333333333333333);
              return Math.max(1, Math.ceil(s / (d || 1)));
            }
            case 'fd': {
              let d = 2 * u * Math.pow(r, -0.3333333333333333);
              return Math.max(1, Math.ceil(s / (d || 1)));
            }
            case 'doane': {
              if (r < 3) return 1;
              let d = 0;
              for (let b = 0; b < r; b++) d += ((t[b] - f) / (m || 1)) ** 3;
              d /= r;
              let g = Math.sqrt((6 * (r - 2)) / ((r + 1) * (r + 3)));
              return Math.max(
                1,
                Math.ceil(1 + Math.log2(r) + Math.log2(1 + Math.abs(d) / (g || 1)))
              );
            }
            case 'auto': {
              let d = Math.max(1, Math.ceil(Math.log2(r) + 1)),
                g = 2 * u * Math.pow(r, -1 / 3),
                b = g > 0 ? Math.max(1, Math.ceil(s / g)) : d;
              return Math.max(d, b);
            }
            default:
              return 10;
          }
        }
        histogram(e, a = 10, t, r, c) {
          let o = e.data;
          if (typeof a == 'object' && a !== null && 'data' in a) {
            let m = a,
              d = m.data.length - 1,
              g = new Float64Array(d);
            for (let b = 0; b < o.length; b++) {
              if (Number.isNaN(o[b])) continue;
              let p = o[b],
                _ = -1;
              for (let A = 0; A < d; A++)
                if (A === d - 1) {
                  if (p >= m.data[A] && p <= m.data[A + 1]) {
                    _ = A;
                    break;
                  }
                } else if (p >= m.data[A] && p < m.data[A + 1]) {
                  _ = A;
                  break;
                }
              if (_ >= 0) {
                let A = c ? c.data[b] : 1;
                g[_] += A;
              }
            }
            if (r) {
              let b = 0;
              for (let p = 0; p < d; p++) b += g[p];
              if (b > 0)
                for (let p = 0; p < d; p++) {
                  let _ = m.data[p + 1] - m.data[p];
                  g[p] = g[p] / (b * (_ || 1));
                }
            }
            return {
              hist: this.createArray(g, [d]),
              binEdges: this.createArray(new Float64Array(m.data), [...m.shape]),
            };
          }
          let s;
          typeof a == 'string' ? (s = this._computeOptimalBins(o, a)) : (s = a);
          let n, i;
          if (t != null) [n, i] = t;
          else {
            ((n = 1 / 0), (i = -1 / 0));
            for (let m = 0; m < o.length; m++)
              Number.isNaN(o[m]) || (o[m] < n && (n = o[m]), o[m] > i && (i = o[m]));
          }
          if ((n === 1 / 0 || (n === i && t == null)) && n === 1 / 0)
            return {
              hist: this.createArray(new Float64Array(s), [s]),
              binEdges: this.createArray(new Float64Array(s + 1), [s + 1]),
            };
          let l = (i - n) / s || 1,
            f = new Float64Array(s + 1);
          for (let m = 0; m <= s; m++) f[m] = n + m * l;
          let h = new Float64Array(s);
          for (let m = 0; m < o.length; m++) {
            if (Number.isNaN(o[m]) || (t != null && (o[m] < n || o[m] > i))) continue;
            let d = Math.floor((o[m] - n) / l);
            (d >= s && (d = s - 1), d < 0 && (d = 0));
            let g = c ? c.data[m] : 1;
            h[d] += g;
          }
          if (r) {
            let m = 0;
            for (let d = 0; d < s; d++) m += h[d];
            if (m > 0) for (let d = 0; d < s; d++) h[d] = h[d] / (m * l);
          }
          return { hist: this.createArray(h, [s]), binEdges: this.createArray(f, [s + 1]) };
        }
        histogramBinEdges(e, a = 10) {
          let { binEdges: t } = this.histogram(e, a);
          return t;
        }
        _rngState = Date.now();
        _xorshift() {
          let e = this._rngState;
          return (
            (e ^= e << 13),
            (e ^= e >>> 17),
            (e ^= e << 5),
            (this._rngState = e >>> 0),
            (this._rngState >>> 0) / 4294967295
          );
        }
        seed(e) {
          ((this._rngState = e >>> 0), this._rngState === 0 && (this._rngState = 1));
        }
        rand(e, a = 'float64') {
          let t = e.reduce((c, o) => c * o, 1),
            r = H(a, t);
          for (let c = 0; c < t; c++) r[c] = this._xorshift();
          return this.createArray(r, e, a);
        }
        randn(e, a = 'float64') {
          let t = e.reduce((c, o) => c * o, 1),
            r = H(a, t);
          for (let c = 0; c < t; c += 2) {
            let o = this._xorshift(),
              s = this._xorshift(),
              n = Math.sqrt(-2 * Math.log(o || 1e-10)),
              i = 2 * Math.PI * s;
            ((r[c] = n * Math.cos(i)), c + 1 < t && (r[c + 1] = n * Math.sin(i)));
          }
          return this.createArray(r, e, a);
        }
        randint(e, a, t, r = 'float64') {
          let c = t.reduce((n, i) => n * i, 1),
            o = H(r, c),
            s = a - e;
          for (let n = 0; n < c; n++) o[n] = Math.floor(this._xorshift() * s) + e;
          return this.createArray(o, t, r);
        }
        uniform(e, a, t, r = 'float64') {
          let c = t.reduce((n, i) => n * i, 1),
            o = H(r, c),
            s = a - e;
          for (let n = 0; n < c; n++) o[n] = this._xorshift() * s + e;
          return this.createArray(o, t, r);
        }
        normal(e, a, t, r = 'float64') {
          let o = this.randn(t, r).data;
          for (let s = 0; s < o.length; s++) o[s] = o[s] * a + e;
          return this.createArray(o, t, r);
        }
        shuffle(e) {
          let a = e.data,
            t = e.shape;
          if (t.length === 1)
            for (let r = a.length - 1; r > 0; r--) {
              let c = Math.floor(this._xorshift() * (r + 1)),
                o = a[r];
              ((a[r] = a[c]), (a[c] = o));
            }
          else {
            let r = t.slice(1).reduce((s, n) => s * n, 1),
              c = t[0],
              o = new Float64Array(r);
            for (let s = c - 1; s > 0; s--) {
              let n = Math.floor(this._xorshift() * (s + 1));
              (o.set(a.subarray(s * r, (s + 1) * r)),
                a.copyWithin(s * r, n * r, (n + 1) * r),
                a.set(o, n * r));
            }
          }
        }
        choice(e, a, t = !0, r) {
          let c = e.data.length,
            o = new Float64Array(a);
          if (r !== void 0) {
            let s = Array.isArray(r) ? r : Array.from(r.data);
            if (s.length !== c) throw new Error('p must have same length as arr');
            let n = new Float64Array(c);
            n[0] = s[0];
            for (let i = 1; i < c; i++) n[i] = n[i - 1] + s[i];
            if (t)
              for (let i = 0; i < a; i++) {
                let u = this._xorshift(),
                  l = 0,
                  f = c - 1;
                for (; l < f; ) {
                  let h = (l + f) >>> 1;
                  n[h] <= u ? (l = h + 1) : (f = h);
                }
                o[i] = e.data[l];
              }
            else {
              if (a > c) throw new Error('Cannot sample more than array size without replacement');
              let i = Array.from({ length: c }, (l, f) => f),
                u = [...s];
              for (let l = 0; l < a; l++) {
                let f = 0;
                for (let g = 0; g < i.length; g++) f += u[g];
                let h = this._xorshift() * f,
                  m = 0,
                  d = 0;
                for (let g = 0; g < i.length; g++)
                  if (((m += u[g]), m > h)) {
                    d = g;
                    break;
                  }
                ((o[l] = e.data[i[d]]), i.splice(d, 1), u.splice(d, 1));
              }
            }
          } else if (t)
            for (let s = 0; s < a; s++) {
              let n = Math.floor(this._xorshift() * c);
              o[s] = e.data[n];
            }
          else {
            if (a > c) throw new Error('Cannot sample more than array size without replacement');
            let s = Array.from({ length: c }, (n, i) => i);
            for (let n = 0; n < a; n++) {
              let i = n + Math.floor(this._xorshift() * (c - n));
              (([s[n], s[i]] = [s[i], s[n]]), (o[n] = e.data[s[n]]));
            }
          }
          return this.createArray(o, [a]);
        }
        permutation(e) {
          let a;
          return (
            typeof e == 'number'
              ? (a = this.arange(0, e, 1))
              : (a = this.createArray(new Float64Array(e.data), [...e.shape])),
            this.shuffle(a),
            a
          );
        }
        logicalAnd(e, a) {
          return this._binaryOp(e, a, (t, r) => (t !== 0 && r !== 0 ? 1 : 0));
        }
        logicalOr(e, a) {
          return this._binaryOp(e, a, (t, r) => (t !== 0 || r !== 0 ? 1 : 0));
        }
        logicalNot(e) {
          let a = new Float64Array(e.data.length);
          for (let t = 0; t < a.length; t++) a[t] = e.data[t] === 0 ? 1 : 0;
          return this.createArray(a, [...e.shape]);
        }
        logicalXor(e, a) {
          return this._binaryOp(e, a, (t, r) => ((t !== 0) != (r !== 0) ? 1 : 0));
        }
        _iscloseScalar(e, a, t, r) {
          return e === a
            ? !0
            : Number.isNaN(e) || Number.isNaN(a) || !Number.isFinite(e) || !Number.isFinite(a)
              ? !1
              : Math.abs(e - a) <= r + t * Math.abs(a);
        }
        isclose(e, a, t = 1e-5, r = 1e-8) {
          this._checkSameShape(e, a);
          let c = new Float64Array(e.data.length);
          for (let o = 0; o < c.length; o++)
            c[o] = this._iscloseScalar(e.data[o], a.data[o], t, r) ? 1 : 0;
          return this.createArray(c, [...e.shape]);
        }
        allclose(e, a, t = 1e-5, r = 1e-8) {
          this._checkSameShape(e, a);
          for (let c = 0; c < e.data.length; c++)
            if (!this._iscloseScalar(e.data[c], a.data[c], t, r)) return !1;
          return !0;
        }
        arrayEqual(e, a, t) {
          if (e.shape.length !== a.shape.length) return !1;
          for (let r = 0; r < e.shape.length; r++) if (e.shape[r] !== a.shape[r]) return !1;
          for (let r = 0; r < e.data.length; r++)
            if (
              !(t && Number.isNaN(e.data[r]) && Number.isNaN(a.data[r])) &&
              e.data[r] !== a.data[r]
            )
              return !1;
          return !0;
        }
        bitwiseAnd(e, a) {
          return this._binaryOp(e, a, (t, r) => (t | 0) & (r | 0));
        }
        bitwiseOr(e, a) {
          return this._binaryOp(e, a, (t, r) => t | 0 | (r | 0));
        }
        bitwiseXor(e, a) {
          return this._binaryOp(e, a, (t, r) => (t | 0) ^ (r | 0));
        }
        bitwiseNot(e) {
          let a = new Float64Array(e.data.length);
          for (let t = 0; t < a.length; t++) a[t] = ~(e.data[t] | 0);
          return this.createArray(a, [...e.shape]);
        }
        leftShift(e, a) {
          return this._binaryOp(e, a, (t, r) => (t | 0) << (r | 0));
        }
        rightShift(e, a) {
          return this._binaryOp(e, a, (t, r) => (t | 0) >> (r | 0));
        }
        copy(e, a) {
          let t = a ?? e.dtype ?? 'float64';
          return this.createArray($(t, Array.from(e.data)), [...e.shape], t);
        }
        empty(e, a = 'float64') {
          let t = e.reduce((r, c) => r * c, 1);
          return this.createArray(H(a, t), e, a);
        }
        flip(e, a) {
          if (a === void 0) {
            let n = new Float64Array(e.data.length);
            for (let i = 0; i < n.length; i++) n[i] = e.data[n.length - 1 - i];
            return this.createArray(n, [...e.shape]);
          }
          let t = e.shape.length,
            r = a < 0 ? a + t : a,
            c = new Float64Array(e.data.length),
            o = this._computeStrides(e.shape),
            s = e.data.length;
          for (let n = 0; n < s; n++) {
            let i = n,
              u = [];
            for (let f = 0; f < t; f++) (u.push(Math.floor(i / o[f])), (i = i % o[f]));
            u[r] = e.shape[r] - 1 - u[r];
            let l = 0;
            for (let f = 0; f < t; f++) l += u[f] * o[f];
            c[n] = e.data[l];
          }
          return this.createArray(c, [...e.shape]);
        }
        fliplr(e) {
          if (e.shape.length < 2) throw new Error('fliplr requires at least 2D');
          return this.flip(e, 1);
        }
        flipud(e) {
          if (e.shape.length < 1) throw new Error('flipud requires at least 1D');
          return this.flip(e, 0);
        }
        roll(e, a, t) {
          if (t === void 0) {
            let s = Array.isArray(a) ? a.reduce((l, f) => l + f, 0) : a,
              n = e.data.length,
              i = ((s % n) + n) % n,
              u = new Float64Array(n);
            for (let l = 0; l < n; l++) u[(l + i) % n] = e.data[l];
            return this.createArray(u, [...e.shape]);
          }
          let r = Array.isArray(a) ? a : [a],
            c = Array.isArray(t) ? t : [t];
          if (r.length !== c.length) throw new Error('shift and axis must have the same length');
          let o = e;
          for (let s = 0; s < r.length; s++) {
            let n = o.shape.length,
              i = c[s] < 0 ? c[s] + n : c[s],
              u = o.shape[i],
              l = ((r[s] % u) + u) % u,
              f = new Float64Array(o.data.length),
              h = this._computeStrides(o.shape),
              m = o.data.length;
            for (let d = 0; d < m; d++) {
              let g = d,
                b = [];
              for (let A = 0; A < n; A++) (b.push(Math.floor(g / h[A])), (g = g % h[A]));
              let p = [...b];
              p[i] = (b[i] - l + u) % u;
              let _ = 0;
              for (let A = 0; A < n; A++) _ += p[A] * h[A];
              f[d] = o.data[_];
            }
            o = this.createArray(f, [...o.shape]);
          }
          return o;
        }
        rot90(e, a = 1, t) {
          if (e.shape.length < 2) throw new Error('rot90 requires at least 2D');
          let [r, c] = t
            ? [this._normalizeAxis(t[0], e.shape.length), this._normalizeAxis(t[1], e.shape.length)]
            : [0, 1];
          if (r === c) throw new Error('axes must be different');
          let o = ((a % 4) + 4) % 4;
          if (o === 0) return this.copy(e);
          let s = e;
          for (let n = 0; n < o; n++) {
            let i = Array.from({ length: s.shape.length }, (u, l) => l);
            ((i[r] = c), (i[c] = r), (s = this.transpose(s, i)), (s = this.flip(s, r)));
          }
          return s;
        }
        ravel(e) {
          return this.createArray(new Float64Array(e.data), [e.data.length]);
        }
        _pad1dIndex(e, a, t, r) {
          return r === 'edge'
            ? e < a
              ? 0
              : t - 1
            : r === 'reflect'
              ? e < a
                ? a - e
                : t - 2 - (e - a - t)
              : r === 'symmetric'
                ? e < a
                  ? a - 1 - e
                  : t - 1 - (e - a - t)
                : e < a
                  ? (((t - a + e) % t) + t) % t
                  : (e - a - t) % t;
        }
        pad(e, a, t = 'constant', r = 0) {
          let [c, o] = typeof a == 'number' ? [a, a] : a;
          if (e.shape.length === 1) {
            let s = e.shape[0],
              n = s + c + o,
              i = new Float64Array(n);
            for (let l = 0; l < s; l++) i[c + l] = e.data[l];
            let u = 0;
            if (t === 'mean' || t === 'minimum' || t === 'maximum')
              if (t === 'mean') {
                let l = 0;
                for (let f = 0; f < s; f++) l += e.data[f];
                u = l / s;
              } else if (t === 'minimum') {
                u = e.data[0];
                for (let l = 1; l < s; l++) e.data[l] < u && (u = e.data[l]);
              } else {
                u = e.data[0];
                for (let l = 1; l < s; l++) e.data[l] > u && (u = e.data[l]);
              }
            for (let l = 0; l < c; l++)
              if (t === 'constant') i[l] = r;
              else if (t === 'mean' || t === 'minimum' || t === 'maximum') i[l] = u;
              else if (t === 'linear_ramp') {
                let f = e.data[0],
                  h = c > 1 ? (c - 1 - l) / c : 0;
                i[l] = f + h * (r - f);
              } else {
                let f = this._pad1dIndex(l, c, s, t);
                i[l] = e.data[Math.max(0, Math.min(s - 1, f))];
              }
            for (let l = 0; l < o; l++) {
              let f = c + s + l;
              if (t === 'constant') i[f] = r;
              else if (t === 'mean' || t === 'minimum' || t === 'maximum') i[f] = u;
              else if (t === 'linear_ramp') {
                let h = e.data[s - 1];
                i[f] = h + ((l + 1) / o) * (r - h);
              } else {
                let h = this._pad1dIndex(c + s + l, c, s, t);
                i[f] = e.data[Math.max(0, Math.min(s - 1, h))];
              }
            }
            return this.createArray(i, [n]);
          }
          if (e.shape.length === 2) {
            let [s, n] = e.shape,
              i = s + c + o,
              u = n + c + o,
              l = new Float64Array(i * u),
              f = 0;
            if (t === 'mean' || t === 'minimum' || t === 'maximum')
              if (t === 'mean') {
                let h = 0;
                for (let m = 0; m < e.data.length; m++) h += e.data[m];
                f = h / e.data.length;
              } else if (t === 'minimum') {
                f = e.data[0];
                for (let h = 1; h < e.data.length; h++) e.data[h] < f && (f = e.data[h]);
              } else {
                f = e.data[0];
                for (let h = 1; h < e.data.length; h++) e.data[h] > f && (f = e.data[h]);
              }
            if (t === 'constant') {
              l.fill(r);
              for (let h = 0; h < s; h++)
                for (let m = 0; m < n; m++) l[(h + c) * u + (m + c)] = e.data[h * n + m];
            } else if (t === 'mean' || t === 'minimum' || t === 'maximum') {
              l.fill(f);
              for (let h = 0; h < s; h++)
                for (let m = 0; m < n; m++) l[(h + c) * u + (m + c)] = e.data[h * n + m];
            } else
              for (let h = 0; h < i; h++)
                for (let m = 0; m < u; m++) {
                  let d, g;
                  if (t === 'linear_ramp') {
                    let b = 1,
                      p = 1;
                    (h < c ? (b = (h + 1) / (c + 1)) : h >= c + s && (b = (i - h) / (o + 1)),
                      m < c ? (p = (m + 1) / (c + 1)) : m >= c + n && (p = (u - m) / (o + 1)),
                      (d = Math.max(0, Math.min(s - 1, h - c))),
                      (g = Math.max(0, Math.min(n - 1, m - c))));
                    let _ = e.data[d * n + g];
                    l[h * u + m] = r + (_ - r) * b * p;
                    continue;
                  }
                  (h >= c && h < c + s ? (d = h - c) : (d = this._pad1dIndex(h, c, s, t)),
                    m >= c && m < c + n ? (g = m - c) : (g = this._pad1dIndex(m, c, n, t)),
                    (d = Math.max(0, Math.min(s - 1, d))),
                    (g = Math.max(0, Math.min(n - 1, g))),
                    (l[h * u + m] = e.data[d * n + g]));
                }
            return this.createArray(l, [i, u]);
          }
          throw new Error('pad only supports 1D and 2D arrays');
        }
        columnStack(e) {
          if (e[0].shape.length === 1) {
            let a = e[0].data.length,
              t = e.length,
              r = new Float64Array(a * t);
            for (let c = 0; c < t; c++) {
              if (e[c].data.length !== a) throw new Error('All arrays must have same length');
              for (let o = 0; o < a; o++) r[o * t + c] = e[c].data[o];
            }
            return this.createArray(r, [a, t]);
          }
          return this.hstack(e);
        }
        arraySplit(e, a, t = 0) {
          return this.split(e, a, t);
        }
        putAlongAxis(e, a, t, r) {
          let c = e.shape.length,
            o = r < 0 ? r + c : r,
            s = new Float64Array(e.data),
            n = this._computeStrides(e.shape),
            i = e.shape,
            u = this._computeStrides(a.shape),
            l = a.data.length;
          for (let f = 0; f < l; f++) {
            let h = f,
              m = [];
            for (let b = 0; b < a.shape.length; b++) (m.push(Math.floor(h / u[b])), (h = h % u[b]));
            let d = [...m];
            d[o] = a.data[f];
            let g = 0;
            for (let b = 0; b < c; b++) g += d[b] * n[b];
            s[g] = t.data[f];
          }
          return this.createArray(s, [...i]);
        }
        takeAlongAxis(e, a, t) {
          let r = e.shape.length,
            c = t < 0 ? t + r : t,
            o = this._computeStrides(e.shape),
            s = this._computeStrides(a.shape),
            n = a.data.length,
            i = new Float64Array(n);
          for (let u = 0; u < n; u++) {
            let l = u,
              f = [];
            for (let d = 0; d < a.shape.length; d++) (f.push(Math.floor(l / s[d])), (l = l % s[d]));
            let h = [...f];
            h[c] = a.data[u];
            let m = 0;
            for (let d = 0; d < r; d++) m += h[d] * o[d];
            i[u] = e.data[m];
          }
          return this.createArray(i, [...a.shape]);
        }
        eig(e) {
          if (e.shape.length !== 2) throw new Error('eig requires 2D');
          let [a, t] = e.shape;
          if (a !== t) throw new Error('eig requires square matrix');
          let r = 200,
            c = 1e-10,
            o = new Float64Array(e.data),
            s = new Float64Array(a * a);
          for (let i = 0; i < a; i++) s[i * a + i] = 1;
          for (let i = 0; i < r; i++) {
            let u;
            if (a >= 2) {
              let d = o[(a - 2) * a + (a - 2)],
                g = o[(a - 2) * a + (a - 1)],
                b = o[(a - 1) * a + (a - 2)],
                p = o[(a - 1) * a + (a - 1)],
                _ = (d - p) / 2,
                A = _ >= 0 ? 1 : -1;
              u = p - (A * b * g) / (Math.abs(_) + Math.sqrt(_ * _ + b * g));
            } else u = o[0];
            for (let d = 0; d < a; d++) o[d * a + d] -= u;
            let l = this.qr(this.createArray(new Float64Array(o), [a, a])),
              f = this.matmul(l.r, l.q);
            o = new Float64Array(f.data);
            for (let d = 0; d < a; d++) o[d * a + d] += u;
            let h = this.matmul(this.createArray(s, [a, a]), l.q);
            s = new Float64Array(h.data);
            let m = 0;
            for (let d = 1; d < a; d++) m = Math.max(m, Math.abs(o[d * a + (d - 1)]));
            if (m < c) break;
          }
          let n = new Float64Array(a);
          for (let i = 0; i < a; i++) n[i] = o[i * a + i];
          return { values: this.createArray(n, [a]), vectors: this.createArray(s, [a, a]) };
        }
        eigh(e) {
          return this.eig(e);
        }
        eigvals(e) {
          return this.eig(e).values;
        }
        cholesky(e) {
          if (e.shape.length !== 2) throw new Error('cholesky requires 2D');
          let [a, t] = e.shape;
          if (a !== t) throw new Error('cholesky requires square matrix');
          let r = new Float64Array(a * a);
          for (let c = 0; c < a; c++)
            for (let o = 0; o <= c; o++) {
              let s = 0;
              for (let n = 0; n < o; n++) s += r[c * a + n] * r[o * a + n];
              if (c === o) {
                let n = e.data[c * a + c] - s;
                if (n < 0) throw new Error('Matrix is not positive definite');
                r[c * a + o] = Math.sqrt(n);
              } else r[c * a + o] = (e.data[c * a + o] - s) / r[o * a + o];
            }
          return this.createArray(r, [a, a]);
        }
        lstsq(e, a, t) {
          let r = a,
            c = a.shape.length === 1;
          c && (r = this.createArray(new Float64Array(a.data), [a.data.length, 1]));
          let o = this.transpose(e),
            s = this.matmul(o, e),
            n = this.matmul(o, r),
            i = this.solve(s, n),
            u = c ? this.flatten(i) : i,
            l = this.matmul(e, c ? i : u),
            f = this.subtract(r, l),
            h = 0;
          for (let C = 0; C < f.data.length; C++) h += f.data[C] * f.data[C];
          let m = this.createArray(new Float64Array([h]), [1]),
            g = this.svd(e, !1).s,
            [b, p] = e.shape,
            _ = 2220446049250313e-31,
            A;
          t === null || t === -1
            ? (A = _ * Math.max(b, p))
            : t !== void 0
              ? (A = t)
              : (A = 1e-10 * Math.max(...Array.from(g.data)));
          let w = g.data.length > 0 ? Math.max(...Array.from(g.data)) : 0,
            y = t === null || t === -1 ? A * w : A,
            D = 0;
          for (let C = 0; C < g.data.length; C++) g.data[C] > y && D++;
          return { x: u, residuals: m, rank: D, singularValues: g };
        }
        pinv(e) {
          let { u: a, s: t, vt: r } = this.svd(e, !1),
            [c, o] = e.shape,
            s = t.data.length,
            n = 1e-10 * Math.max(...Array.from(t.data)),
            i = new Float64Array(o * c);
          for (let d = 0; d < s; d++) t.data[d] > n && (i[d * c + d] = 1 / t.data[d]);
          let u = this.transpose(r),
            l = this.transpose(a),
            f = new Float64Array(s * s);
          for (let d = 0; d < s; d++) t.data[d] > n && (f[d * s + d] = 1 / t.data[d]);
          let h = this.matmul(u, this.createArray(f, [s, s]));
          return this.matmul(h, l);
        }
        matrixRank(e, a) {
          let { s: t } = this.svd(e),
            r = a ?? 1e-10 * Math.max(...Array.from(t.data)),
            c = 0;
          for (let o = 0; o < t.data.length; o++) t.data[o] > r && c++;
          return c;
        }
        tensordot(e, a, t = 2) {
          let r, c;
          if (typeof t == 'number') {
            ((r = []), (c = []));
            for (let D = 0; D < t; D++) (r.push(e.shape.length - t + D), c.push(D));
          } else ((r = t[0]), (c = t[1]));
          let o = 1;
          for (let D of r) o *= e.shape[D];
          let s = e.shape.map((D, C) => C).filter(D => !r.includes(D)),
            n = a.shape.map((D, C) => C).filter(D => !c.includes(D)),
            i = s.map(D => e.shape[D]),
            u = n.map(D => a.shape[D]),
            l = [...i, ...u],
            f = i.length === 0 ? 1 : i.reduce((D, C) => D * C, 1),
            h = u.length === 0 ? 1 : u.reduce((D, C) => D * C, 1),
            m = [...s, ...r],
            d = m.map(D => e.shape[D]),
            g = this._transposeGeneral(e, m, d),
            b = [...c, ...n],
            p = b.map(D => a.shape[D]),
            _ = this._transposeGeneral(a, b, p),
            A = this.createArray(g.data, [f, o]),
            w = this.createArray(_.data, [o, h]),
            y = this.matmul(A, w);
          return l.length === 0
            ? this.createArray(new Float64Array([y.data[0]]), [])
            : this.createArray(y.data, l);
        }
        vdot(e, a) {
          let t = e.data,
            r = a.data;
          if (t.length !== r.length) throw new Error('vdot requires same number of elements');
          let c = 0;
          for (let o = 0; o < t.length; o++) c += t[o] * r[o];
          return c;
        }
        _fftCore(e, a, t) {
          let r = e.length;
          return r === 0
            ? { real: new Float64Array(0), imag: new Float64Array(0) }
            : r === 1
              ? { real: new Float64Array([e[0]]), imag: new Float64Array([a[0]]) }
              : (r & (r - 1)) === 0
                ? this._fftRadix2(e, a, t)
                : this._fftBluestein(e, a, t);
        }
        _fftRadix2(e, a, t) {
          let r = e.length,
            c = new Float64Array(e),
            o = new Float64Array(a),
            s = 0;
          for (let i = 0; i < r; i++) {
            if (s > i) {
              let l = c[i];
              ((c[i] = c[s]), (c[s] = l), (l = o[i]), (o[i] = o[s]), (o[s] = l));
            }
            let u = r >> 1;
            for (; u >= 1 && s >= u; ) ((s -= u), (u >>= 1));
            s += u;
          }
          let n = t ? 1 : -1;
          for (let i = 2; i <= r; i *= 2) {
            let u = i / 2,
              l = (n * 2 * Math.PI) / i,
              f = Math.cos(l),
              h = Math.sin(l);
            for (let m = 0; m < r; m += i) {
              let d = 1,
                g = 0;
              for (let b = 0; b < u; b++) {
                let p = m + b,
                  _ = m + b + u,
                  A = d * c[_] - g * o[_],
                  w = d * o[_] + g * c[_];
                ((c[_] = c[p] - A), (o[_] = o[p] - w), (c[p] += A), (o[p] += w));
                let y = d * f - g * h;
                ((g = d * h + g * f), (d = y));
              }
            }
          }
          if (t) for (let i = 0; i < r; i++) ((c[i] /= r), (o[i] /= r));
          return { real: c, imag: o };
        }
        _fftBluestein(e, a, t) {
          let r = e.length,
            c = 1;
          for (; c < 2 * r - 1; ) c *= 2;
          let o = t ? 1 : -1,
            s = new Float64Array(r),
            n = new Float64Array(r);
          for (let A = 0; A < r; A++) {
            let w = (o * Math.PI * A * A) / r;
            ((s[A] = Math.cos(w)), (n[A] = Math.sin(w)));
          }
          let i = new Float64Array(c),
            u = new Float64Array(c);
          for (let A = 0; A < r; A++)
            ((i[A] = e[A] * s[A] + a[A] * n[A]), (u[A] = a[A] * s[A] - e[A] * n[A]));
          let l = new Float64Array(c),
            f = new Float64Array(c);
          ((l[0] = s[0]), (f[0] = n[0]));
          for (let A = 1; A < r; A++)
            ((l[A] = s[A]), (f[A] = n[A]), (l[c - A] = s[A]), (f[c - A] = n[A]));
          let h = this._fftRadix2(i, u, !1),
            m = this._fftRadix2(l, f, !1),
            d = new Float64Array(c),
            g = new Float64Array(c);
          for (let A = 0; A < c; A++)
            ((d[A] = h.real[A] * m.real[A] - h.imag[A] * m.imag[A]),
              (g[A] = h.real[A] * m.imag[A] + h.imag[A] * m.real[A]));
          let b = this._fftRadix2(d, g, !0),
            p = new Float64Array(r),
            _ = new Float64Array(r);
          for (let A = 0; A < r; A++)
            ((p[A] = b.real[A] * s[A] + b.imag[A] * n[A]),
              (_[A] = b.imag[A] * s[A] - b.real[A] * n[A]));
          if (t) for (let A = 0; A < r; A++) ((p[A] /= r), (_[A] /= r));
          return { real: p, imag: _ };
        }
        fft(e) {
          let a = e.data.length,
            t = this._fftCore(new Float64Array(e.data), new Float64Array(a), !1);
          return { real: this.createArray(t.real, [a]), imag: this.createArray(t.imag, [a]) };
        }
        ifft(e, a) {
          let t = e.data.length,
            r = this._fftCore(new Float64Array(e.data), new Float64Array(a.data), !0);
          return { real: this.createArray(r.real, [t]), imag: this.createArray(r.imag, [t]) };
        }
        fft2(e) {
          if (e.shape.length !== 2) throw new Error('fft2 requires 2D');
          let [a, t] = e.shape,
            r = new Float64Array(e.data),
            c = new Float64Array(a * t);
          for (let o = 0; o < a; o++) {
            let s = r.slice(o * t, (o + 1) * t),
              n = c.slice(o * t, (o + 1) * t),
              i = this._fftCore(s, n, !1);
            (r.set(i.real, o * t), c.set(i.imag, o * t));
          }
          for (let o = 0; o < t; o++) {
            let s = new Float64Array(a),
              n = new Float64Array(a);
            for (let u = 0; u < a; u++) ((s[u] = r[u * t + o]), (n[u] = c[u * t + o]));
            let i = this._fftCore(s, n, !1);
            for (let u = 0; u < a; u++) ((r[u * t + o] = i.real[u]), (c[u * t + o] = i.imag[u]));
          }
          return { real: this.createArray(r, [a, t]), imag: this.createArray(c, [a, t]) };
        }
        ifft2(e, a) {
          if (e.shape.length !== 2) throw new Error('ifft2 requires 2D');
          let [t, r] = e.shape,
            c = new Float64Array(e.data),
            o = new Float64Array(a.data);
          for (let s = 0; s < t; s++) {
            let n = c.slice(s * r, (s + 1) * r),
              i = o.slice(s * r, (s + 1) * r),
              u = this._fftCore(n, i, !0);
            (c.set(u.real, s * r), o.set(u.imag, s * r));
          }
          for (let s = 0; s < r; s++) {
            let n = new Float64Array(t),
              i = new Float64Array(t);
            for (let l = 0; l < t; l++) ((n[l] = c[l * r + s]), (i[l] = o[l * r + s]));
            let u = this._fftCore(n, i, !0);
            for (let l = 0; l < t; l++) ((c[l * r + s] = u.real[l]), (o[l * r + s] = u.imag[l]));
          }
          return { real: this.createArray(c, [t, r]), imag: this.createArray(o, [t, r]) };
        }
        rfft(e) {
          let a = e.data.length,
            t = this.fft(e),
            r = Math.floor(a / 2) + 1;
          return {
            real: this.createArray(t.real.data.slice(0, r), [r]),
            imag: this.createArray(t.imag.data.slice(0, r), [r]),
          };
        }
        irfft(e, a, t) {
          let r = t ?? (e.data.length - 1) * 2,
            c = new Float64Array(r),
            o = new Float64Array(r);
          for (let n = 0; n < e.data.length; n++) ((c[n] = e.data[n]), (o[n] = a.data[n]));
          for (let n = e.data.length; n < r; n++) {
            let i = r - n;
            ((c[n] = c[i]), (o[n] = -o[i]));
          }
          let s = this._fftCore(c, o, !0);
          return this.createArray(s.real, [r]);
        }
        fftfreq(e, a = 1) {
          let t = new Float64Array(e),
            r = Math.floor((e - 1) / 2) + 1;
          for (let c = 0; c < r; c++) t[c] = c / (e * a);
          for (let c = r; c < e; c++) t[c] = (c - e) / (e * a);
          return this.createArray(t, [e]);
        }
        rfftfreq(e, a = 1) {
          let t = Math.floor(e / 2) + 1,
            r = new Float64Array(t);
          for (let c = 0; c < t; c++) r[c] = c / (e * a);
          return this.createArray(r, [t]);
        }
        fftshift(e) {
          let a = e.data.length,
            t = Math.floor(a / 2),
            r = new Float64Array(a);
          for (let c = 0; c < a; c++) r[c] = e.data[(c - t + a) % a];
          return this.createArray(r, [...e.shape]);
        }
        ifftshift(e) {
          let a = e.data.length,
            t = Math.ceil(a / 2),
            r = new Float64Array(a);
          for (let c = 0; c < a; c++) r[c] = e.data[(c - t + a) % a];
          return this.createArray(r, [...e.shape]);
        }
        _boxMullerSingle() {
          let e = this._xorshift() || 1e-10,
            a = this._xorshift();
          return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * a);
        }
        _gammaRandom(e) {
          if (e < 1) return this._gammaRandom(e + 1) * Math.pow(this._xorshift() || 1e-10, 1 / e);
          let a = e - 1 / 3,
            t = 1 / Math.sqrt(9 * a);
          for (;;) {
            let r, c;
            do ((r = this._boxMullerSingle()), (c = 1 + t * r));
            while (c <= 0);
            c = c * c * c;
            let o = this._xorshift();
            if (
              o < 1 - 0.0331 * (r * r) * (r * r) ||
              Math.log(o) < 0.5 * r * r + a * (1 - c + Math.log(c))
            )
              return a * c;
          }
        }
        exponential(e, a) {
          let t = a.reduce((c, o) => c * o, 1),
            r = new Float64Array(t);
          for (let c = 0; c < t; c++) r[c] = -e * Math.log(this._xorshift() || 1e-10);
          return this.createArray(r, a);
        }
        poisson(e, a) {
          let t = a.reduce((o, s) => o * s, 1),
            r = new Float64Array(t),
            c = Math.exp(-e);
          for (let o = 0; o < t; o++) {
            let s = 0,
              n = 1;
            do (s++, (n *= this._xorshift()));
            while (n > c);
            r[o] = s - 1;
          }
          return this.createArray(r, a);
        }
        binomial(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) {
            let s = 0;
            for (let n = 0; n < e; n++) this._xorshift() < a && s++;
            c[o] = s;
          }
          return this.createArray(c, t);
        }
        beta(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) {
            let s = this._gammaRandom(e),
              n = this._gammaRandom(a);
            c[o] = s / (s + n);
          }
          return this.createArray(c, t);
        }
        gamma(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) c[o] = this._gammaRandom(e) * a;
          return this.createArray(c, t);
        }
        lognormal(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) c[o] = Math.exp(e + a * this._boxMullerSingle());
          return this.createArray(c, t);
        }
        chisquare(e, a) {
          return this.gamma(e / 2, 2, a);
        }
        standardT(e, a) {
          let t = a.reduce((c, o) => c * o, 1),
            r = new Float64Array(t);
          for (let c = 0; c < t; c++) {
            let o = this._boxMullerSingle(),
              s = this._gammaRandom(e / 2) * 2;
            r[c] = o / Math.sqrt(s / e);
          }
          return this.createArray(r, a);
        }
        multivariateNormal(e, a, t = 1) {
          let r = e.data.length,
            c = this.cholesky(a),
            o = new Float64Array(t * r);
          for (let s = 0; s < t; s++) {
            let n = new Float64Array(r);
            for (let i = 0; i < r; i++) n[i] = this._boxMullerSingle();
            for (let i = 0; i < r; i++) {
              let u = e.data[i];
              for (let l = 0; l <= i; l++) u += c.data[i * r + l] * n[l];
              o[s * r + i] = u;
            }
          }
          return this.createArray(o, t === 1 ? [r] : [t, r]);
        }
        geometric(e, a) {
          let t = a.reduce((o, s) => o * s, 1),
            r = new Float64Array(t),
            c = Math.log(1 - e);
          for (let o = 0; o < t; o++)
            r[o] = Math.floor(Math.log(this._xorshift() || 1e-10) / c) + 1;
          return this.createArray(r, a);
        }
        weibull(e, a) {
          let t = a.reduce((c, o) => c * o, 1),
            r = new Float64Array(t);
          for (let c = 0; c < t; c++) r[c] = Math.pow(-Math.log(this._xorshift() || 1e-10), 1 / e);
          return this.createArray(r, a);
        }
        standardNormal(e) {
          return this.randn(e);
        }
        standardCauchy(e) {
          let a = e.reduce((r, c) => r * c, 1),
            t = new Float64Array(a);
          for (let r = 0; r < a; r++) t[r] = Math.tan(Math.PI * (this._xorshift() - 0.5));
          return this.createArray(t, e);
        }
        multinomial(e, a, t = 1) {
          let r = a.length,
            c = new Float64Array(t * r);
          for (let o = 0; o < t; o++) {
            let s = e,
              n = 1;
            for (let i = 0; i < r - 1; i++) {
              let u = n > 0 ? a[i] / n : 0,
                l = 0;
              for (let f = 0; f < s; f++) this._xorshift() < u && l++;
              ((c[o * r + i] = l), (s -= l), (n -= a[i]));
            }
            c[o * r + (r - 1)] = s;
          }
          return this.createArray(c, t === 1 ? [r] : [t, r]);
        }
        dirichlet(e, a = 1) {
          let t = e.length,
            r = new Float64Array(a * t);
          for (let c = 0; c < a; c++) {
            let o = 0;
            for (let s = 0; s < t; s++) {
              let n = this._gammaRandom(e[s]);
              ((r[c * t + s] = n), (o += n));
            }
            for (let s = 0; s < t; s++) r[c * t + s] /= o;
          }
          return this.createArray(r, a === 1 ? [t] : [a, t]);
        }
        random(e) {
          return this.rand(e);
        }
        f(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) {
            let s = this._gammaRandom(e / 2) * 2,
              n = this._gammaRandom(a / 2) * 2;
            c[o] = s / e / (n / a);
          }
          return this.createArray(c, t);
        }
        hypergeometric(e, a, t, r) {
          let c = r.reduce((s, n) => s * n, 1),
            o = new Float64Array(c);
          for (let s = 0; s < c; s++) {
            let n = e,
              i = a,
              u = 0;
            for (let l = 0; l < t; l++) {
              let f = n + i;
              this._xorshift() < n / f ? (u++, n--) : i--;
            }
            o[s] = u;
          }
          return this.createArray(o, r);
        }
        negativeBinomial(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) {
            let s = (this._gammaRandom(e) * (1 - a)) / a,
              n = Math.exp(-s),
              i = 0,
              u = 1;
            do (i++, (u *= this._xorshift()));
            while (u > n && s > 0);
            c[o] = s > 0 ? i - 1 : 0;
          }
          return this.createArray(c, t);
        }
        pareto(e, a) {
          let t = a.reduce((c, o) => c * o, 1),
            r = new Float64Array(t);
          for (let c = 0; c < t; c++) r[c] = Math.pow(1 - this._xorshift() || 1e-10, -1 / e) - 1;
          return this.createArray(r, a);
        }
        rayleigh(e, a) {
          let t = a.reduce((c, o) => c * o, 1),
            r = new Float64Array(t);
          for (let c = 0; c < t; c++)
            r[c] = e * Math.sqrt(-2 * Math.log(this._xorshift() || 1e-10));
          return this.createArray(r, a);
        }
        triangular(e, a, t, r) {
          let c = r.reduce((n, i) => n * i, 1),
            o = new Float64Array(c),
            s = (a - e) / (t - e);
          for (let n = 0; n < c; n++) {
            let i = this._xorshift();
            i < s
              ? (o[n] = e + Math.sqrt(i * (t - e) * (a - e)))
              : (o[n] = t - Math.sqrt((1 - i) * (t - e) * (t - a)));
          }
          return this.createArray(o, r);
        }
        vonmises(e, a, t) {
          let r = t.reduce((i, u) => i * u, 1),
            c = new Float64Array(r),
            o = 1 + Math.sqrt(1 + 4 * a * a),
            s = (o - Math.sqrt(2 * o)) / (2 * a),
            n = (1 + s * s) / (2 * s);
          for (let i = 0; i < r; i++) {
            let u;
            for (;;) {
              let f = this._xorshift(),
                h = Math.cos(Math.PI * f);
              u = (1 + n * h) / (n + h);
              let m = a * (n - u),
                d = this._xorshift();
              if (m * (2 - m) > d || Math.log(m / d) + 1 >= m) break;
            }
            let l = this._xorshift();
            c[i] = e + (l > 0.5 ? 1 : -1) * Math.acos(u);
          }
          return this.createArray(c, t);
        }
        wald(e, a, t) {
          let r = t.reduce((o, s) => o * s, 1),
            c = new Float64Array(r);
          for (let o = 0; o < r; o++) {
            let s = this._boxMullerSingle(),
              n = s * s,
              i =
                e +
                (e * e * n) / (2 * a) -
                (e / (2 * a)) * Math.sqrt(4 * e * a * n + e * e * n * n),
              u = this._xorshift();
            c[o] = u <= e / (e + i) ? i : (e * e) / i;
          }
          return this.createArray(c, t);
        }
        zipf(e, a) {
          let t = a.reduce((s, n) => s * n, 1),
            r = new Float64Array(t),
            c = e - 1,
            o = Math.pow(2, c);
          for (let s = 0; s < t; s++) {
            let n;
            for (;;) {
              let i = 1 - this._xorshift(),
                u = this._xorshift();
              if (((n = Math.floor(Math.pow(i, -1 / c))), n < 1)) continue;
              let l = Math.pow(1 + 1 / n, c);
              if ((u * n * (l - 1)) / (o - 1) <= l / o) break;
            }
            r[s] = n;
          }
          return this.createArray(r, a);
        }
        average(e, a, t, r) {
          if (t !== void 0) {
            let s;
            if (!a) s = this.mean(e, t);
            else {
              let n = this.multiply(e, a),
                i = this.sum(n, t),
                u = this.sum(a, t);
              s = this.divide(i, u);
            }
            if (r) {
              let n = [...e.shape];
              return ((n[t] = 1), this.reshape(s, n));
            }
            return s;
          }
          if (!a) return this.mean(e);
          if (e.data.length !== a.data.length)
            throw new Error('arr and weights must have same length');
          let c = 0,
            o = 0;
          for (let s = 0; s < e.data.length; s++) ((c += a.data[s]), (o += e.data[s] * a.data[s]));
          return o / c;
        }
        ptp(e, a, t) {
          if (a === void 0) return this.max(e) - this.min(e);
          a = this._normalizeAxis(a, e.shape.length);
          let r = this.maxAxis(e, a),
            c = this.minAxis(e, a),
            o = this.subtract(r, c);
          if (t) {
            let s = [...e.shape];
            return ((s[a] = 1), this.reshape(o, s));
          }
          return o;
        }
        digitize(e, a, t = !1) {
          let r = new Float64Array(e.data.length);
          for (let c = 0; c < e.data.length; c++) {
            let o = e.data[c],
              s = 0,
              n = a.data.length;
            for (; s < n; ) {
              let i = (s + n) >> 1;
              (t ? a.data[i] < o : a.data[i] <= o) ? (s = i + 1) : (n = i);
            }
            r[c] = s;
          }
          return this.createArray(r, [...e.shape]);
        }
        nanquantile(e, a, t, r, c = 'linear') {
          if (t !== void 0) {
            let s = this._reduceAlongAxis(e, t, n => {
              let i = Array.from(n).filter(l => !isNaN(l));
              if (i.length === 0) return NaN;
              let u = i.sort((l, f) => l - f);
              return v._quantileOfSorted(u, a, c);
            });
            if (r) {
              let n = [...e.shape];
              return ((n[t] = 1), this.reshape(s, n));
            }
            return s;
          }
          let o = this._sortedNonNaN(e);
          return v._quantileOfSorted(o, a, c);
        }
        nancumsum(e, a) {
          if (a !== void 0) {
            let c = this.nanToNum(e, 0, 0, 0);
            return this.cumsum(c, a);
          }
          let t = new Float64Array(e.data.length),
            r = 0;
          for (let c = 0; c < e.data.length; c++)
            (isNaN(e.data[c]) || (r += e.data[c]), (t[c] = r));
          return this.createArray(t, [...e.shape]);
        }
        nancumprod(e, a) {
          if (a !== void 0) {
            let c = this.nanToNum(e, 1, 1, 1);
            return this.cumprod(c, a);
          }
          let t = new Float64Array(e.data.length),
            r = 1;
          for (let c = 0; c < e.data.length; c++)
            (isNaN(e.data[c]) || (r *= e.data[c]), (t[c] = r));
          return this.createArray(t, [...e.shape]);
        }
        uniqueCounts(e) {
          let a = Array.from(e.data).sort((o, s) => o - s),
            t = [],
            r = [],
            c = 0;
          for (; c < a.length; ) {
            let o = a[c],
              s = 0;
            for (; c < a.length && a[c] === o; ) (s++, c++);
            (t.push(o), r.push(s));
          }
          return {
            values: this.createArray(new Float64Array(t), [t.length]),
            counts: this.createArray(new Float64Array(r), [r.length]),
          };
        }
        uniqueInverse(e) {
          let a = Array.from(new Set(Array.from(e.data))).sort((c, o) => c - o),
            t = new Map();
          a.forEach((c, o) => t.set(c, o));
          let r = new Float64Array(e.data.length);
          for (let c = 0; c < e.data.length; c++) r[c] = t.get(e.data[c]);
          return {
            values: this.createArray(new Float64Array(a), [a.length]),
            inverse: this.createArray(r, [...e.shape]),
          };
        }
        histogram2d(e, a, t = 10, r, c, o) {
          let s = e.data.length,
            n,
            i,
            u,
            l;
          r != null
            ? ([[n, i], [u, l]] = r)
            : ((n = this.min(e)), (i = this.max(e)), (u = this.min(a)), (l = this.max(a)));
          let f = new Float64Array(t + 1),
            h = new Float64Array(t + 1),
            m = i - n || 1,
            d = l - u || 1,
            g = m / t,
            b = d / t;
          for (let _ = 0; _ <= t; _++) ((f[_] = n + _ * g), (h[_] = u + _ * b));
          let p = new Float64Array(t * t);
          for (let _ = 0; _ < s; _++) {
            let A = e.data[_],
              w = a.data[_];
            if (
              Number.isNaN(A) ||
              Number.isNaN(w) ||
              (r != null && (A < n || A > i || w < u || w > l))
            )
              continue;
            let y = Math.floor((A - n) / g),
              D = Math.floor((w - u) / b);
            ((y = Math.min(y, t - 1)),
              (D = Math.min(D, t - 1)),
              (y = Math.max(y, 0)),
              (D = Math.max(D, 0)));
            let C = o ? o.data[_] : 1;
            p[y * t + D] += C;
          }
          if (c) {
            let _ = 0;
            for (let A = 0; A < t * t; A++) _ += p[A];
            if (_ > 0) {
              let A = g * b;
              for (let w = 0; w < t * t; w++) p[w] = p[w] / (_ * A);
            }
          }
          return {
            hist: this.createArray(p, [t, t]),
            xEdges: this.createArray(f, [t + 1]),
            yEdges: this.createArray(h, [t + 1]),
          };
        }
        rint(e) {
          let a = new Float64Array(e.data.length);
          for (let t = 0; t < a.length; t++) a[t] = se(e.data[t]);
          return this.createArray(a, [...e.shape]);
        }
        around(e, a = 0) {
          let t = Math.pow(10, a),
            r = new Float64Array(e.data.length);
          for (let c = 0; c < r.length; c++) r[c] = se(e.data[c] * t) / t;
          return this.createArray(r, [...e.shape]);
        }
        polyder(e, a = 1) {
          let t = Array.from(e.data);
          for (let r = 0; r < a; r++) {
            let c = t.length - 1;
            if (c < 1) return this.createArray(new Float64Array([0]), [1]);
            let o = [];
            for (let s = 0; s < c; s++) o.push(t[s] * (c - s));
            t = o;
          }
          return this.createArray(new Float64Array(t), [t.length]);
        }
        polyint(e, a = 1, t = 0) {
          let r = Array.from(e.data);
          for (let c = 0; c < a; c++) {
            let o = r.length,
              s = [];
            for (let n = 0; n < o; n++) s.push(r[n] / (o - n));
            (s.push(t), (r = s));
          }
          return this.createArray(new Float64Array(r), [r.length]);
        }
        polydiv(e, a) {
          let t = Array.from(e.data),
            r = Array.from(a.data),
            c = t.length - r.length + 1;
          if (c <= 0)
            return {
              q: this.createArray(new Float64Array([0]), [1]),
              r: this.createArray(new Float64Array(t), [t.length]),
            };
          let o = [];
          for (let n = 0; n < c; n++) {
            let i = t[n] / r[0];
            o.push(i);
            for (let u = 0; u < r.length; u++) t[n + u] -= i * r[u];
          }
          let s = t.slice(c);
          for (; s.length > 1 && Math.abs(s[0]) < 1e-15; ) s.shift();
          return {
            q: this.createArray(new Float64Array(o), [o.length]),
            r: this.createArray(new Float64Array(s), [s.length]),
          };
        }
        polysub(e, a) {
          let t = Math.max(e.data.length, a.data.length),
            r = new Float64Array(t),
            c = t - e.data.length,
            o = t - a.data.length;
          for (let s = 0; s < e.data.length; s++) r[c + s] += e.data[s];
          for (let s = 0; s < a.data.length; s++) r[o + s] -= a.data[s];
          return this.createArray(r, [t]);
        }
        trapezoid(e, a, t = 1) {
          let r = e.data.length;
          if (r < 2) return 0;
          let c = 0;
          if (a)
            for (let o = 0; o < r - 1; o++)
              c += 0.5 * (e.data[o] + e.data[o + 1]) * (a.data[o + 1] - a.data[o]);
          else for (let o = 0; o < r - 1; o++) c += 0.5 * (e.data[o] + e.data[o + 1]) * t;
          return c;
        }
        trapz(e, a, t) {
          return this.trapezoid(e, a, t);
        }
        unravelIndex(e, a) {
          let t = typeof e == 'number' ? [e] : Array.from(e.data),
            r = a.length,
            c = [];
          for (let o = 0; o < r; o++)
            c.push(this.createArray(new Float64Array(t.length), [t.length]));
          for (let o = 0; o < t.length; o++) {
            let s = t[o];
            for (let n = r - 1; n >= 0; n--)
              ((c[n].data[o] = s % a[n]), (s = Math.floor(s / a[n])));
          }
          return c;
        }
        ravelMultiIndex(e, a) {
          let t = e[0].data.length,
            r = new Float64Array(t);
          for (let c = 0; c < t; c++) {
            let o = 0,
              s = 1;
            for (let n = a.length - 1; n >= 0; n--) ((o += e[n].data[c] * s), (s *= a[n]));
            r[c] = o;
          }
          return this.createArray(r, [t]);
        }
        gcd(e, a) {
          return this._binaryOp(e, a, (t, r) => {
            for (t = Math.abs(Math.round(t)), r = Math.abs(Math.round(r)); r; ) {
              let c = r;
              ((r = t % r), (t = c));
            }
            return t;
          });
        }
        lcm(e, a) {
          return this._binaryOp(e, a, (t, r) => {
            if (((t = Math.abs(Math.round(t))), (r = Math.abs(Math.round(r))), t === 0 || r === 0))
              return 0;
            let c = t,
              o = r;
            for (; o; ) {
              let s = o;
              ((o = c % o), (c = s));
            }
            return (t / c) * r;
          });
        }
        tri(e, a, t = 0, r = 'float64') {
          let c = a ?? e,
            o = H(r, e * c);
          for (let s = 0; s < e; s++)
            for (let n = 0; n <= s + t && n < c; n++) n >= 0 && (o[s * c + n] = 1);
          return this.createArray(o, [e, c], r);
        }
        diagflat(e, a = 0) {
          let t = this.flatten(e);
          return this.diag(t, a);
        }
        block(e) {
          if (e.every(r => !Array.isArray(r))) return this.concatenate(e);
          let t = [];
          for (let r of e) Array.isArray(r) ? t.push(this.hstack(r)) : t.push(r);
          return this.vstack(t);
        }
        fillDiagonal(e, a, t = !1) {
          if (e.shape.length < 2) throw new Error('fillDiagonal requires at least a 2-d array');
          let r = new Float64Array(e.data),
            c = e.shape[0],
            o = e.shape[1],
            s = o + 1;
          if (t)
            for (let n = 0; n < c; n++) {
              let i = n % o,
                u = n * o + i;
              u < r.length && (r[u] = a);
            }
          else {
            let n = Math.min(c, o);
            for (let i = 0; i < n; i++) r[i * s] = a;
          }
          return this.createArray(r, [...e.shape]);
        }
        indices(e, a = 'float64') {
          let t = e.length,
            r = e.reduce((s, n) => s * n, 1),
            c = [],
            o = new Array(t);
          o[t - 1] = 1;
          for (let s = t - 2; s >= 0; s--) o[s] = o[s + 1] * e[s + 1];
          for (let s = 0; s < t; s++) {
            let n = H(a, r);
            for (let i = 0; i < r; i++) n[i] = Math.floor(i / o[s]) % e[s];
            c.push(this.createArray(n, [...e], a));
          }
          return c;
        }
        diagIndices(e, a = 2) {
          let t = new Float64Array(e);
          for (let c = 0; c < e; c++) t[c] = c;
          let r = [];
          for (let c = 0; c < a; c++) r.push(this.createArray(new Float64Array(t), [e]));
          return r;
        }
        trilIndices(e, a = 0, t) {
          let r = t ?? e,
            c = [],
            o = [];
          for (let s = 0; s < e; s++)
            for (let n = 0; n < r; n++) n <= s + a && (c.push(s), o.push(n));
          return [
            this.createArray(new Float64Array(c), [c.length]),
            this.createArray(new Float64Array(o), [o.length]),
          ];
        }
        triuIndices(e, a = 0, t) {
          let r = t ?? e,
            c = [],
            o = [];
          for (let s = 0; s < e; s++)
            for (let n = 0; n < r; n++) n >= s + a && (c.push(s), o.push(n));
          return [
            this.createArray(new Float64Array(c), [c.length]),
            this.createArray(new Float64Array(o), [o.length]),
          ];
        }
        bartlett(e) {
          if (e <= 0) return this.createArray(new Float64Array(0), [0]);
          if (e === 1) return this.createArray(new Float64Array([1]), [1]);
          let a = new Float64Array(e);
          for (let t = 0; t < e; t++) a[t] = 1 - Math.abs((2 * t) / (e - 1) - 1);
          return this.createArray(a, [e]);
        }
        blackman(e) {
          if (e <= 0) return this.createArray(new Float64Array(0), [0]);
          if (e === 1) return this.createArray(new Float64Array([1]), [1]);
          let a = new Float64Array(e);
          for (let t = 0; t < e; t++)
            a[t] =
              0.42 -
              0.5 * Math.cos((2 * Math.PI * t) / (e - 1)) +
              0.08 * Math.cos((4 * Math.PI * t) / (e - 1));
          return this.createArray(a, [e]);
        }
        hamming(e) {
          if (e <= 0) return this.createArray(new Float64Array(0), [0]);
          if (e === 1) return this.createArray(new Float64Array([1]), [1]);
          let a = new Float64Array(e);
          for (let t = 0; t < e; t++) a[t] = 0.54 - 0.46 * Math.cos((2 * Math.PI * t) / (e - 1));
          return this.createArray(a, [e]);
        }
        hanning(e) {
          if (e <= 0) return this.createArray(new Float64Array(0), [0]);
          if (e === 1) return this.createArray(new Float64Array([1]), [1]);
          let a = new Float64Array(e);
          for (let t = 0; t < e; t++) a[t] = 0.5 * (1 - Math.cos((2 * Math.PI * t) / (e - 1)));
          return this.createArray(a, [e]);
        }
        kaiser(e, a) {
          if (e <= 0) return this.createArray(new Float64Array(0), [0]);
          if (e === 1) return this.createArray(new Float64Array([1]), [1]);
          let t = new Float64Array(e),
            r = this._besselI0(a);
          for (let c = 0; c < e; c++) {
            let o = (2 * c) / (e - 1) - 1;
            t[c] = this._besselI0(a * Math.sqrt(1 - o * o)) / r;
          }
          return this.createArray(t, [e]);
        }
        _besselI0(e) {
          let a = 1,
            t = 1,
            r = e / 2;
          for (let c = 1; c <= 50; c++) {
            t *= r / c;
            let o = t * t;
            if (((a += o), o < a * 1e-16)) break;
          }
          return a;
        }
        packbits(e, a, t = 'big') {
          let r = a !== void 0 ? e : this.flatten(e),
            c = r.data.length,
            o = Math.ceil(c / 8),
            s = new Uint8Array(o);
          for (let n = 0; n < c; n++) {
            let i = Math.floor(n / 8),
              u = n % 8;
            r.data[n] && (t === 'big' ? (s[i] |= 1 << (7 - u)) : (s[i] |= 1 << u));
          }
          return this.createArray(s, [o], 'uint8');
        }
        unpackbits(e, a, t, r = 'big') {
          let c = e.data.length,
            o = t ?? c * 8,
            s = new Uint8Array(o),
            n = 0;
          for (let i = 0; i < c && n < o; i++)
            for (let u = 0; u < 8 && n < o; u++)
              (r === 'big' ? (s[n] = (e.data[i] >> (7 - u)) & 1) : (s[n] = (e.data[i] >> u) & 1),
                n++);
          return this.createArray(s, [o], 'uint8');
        }
        eigvalsh(e) {
          return this.eigh(e).values;
        }
        fftn(e, a) {
          let t = e.shape.length;
          if (t === 1) return this.fft(e);
          if (t === 2) return this.fft2(e);
          let r = e.data.length,
            c = new Float64Array(e.data),
            o = new Float64Array(r),
            s = a ? [...a] : [...e.shape],
            n = new Array(t);
          n[t - 1] = 1;
          for (let i = t - 2; i >= 0; i--) n[i] = n[i + 1] * s[i + 1];
          for (let i = t - 1; i >= 0; i--) {
            let u = s[i],
              l = n[i],
              f = l * u;
            for (let h = 0; h < r; h += f)
              for (let m = 0; m < l; m++) {
                let d = new Float64Array(u),
                  g = new Float64Array(u);
                for (let p = 0; p < u; p++) {
                  let _ = h + p * l + m;
                  ((d[p] = c[_]), (g[p] = o[_]));
                }
                let b = this._fftCore(d, g, !1);
                for (let p = 0; p < u; p++) {
                  let _ = h + p * l + m;
                  ((c[_] = b.real[p]), (o[_] = b.imag[p]));
                }
              }
          }
          return { real: this.createArray(c, [...s]), imag: this.createArray(o, [...s]) };
        }
        ifftn(e, a, t) {
          let r = e.shape.length;
          if (r === 1) return this.ifft(e, a);
          if (r === 2) return this.ifft2(e, a);
          let c = e.data.length,
            o = new Float64Array(e.data),
            s = new Float64Array(a.data),
            n = t ? [...t] : [...e.shape],
            i = new Array(r);
          i[r - 1] = 1;
          for (let u = r - 2; u >= 0; u--) i[u] = i[u + 1] * n[u + 1];
          for (let u = r - 1; u >= 0; u--) {
            let l = n[u],
              f = i[u],
              h = f * l;
            for (let m = 0; m < c; m += h)
              for (let d = 0; d < f; d++) {
                let g = new Float64Array(l),
                  b = new Float64Array(l);
                for (let _ = 0; _ < l; _++) {
                  let A = m + _ * f + d;
                  ((g[_] = o[A]), (b[_] = s[A]));
                }
                let p = this._fftCore(g, b, !0);
                for (let _ = 0; _ < l; _++) {
                  let A = m + _ * f + d;
                  ((o[A] = p.real[_]), (s[A] = p.imag[_]));
                }
              }
          }
          return { real: this.createArray(o, [...n]), imag: this.createArray(s, [...n]) };
        }
        product(e, a, t, r) {
          return this.prod(e, a, t, r);
        }
        sometrue(e, a, t) {
          return this.any(e, a, t);
        }
        alltrue(e, a, t) {
          return this.all(e, a, t);
        }
        cumproduct(e, a, t) {
          return this.cumprod(e, a, t);
        }
        ndim(e) {
          return e.shape.length;
        }
        shape(e) {
          return e.shape;
        }
        size(e) {
          return e.data.length;
        }
        result_type(...e) {
          if (e.length === 0) return 'float64';
          let a = typeof e[0] == 'string' ? e[0] : e[0].dtype;
          for (let t = 1; t < e.length; t++) {
            let r = typeof e[t] == 'string' ? e[t] : e[t].dtype;
            a = ye(a, r);
          }
          return a;
        }
        array_equiv(e, a) {
          let t = e.shape,
            r = a.shape,
            c = Math.max(t.length, r.length),
            o = new Array(c - t.length).fill(1).concat(t),
            s = new Array(c - r.length).fill(1).concat(r);
          for (let u = 0; u < c; u++) if (o[u] !== 1 && s[u] !== 1 && o[u] !== s[u]) return !1;
          let [n, i] = this.broadcastArrays(e, a);
          for (let u = 0; u < n.data.length; u++) if (n.data[u] !== i.data[u]) return !1;
          return !0;
        }
        isneginf(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (a === -1 / 0 ? 1 : 0)),
            e.shape
          );
        }
        isposinf(e) {
          return this.createArray(
            Float64Array.from(e.data, a => (a === 1 / 0 ? 1 : 0)),
            e.shape
          );
        }
        isreal(e) {
          return this.createArray(
            Float64Array.from(e.data, () => 1),
            e.shape
          );
        }
        isscalar(e) {
          return typeof e == 'number';
        }
        vander(e, a, t = !1) {
          let r = e.data.length,
            c = a !== void 0 ? a : r,
            o = new Float64Array(r * c);
          for (let s = 0; s < r; s++) {
            let n = e.data[s];
            for (let i = 0; i < c; i++) {
              let u = t ? i : c - 1 - i;
              o[s * c + i] = Math.pow(n, u);
            }
          }
          return this.createArray(o, [r, c]);
        }
        apply_along_axis(e, a, t) {
          let r = t.shape.length;
          a = this._normalizeAxis(a, r);
          let c = t.shape,
            o = c[a],
            s = this._computeStrides(c),
            n = c.filter((p, _) => _ !== a),
            i = n.length > 0 ? this._computeStrides(n) : [1],
            u = n.reduce((p, _) => p * _, 1) || 1,
            l = new Float64Array(o);
          for (let p = 0; p < o; p++) {
            let _ = 0;
            for (let A = 0; A < r; A++) A === a ? (_ += p * s[A]) : (_ += 0 * s[A]);
            l[p] = t.data[_];
          }
          let f = e(this.createArray(l, [o])),
            h = typeof f == 'number',
            m = h ? 1 : f.data.length,
            d = new Float64Array(u * m);
          if (h) d[0] = f;
          else for (let p = 0; p < m; p++) d[p] = f.data[p];
          for (let p = 1; p < u; p++) {
            let _ = new Array(n.length),
              A = p;
            for (let C = 0; C < n.length; C++) ((_[C] = Math.floor(A / i[C])), (A = A % i[C]));
            let w = new Float64Array(o);
            for (let C = 0; C < o; C++) {
              let O = 0,
                M = 0;
              for (let E = 0; E < r; E++) E === a ? (O += C * s[E]) : (O += _[M++] * s[E]);
              w[C] = t.data[O];
            }
            let y = e(this.createArray(w, [o])),
              D = p * m;
            if (typeof y == 'number') d[D] = y;
            else for (let C = 0; C < m; C++) d[D + C] = y.data[C];
          }
          if (h) return this.createArray(d, n.length > 0 ? n : [u]);
          let g = f.shape,
            b = [...n, ...g];
          return this.createArray(d, b.length > 0 ? b : [u]);
        }
        choose(e, a, t = 'raise') {
          let r = e.data.length,
            c = a.length,
            o = new Float64Array(r);
          for (let s = 0; s < r; s++) {
            let n = e.data[s];
            if (t === 'raise') {
              if (n < 0 || n >= c) throw new Error(`index ${n} is out of bounds for ${c} choices`);
            } else
              t === 'wrap'
                ? (n = ((n % c) + c) % c)
                : t === 'clip' && (n = Math.max(0, Math.min(c - 1, n)));
            o[s] = a[n].data[s];
          }
          return this.createArray(o, [...e.shape]);
        }
        msort(e) {
          return this.sort(e, 0);
        }
        piecewise(e, a, t, r = 0) {
          let c = e.data.length,
            o = new Float64Array(c),
            n = t.length === a.length + 1 ? t[t.length - 1] : null;
          for (let i = 0; i < c; i++) {
            let u = !1;
            for (let l = 0; l < a.length; l++)
              if (a[l].data[i] !== 0) {
                ((o[i] = t[l](e.data[i])), (u = !0));
                break;
              }
            u || (o[i] = n ? n(e.data[i]) : r);
          }
          return this.createArray(o, [...e.shape]);
        }
        vectorize(e) {
          return (...a) => {
            if (a.length === 0) throw new Error('vectorize requires at least one argument');
            let t = this.broadcastArrays(...a),
              r = t[0].shape,
              c = t[0].data.length,
              o = new Float64Array(c);
            for (let s = 0; s < c; s++) {
              let n = t.map(i => i.data[s]);
              o[s] = e(...n);
            }
            return this.createArray(o, r);
          };
        }
        nextafter(e, a) {
          let [t, r] = this.broadcastArrays(e, a).map(u => u),
            c = t.data.length,
            o = new Float64Array(c),
            s = new ArrayBuffer(8),
            n = new Float64Array(s),
            i = new Int32Array(s);
          for (let u = 0; u < c; u++) {
            let l = t.data[u],
              f = r.data[u];
            if (isNaN(l) || isNaN(f)) o[u] = NaN;
            else if (l === f) o[u] = f;
            else {
              n[0] = l;
              let h = i[0],
                m = i[1];
              ((l > 0 && f > l) || (l < 0 && f > l) || l === 0
                ? l === 0
                  ? ((i[0] = 1), (i[1] = f > 0 ? 0 : -2147483648))
                  : l > 0
                    ? ((h += 1), h === 0 && (m += 1), (i[0] = h), (i[1] = m))
                    : ((h -= 1), h === -1 && (m -= 1), (i[0] = h), (i[1] = m))
                : l > 0
                  ? ((h -= 1), h === -1 && (m -= 1), (i[0] = h), (i[1] = m))
                  : ((h += 1), h === 0 && (m += 1), (i[0] = h), (i[1] = m)),
                (o[u] = n[0]));
            }
          }
          return this.createArray(o, [...t.shape]);
        }
        array2string(e, a) {
          let t = a?.separator ?? ', ',
            r = a?.precision,
            c = s => (r !== void 0 ? s.toFixed(r) : String(s)),
            o = (s, n, i) => {
              if (n.length === 0) return c(s[i]);
              if (n.length === 1) {
                let f = [];
                for (let h = 0; h < n[0]; h++) f.push(c(s[i + h]));
                return '[' + f.join(t) + ']';
              }
              let u = n.slice(1).reduce((f, h) => f * h, 1),
                l = [];
              for (let f = 0; f < n[0]; f++) l.push(o(s, n.slice(1), i + f * u));
              return '[' + l.join(t) + ']';
            };
          return o(Array.from(e.data), e.shape, 0);
        }
      }));
  });
var Ce = {};
fe(Ce, { JsBackend: () => he, createJsBackend: () => Xe });
function Xe() {
  return new he();
}
var he,
  De = oe(() => {
    'use strict';
    de();
    he = class extends ae {
      name = 'js';
      createArray(e, a, t = 'float64') {
        return e instanceof Float64Array
          ? new Y(e, a, t)
          : ArrayBuffer.isView(e)
            ? new Y(e, a, t)
            : new Y(e, a, t);
      }
    };
  });
var xe = {};
fe(xe, {
  argsort_f64: () => Qe,
  binary_add: () => Je,
  binary_divide: () => ea,
  binary_maximum: () => aa,
  binary_minimum: () => ta,
  binary_mod: () => ra,
  binary_multiply: () => ca,
  binary_power: () => oa,
  binary_subtract: () => sa,
  broadcast_shape: () => na,
  default: () => et,
  initSync: () => Ja,
  matmul: () => ia,
  reduce_argmax_axis: () => ua,
  reduce_argmin_axis: () => la,
  reduce_max: () => fa,
  reduce_max_axis: () => da,
  reduce_mean: () => ha,
  reduce_mean_axis: () => ma,
  reduce_min: () => ga,
  reduce_min_axis: () => pa,
  reduce_prod: () => _a,
  reduce_prod_axis: () => ba,
  reduce_sum: () => Aa,
  reduce_sum_axis: () => wa,
  sort_f64: () => va,
  unary_abs: () => Ba,
  unary_acos: () => ya,
  unary_acosh: () => Ca,
  unary_asin: () => Da,
  unary_asinh: () => Ma,
  unary_atan: () => Ra,
  unary_atanh: () => Oa,
  unary_cbrt: () => Ea,
  unary_ceil: () => Pa,
  unary_cos: () => xa,
  unary_cosh: () => Ka,
  unary_exp: () => Na,
  unary_expm1: () => Sa,
  unary_floor: () => Ua,
  unary_log: () => La,
  unary_log10: () => ka,
  unary_log1p: () => Ta,
  unary_log2: () => Ga,
  unary_negative: () => Fa,
  unary_reciprocal: () => Ia,
  unary_round: () => za,
  unary_sign: () => Va,
  unary_sin: () => qa,
  unary_sinh: () => Ha,
  unary_sqrt: () => Ya,
  unary_square: () => ja,
  unary_tan: () => Wa,
  unary_tanh: () => $a,
  unary_trunc: () => Za,
});
function Qe(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.argsort_f64(e, a);
  var r = Re(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 4, 4), r);
}
function Je(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_add(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function ea(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_divide(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function aa(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_maximum(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function ta(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_minimum(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function ra(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_mod(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function ca(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_multiply(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function oa(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_power(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function sa(v, e, a, t) {
  let r = K(v, B.__wbindgen_malloc),
    c = P,
    o = G(e, B.__wbindgen_malloc),
    s = P,
    n = K(a, B.__wbindgen_malloc),
    i = P,
    u = G(t, B.__wbindgen_malloc),
    l = P,
    f = B.binary_subtract(r, c, o, s, n, i, u, l);
  var h = S(f[0], f[1]).slice();
  return (B.__wbindgen_free(f[0], f[1] * 8, 8), h);
}
function na(v, e) {
  let a = G(v, B.__wbindgen_malloc),
    t = P,
    r = G(e, B.__wbindgen_malloc),
    c = P,
    o = B.broadcast_shape(a, t, r, c);
  var s = Re(o[0], o[1]).slice();
  return (B.__wbindgen_free(o[0], o[1] * 4, 4), s);
}
function ia(v, e, a, t, r) {
  let c = K(v, B.__wbindgen_malloc),
    o = P,
    s = K(t, B.__wbindgen_malloc),
    n = P,
    i = B.matmul(c, o, e, a, s, n, r);
  var u = S(i[0], i[1]).slice();
  return (B.__wbindgen_free(i[0], i[1] * 8, 8), u);
}
function ua(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_argmax_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function la(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_argmin_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function fa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P;
  return B.reduce_max(e, a);
}
function da(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_max_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function ha(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P;
  return B.reduce_mean(e, a);
}
function ma(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_mean_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function ga(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P;
  return B.reduce_min(e, a);
}
function pa(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_min_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function _a(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P;
  return B.reduce_prod(e, a);
}
function ba(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_prod_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function Aa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P;
  return B.reduce_sum(e, a);
}
function wa(v, e, a) {
  let t = K(v, B.__wbindgen_malloc),
    r = P,
    c = G(e, B.__wbindgen_malloc),
    o = P,
    s = B.reduce_sum_axis(t, r, c, o, a);
  var n = S(s[0], s[1]).slice();
  return (B.__wbindgen_free(s[0], s[1] * 8, 8), n);
}
function va(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.sort_f64(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ba(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_abs(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function ya(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_acos(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ca(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_acosh(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Da(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_asin(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ma(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_asinh(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ra(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_atan(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Oa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_atanh(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ea(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_cbrt(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Pa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_ceil(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function xa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_cos(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ka(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_cosh(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Na(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_exp(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Sa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_expm1(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ua(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_floor(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function La(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_log(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function ka(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_log10(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ta(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_log1p(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ga(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_log2(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Fa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_negative(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ia(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_reciprocal(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function za(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_round(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Va(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_sign(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function qa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_sin(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ha(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_sinh(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Ya(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_sqrt(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function ja(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_square(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Wa(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_tan(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function $a(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_tanh(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Za(v) {
  let e = K(v, B.__wbindgen_malloc),
    a = P,
    t = B.unary_trunc(e, a);
  var r = S(t[0], t[1]).slice();
  return (B.__wbindgen_free(t[0], t[1] * 8, 8), r);
}
function Me() {
  return {
    __proto__: null,
    './numpyjs_wasm_bg.js': {
      __proto__: null,
      __wbindgen_init_externref_table: function () {
        let e = B.__wbindgen_externrefs,
          a = e.grow(4);
        (e.set(0, void 0),
          e.set(a + 0, void 0),
          e.set(a + 1, null),
          e.set(a + 2, !0),
          e.set(a + 3, !1));
      },
    },
  };
}
function S(v, e) {
  return ((v = v >>> 0), Oe().subarray(v / 8, v / 8 + e));
}
function Re(v, e) {
  return ((v = v >>> 0), Ee().subarray(v / 4, v / 4 + e));
}
function Oe() {
  return ((ne === null || ne.byteLength === 0) && (ne = new Float64Array(B.memory.buffer)), ne);
}
function Ee() {
  return ((ie === null || ie.byteLength === 0) && (ie = new Uint32Array(B.memory.buffer)), ie);
}
function G(v, e) {
  let a = e(v.length * 4, 4) >>> 0;
  return (Ee().set(v, a / 4), (P = v.length), a);
}
function K(v, e) {
  let a = e(v.length * 8, 8) >>> 0;
  return (Oe().set(v, a / 8), (P = v.length), a);
}
function Pe(v, e) {
  return ((B = v.exports), (Xa = e), (ne = null), (ie = null), B.__wbindgen_start(), B);
}
async function Qa(v, e) {
  if (typeof Response == 'function' && v instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == 'function')
      try {
        return await WebAssembly.instantiateStreaming(v, e);
      } catch (r) {
        if (v.ok && a(v.type) && v.headers.get('Content-Type') !== 'application/wasm')
          console.warn(
            '`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
            r
          );
        else throw r;
      }
    let t = await v.arrayBuffer();
    return await WebAssembly.instantiate(t, e);
  } else {
    let t = await WebAssembly.instantiate(v, e);
    return t instanceof WebAssembly.Instance ? { instance: t, module: v } : t;
  }
  function a(t) {
    switch (t) {
      case 'basic':
      case 'cors':
      case 'default':
        return !0;
    }
    return !1;
  }
}
function Ja(v) {
  if (B !== void 0) return B;
  v !== void 0 &&
    (Object.getPrototypeOf(v) === Object.prototype
      ? ({ module: v } = v)
      : console.warn('using deprecated parameters for `initSync()`; pass a single object instead'));
  let e = Me();
  v instanceof WebAssembly.Module || (v = new WebAssembly.Module(v));
  let a = new WebAssembly.Instance(v, e);
  return Pe(a, v);
}
async function et(v) {
  if (B !== void 0) return B;
  (v !== void 0 &&
    (Object.getPrototypeOf(v) === Object.prototype
      ? ({ module_or_path: v } = v)
      : console.warn(
          'using deprecated parameters for the initialization function; pass a single object instead'
        )),
    v === void 0 && (v = new URL('numpyjs_wasm_bg.wasm', import.meta.url)));
  let e = Me();
  (typeof v == 'string' ||
    (typeof Request == 'function' && v instanceof Request) ||
    (typeof URL == 'function' && v instanceof URL)) &&
    (v = fetch(v));
  let { instance: a, module: t } = await Qa(await v, e);
  return Pe(a, t);
}
var ne,
  ie,
  P,
  Xa,
  B,
  Ke = oe(() => {
    'use strict';
    ne = null;
    ie = null;
    P = 0;
  });
var Ne = {};
fe(Ne, { WasmBackend: () => me, createWasmBackend: () => tt, initWasmBackend: () => at });
async function at() {
  let v = await Promise.resolve().then(() => (Ke(), xe));
  (await v.default(), (Ae = v));
}
function tt() {
  if (!Ae) throw new Error('Call initWasmBackend() first');
  return new me(Ae);
}
function Z(v) {
  return v.data instanceof Float64Array ? v.data : new Float64Array(v.data);
}
function ue(v) {
  return new Uint32Array(v);
}
var Ae,
  me,
  Se = oe(() => {
    'use strict';
    de();
    Ae = null;
    me = class v extends ae {
      name = 'wasm';
      wasm;
      constructor(e) {
        (super(), (this.wasm = e));
      }
      createArray(e, a, t = 'float64') {
        return e instanceof Float64Array
          ? new Y(e, a, t)
          : ArrayBuffer.isView(e)
            ? new Y(e, a, t)
            : new Y(e, a, t);
      }
      static WASM_THRESHOLD = 512;
      _wasmUnary(e, a, t) {
        if (t && e.data.length < v.WASM_THRESHOLD) return t.call(this, e);
        let r = a(Z(e));
        return this.createArray(r, [...e.shape], e.dtype);
      }
      sin(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_sin(a),
          a => super.sin(a)
        );
      }
      cos(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_cos(a),
          a => super.cos(a)
        );
      }
      tan(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_tan(a),
          a => super.tan(a)
        );
      }
      arcsin(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_asin(a),
          a => super.arcsin(a)
        );
      }
      arccos(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_acos(a),
          a => super.arccos(a)
        );
      }
      arctan(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_atan(a),
          a => super.arctan(a)
        );
      }
      sinh(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_sinh(a),
          a => super.sinh(a)
        );
      }
      cosh(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_cosh(a),
          a => super.cosh(a)
        );
      }
      tanh(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_tanh(a),
          a => super.tanh(a)
        );
      }
      exp(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_exp(a),
          a => super.exp(a)
        );
      }
      log(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_log(a),
          a => super.log(a)
        );
      }
      log2(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_log2(a),
          a => super.log2(a)
        );
      }
      log10(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_log10(a),
          a => super.log10(a)
        );
      }
      sqrt(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_sqrt(a),
          a => super.sqrt(a)
        );
      }
      cbrt(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_cbrt(a),
          a => super.cbrt(a)
        );
      }
      abs(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_abs(a),
          a => super.abs(a)
        );
      }
      absolute(e) {
        return this.abs(e);
      }
      ceil(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_ceil(a),
          a => super.ceil(a)
        );
      }
      floor(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_floor(a),
          a => super.floor(a)
        );
      }
      round(e, a = 0) {
        return a === 0
          ? this._wasmUnary(
              e,
              t => this.wasm.unary_round(t),
              t => super.round(t)
            )
          : super.round(e, a);
      }
      sign(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_sign(a),
          a => super.sign(a)
        );
      }
      negative(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_negative(a),
          a => super.negative(a)
        );
      }
      reciprocal(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_reciprocal(a),
          a => super.reciprocal(a)
        );
      }
      square(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_square(a),
          a => super.square(a)
        );
      }
      expm1(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_expm1(a),
          a => super.expm1(a)
        );
      }
      log1p(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_log1p(a),
          a => super.log1p(a)
        );
      }
      trunc(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_trunc(a),
          a => super.trunc(a)
        );
      }
      fix(e) {
        return this.trunc(e);
      }
      arcsinh(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_asinh(a),
          a => super.arcsinh(a)
        );
      }
      arccosh(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_acosh(a),
          a => super.arccosh(a)
        );
      }
      arctanh(e) {
        return this._wasmUnary(
          e,
          a => this.wasm.unary_atanh(a),
          a => super.arctanh(a)
        );
      }
      _wasmBinaryOp(e, a, t, r) {
        let c = this._toNDArray(e),
          o = this._toNDArray(a);
        if (r && c.data.length + o.data.length < v.WASM_THRESHOLD) return r.call(this, e, a);
        let s = ue(c.shape),
          n = ue(o.shape),
          i = t(Z(c), s, Z(o), n),
          u = Array.from(this.wasm.broadcast_shape(s, n));
        return this.createArray(i, u);
      }
      add(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_add(t, r, c, o),
          (t, r) => super.add(t, r)
        );
      }
      subtract(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_subtract(t, r, c, o),
          (t, r) => super.subtract(t, r)
        );
      }
      multiply(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_multiply(t, r, c, o),
          (t, r) => super.multiply(t, r)
        );
      }
      divide(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_divide(t, r, c, o),
          (t, r) => super.divide(t, r)
        );
      }
      power(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_power(t, r, c, o),
          (t, r) => super.power(t, r)
        );
      }
      maximum(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_maximum(t, r, c, o),
          (t, r) => super.maximum(t, r)
        );
      }
      minimum(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_minimum(t, r, c, o),
          (t, r) => super.minimum(t, r)
        );
      }
      mod(e, a) {
        return this._wasmBinaryOp(
          e,
          a,
          (t, r, c, o) => this.wasm.binary_mod(t, r, c, o),
          (t, r) => super.mod(t, r)
        );
      }
      _wasmReduction(e, a, t, r, c, o) {
        if (a !== void 0) {
          let s = this._normalizeAxis(a, e.shape.length),
            n = c(Z(e), ue(e.shape), s),
            i = e.shape.filter((l, f) => f !== s),
            u = this.createArray(n, i.length > 0 ? i : [1]);
          if ((o && (u = this.astype(u, o)), t)) {
            let l = [...e.shape];
            ((l[s] = 1), (u = this.reshape(u, l)));
          }
          return u;
        }
        return r(Z(e));
      }
      sum(e, a, t, r) {
        return this._wasmReduction(
          e,
          a,
          t,
          c => this.wasm.reduce_sum(c),
          (c, o, s) => this.wasm.reduce_sum_axis(c, o, s),
          r
        );
      }
      prod(e, a, t, r) {
        return this._wasmReduction(
          e,
          a,
          t,
          c => this.wasm.reduce_prod(c),
          (c, o, s) => this.wasm.reduce_prod_axis(c, o, s),
          r
        );
      }
      mean(e, a, t, r) {
        return this._wasmReduction(
          e,
          a,
          t,
          c => this.wasm.reduce_mean(c),
          (c, o, s) => this.wasm.reduce_mean_axis(c, o, s),
          r
        );
      }
      min(e, a, t) {
        return this._wasmReduction(
          e,
          a,
          t,
          r => this.wasm.reduce_min(r),
          (r, c, o) => this.wasm.reduce_min_axis(r, c, o)
        );
      }
      max(e, a, t) {
        return this._wasmReduction(
          e,
          a,
          t,
          r => this.wasm.reduce_max(r),
          (r, c, o) => this.wasm.reduce_max_axis(r, c, o)
        );
      }
      argmin(e, a, t) {
        if (a === void 0) return super.argmin(e);
        let r = this._normalizeAxis(a, e.shape.length),
          c = this.wasm.reduce_argmin_axis(Z(e), ue(e.shape), r),
          o = e.shape.filter((n, i) => i !== r),
          s = this.createArray(c, o.length > 0 ? o : [1]);
        if (t) {
          let n = [...e.shape];
          ((n[r] = 1), (s = this.reshape(s, n)));
        }
        return s;
      }
      argmax(e, a, t) {
        if (a === void 0) return super.argmax(e);
        let r = this._normalizeAxis(a, e.shape.length),
          c = this.wasm.reduce_argmax_axis(Z(e), ue(e.shape), r),
          o = e.shape.filter((n, i) => i !== r),
          s = this.createArray(c, o.length > 0 ? o : [1]);
        if (t) {
          let n = [...e.shape];
          ((n[r] = 1), (s = this.reshape(s, n)));
        }
        return s;
      }
      matmul(e, a) {
        if (e.shape.length === 2 && a.shape.length === 2) {
          let t = e.shape[0],
            r = e.shape[1],
            c = a.shape[1];
          if (r !== a.shape[0])
            throw new Error(
              `matmul: shapes (${e.shape}) and (${a.shape}) not aligned: ${r} (dim 1) != ${a.shape[0]} (dim 0)`
            );
          let o = this.wasm.matmul(Z(e), t, r, Z(a), c);
          return this.createArray(o, [t, c]);
        }
        return super.matmul(e, a);
      }
      sort(e, a = -1, t) {
        let r = e.shape.length,
          c = this._normalizeAxis(a, r);
        if (r === 1) {
          let o = this.wasm.sort_f64(Z(e));
          return this.createArray(o, [...e.shape], e.dtype);
        }
        if (r === 2 && c === r - 1) {
          let [o, s] = e.shape,
            n = Z(e),
            i = new Float64Array(n.length);
          for (let u = 0; u < o; u++) {
            let l = n.slice(u * s, (u + 1) * s),
              f = this.wasm.sort_f64(l);
            i.set(f, u * s);
          }
          return this.createArray(i, [...e.shape], e.dtype);
        }
        return super.sort(e, a, t);
      }
      argsort(e, a = -1, t) {
        let r = e.shape.length,
          c = this._normalizeAxis(a, r);
        if (r === 1) {
          let o = this.wasm.argsort_f64(Z(e));
          return this.createArray(new Float64Array(o), [...e.shape], 'float64');
        }
        if (r === 2 && c === r - 1) {
          let [o, s] = e.shape,
            n = Z(e),
            i = new Float64Array(n.length);
          for (let u = 0; u < o; u++) {
            let l = n.slice(u * s, (u + 1) * s),
              f = this.wasm.argsort_f64(l);
            for (let h = 0; h < s; h++) i[u * s + h] = f[h];
          }
          return this.createArray(i, [...e.shape], 'float64');
        }
        return super.argsort(e, a, t);
      }
    };
  });
var je = {};
fe(je, {
  WebGPUBackend: () => _e,
  WebGPUTensor: () => q,
  createWebGPUBackend: () => Zt,
  initWebGPUBackend: () => $t,
  materializeAll: () => He,
});
async function He() {
  let v = Array.from(ce).map(e => e.materialize());
  await Promise.all(v);
}
function k(v) {
  return `
    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @group(0) @binding(2) var<uniform> size: u32;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= size) { return; }
      let x = input[idx];
      output[idx] = ${v};
    }
  `;
}
function j(v) {
  return `
    @group(0) @binding(0) var<storage, read> a: array<f32>;
    @group(0) @binding(1) var<storage, read> b: array<f32>;
    @group(0) @binding(2) var<storage, read_write> output: array<f32>;
    @group(0) @binding(3) var<uniform> size: u32;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= size) { return; }
      let av = a[idx];
      let bv = b[idx];
      output[idx] = ${v};
    }
  `;
}
function te(v) {
  return `
    struct Uniforms {
      size: u32,
      scalar: f32,
    }

    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @group(0) @binding(2) var<uniform> uniforms: Uniforms;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= uniforms.size) { return; }
      let x = input[idx];
      let s = uniforms.scalar;
      output[idx] = ${v};
    }
  `;
}
function ge(v, e) {
  return `
    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read_write> output: array<f32>;
    @group(0) @binding(2) var<uniform> size: u32;

    var<workgroup> sdata: array<f32, 256>;

    @compute @workgroup_size(256)
    fn main(
      @builtin(local_invocation_id) lid: vec3<u32>,
      @builtin(workgroup_id) wid: vec3<u32>
    ) {
      let tid = lid.x;
      let gid = wid.x * 256u + tid;

      // Initialize shared memory with identity value
      // Each thread processes one element if within bounds
      if (gid < size) {
        sdata[tid] = input[gid];
      } else {
        sdata[tid] = ${v};
      }

      workgroupBarrier();

      // Parallel reduction in shared memory
      for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
        if (tid < s) {
          let a = sdata[tid];
          let b = sdata[tid + s];
          sdata[tid] = ${e.replace(/\$a/g, 'a').replace(/\$b/g, 'b')};
        }
        workgroupBarrier();
      }

      // Write result for this workgroup
      if (tid == 0u) {
        output[wid.x] = sdata[0];
      }
    }
  `;
}
function rt() {
  return `
    @group(0) @binding(0) var<storage, read> a: array<f32>;
    @group(0) @binding(1) var<storage, read> b: array<f32>;
    @group(0) @binding(2) var<storage, read_write> output: array<f32>;
    @group(0) @binding(3) var<uniform> dims: vec4<u32>; // am, an, bm, bn

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      let am = dims.x;
      let an = dims.y;
      let bm = dims.z;
      let bn = dims.w;
      let outM = am * bm;
      let outN = an * bn;

      if (idx >= outM * outN) { return; }

      let outRow = idx / outN;
      let outCol = idx % outN;

      let i = outRow / bm;
      let k = outRow % bm;
      let j = outCol / bn;
      let l = outCol % bn;

      let aVal = a[i * an + j];
      let bVal = b[k * bn + l];
      output[idx] = aVal * bVal;
    }
  `;
}
function ct(v) {
  let e = 'coeffs[0]';
  for (let a = 1; a <= v; a++) e = `(${e}) * xi + coeffs[${a}]`;
  return `
    @group(0) @binding(0) var<storage, read> coeffs: array<f32>;
    @group(0) @binding(1) var<storage, read> x: array<f32>;
    @group(0) @binding(2) var<storage, read_write> output: array<f32>;
    @group(0) @binding(3) var<uniform> size: u32;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= size) { return; }

      let xi = x[idx];
      output[idx] = ${e};
    }
  `;
}
function ot() {
  return `
    @group(0) @binding(0) var<storage, read> x: array<i32>;
    @group(0) @binding(1) var<storage, read_write> output: array<atomic<u32>>;
    @group(0) @binding(2) var<uniform> xSize: u32;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= xSize) { return; }

      let bin = x[idx];
      if (bin >= 0) {
        atomicAdd(&output[u32(bin)], 1u);
      }
    }
  `;
}
function st() {
  return `
    @group(0) @binding(0) var<storage, read> x: array<i32>;
    @group(0) @binding(1) var<storage, read> weights: array<f32>;
    @group(0) @binding(2) var<storage, read_write> output: array<atomic<u32>>;
    @group(0) @binding(3) var<uniform> xSize: u32;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      if (idx >= xSize) { return; }

      let bin = x[idx];
      if (bin >= 0) {
        // Convert f32 weight to fixed-point for atomic add
        // Scale by 1e6, add, then scale back when reading
        let fixedWeight = u32(weights[idx] * 1000000.0);
        atomicAdd(&output[u32(bin)], fixedWeight);
      }
    }
  `;
}
function Ye(v, e) {
  return `
    @group(0) @binding(0) var<storage, read> input: array<f32>;
    @group(0) @binding(1) var<storage, read_write> outputVal: array<f32>;
    @group(0) @binding(2) var<storage, read_write> outputIdx: array<u32>;
    @group(0) @binding(3) var<uniform> size: u32;

    var<workgroup> sval: array<f32, 256>;
    var<workgroup> sidx: array<u32, 256>;

    @compute @workgroup_size(256)
    fn main(
      @builtin(local_invocation_id) lid: vec3<u32>,
      @builtin(workgroup_id) wid: vec3<u32>
    ) {
      let tid = lid.x;
      let gid = wid.x * 256u + tid;

      // Initialize with identity
      if (gid < size) {
        sval[tid] = input[gid];
        sidx[tid] = gid;
      } else {
        sval[tid] = ${v};
        sidx[tid] = 0u;
      }

      workgroupBarrier();

      // Parallel reduction
      for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
        if (tid < s) {
          let va = sval[tid];
          let vb = sval[tid + s];
          let ia = sidx[tid];
          let ib = sidx[tid + s];
          // ${e} determines if b is better
          if (${e}) {
            sval[tid] = vb;
            sidx[tid] = ib;
          }
        }
        workgroupBarrier();
      }

      if (tid == 0u) {
        outputVal[wid.x] = sval[0];
        outputIdx[wid.x] = sidx[0];
      }
    }
  `;
}
function bt() {
  return `
    @group(0) @binding(0) var<storage, read_write> data: array<f32>;
    @group(0) @binding(1) var<uniform> params: vec4<u32>;  // size, j, k, _pad

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      let size = params.x;
      let j = params.y;
      let k = params.z;

      if (idx >= size) { return; }

      // Compute partner index for compare-swap
      let ixj = idx ^ j;

      // Only process if ixj > idx (avoid double-swapping)
      if (ixj > idx && ixj < size) {
        let ascending = ((idx & k) == 0u);

        let va = data[idx];
        let vb = data[ixj];

        // Handle NaN: NaN goes to end (is "larger" than anything)
        let aIsNan = (va != va);
        let bIsNan = (vb != vb);

        var shouldSwap: bool;
        if (aIsNan && bIsNan) {
          shouldSwap = false;
        } else if (aIsNan) {
          shouldSwap = ascending;  // NaN should go to end
        } else if (bIsNan) {
          shouldSwap = !ascending;
        } else {
          shouldSwap = select(va < vb, va > vb, ascending);
        }

        if (shouldSwap) {
          data[idx] = vb;
          data[ixj] = va;
        }
      }
    }
  `;
}
function At() {
  return `
    @group(0) @binding(0) var<storage, read> values: array<f32>;
    @group(0) @binding(1) var<storage, read_write> indices: array<u32>;
    @group(0) @binding(2) var<uniform> params: vec4<u32>;  // size, j, k, _pad

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      let size = params.x;
      let j = params.y;
      let k = params.z;

      if (idx >= size) { return; }

      let ixj = idx ^ j;

      if (ixj > idx && ixj < size) {
        let ascending = ((idx & k) == 0u);

        let idxA = indices[idx];
        let idxB = indices[ixj];
        let va = values[idxA];
        let vb = values[idxB];

        // Handle NaN: NaN goes to end
        let aIsNan = (va != va);
        let bIsNan = (vb != vb);

        var shouldSwap: bool;
        if (aIsNan && bIsNan) {
          shouldSwap = false;
        } else if (aIsNan) {
          shouldSwap = ascending;
        } else if (bIsNan) {
          shouldSwap = !ascending;
        } else {
          shouldSwap = select(va < vb, va > vb, ascending);
        }

        if (shouldSwap) {
          indices[idx] = idxB;
          indices[ixj] = idxA;
        }
      }
    }
  `;
}
function Ct(v) {
  return `
    @group(0) @binding(0) var<storage, read> haystack: array<f32>;
    @group(0) @binding(1) var<storage, read> needles: array<f32>;
    @group(0) @binding(2) var<storage, read_write> output: array<u32>;
    @group(0) @binding(3) var<uniform> params: vec2<u32>;  // haystackSize, needlesSize

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
      let idx = gid.x;
      let haystackSize = params.x;
      let needlesSize = params.y;

      if (idx >= needlesSize) { return; }

      let needle = needles[idx];
      var lo: u32 = 0u;
      var hi: u32 = haystackSize;

      while (lo < hi) {
        let mid = (lo + hi) / 2u;
        let midVal = haystack[mid];
        if (midVal ${v === 'left' ? '<' : '<='} needle) {
          lo = mid + 1u;
        } else {
          hi = mid;
        }
      }

      output[idx] = lo;
    }
  `;
}
function qe(v, e, a) {
  let t = `${v}x${e}x${a}`;
  if (le.has(t)) {
    let n = le.get(t);
    return pe.find(i => i.name === n) || null;
  }
  let r = Math.min(v, e, a),
    c = Math.max(v, e, a),
    o = pe.filter(
      n =>
        !(
          r < n.minSize ||
          (n.maxSize > 0 && c > n.maxSize) ||
          (n.requiresFit &&
            (v % n.tileM !== 0 ||
              a % n.tileN !== 0 ||
              e % n.tileK !== 0 ||
              (n.usesVec4B && a % 4 !== 0)))
        )
    );
  if (o.length === 0) return pe.find(n => n.name === 'TFJS-VEC4-INNER') || null;
  if (r >= 1024) {
    let n = o.find(i => i.name === 'BCACHE-TALL');
    if (n) return n;
  }
  let s = o.find(n => n.name === 'TFJS-BCACHE');
  return s && r >= 64 ? s : (c <= 256 && o.find(i => i.name === 'TFJS-BCACHE')) || o[0];
}
async function $t() {
  if (!navigator.gpu) throw new Error('WebGPU not supported');
  let v = await navigator.gpu.requestAdapter();
  if (!v) throw new Error('No WebGPU adapter found');
  let e = v.limits;
  we = await v.requestDevice({
    requiredLimits: {
      maxBufferSize: e.maxBufferSize,
      maxStorageBufferBindingSize: e.maxStorageBufferBindingSize,
      maxComputeWorkgroupsPerDimension: e.maxComputeWorkgroupsPerDimension,
      maxComputeWorkgroupStorageSize: e.maxComputeWorkgroupStorageSize,
      maxComputeInvocationsPerWorkgroup: e.maxComputeInvocationsPerWorkgroup,
      maxStorageBuffersPerShaderStage: e.maxStorageBuffersPerShaderStage,
    },
  });
}
function Zt() {
  if (!we) throw new Error('WebGPU not initialized');
  return new _e(we);
}
var we,
  I,
  q,
  ce,
  Q,
  Ue,
  Le,
  ke,
  Te,
  Ge,
  Fe,
  Ie,
  ze,
  Ve,
  nt,
  it,
  ut,
  lt,
  ft,
  dt,
  ht,
  mt,
  gt,
  pt,
  _t,
  wt,
  vt,
  Bt,
  yt,
  Dt,
  Mt,
  Rt,
  Ot,
  Et,
  Pt,
  xt,
  Kt,
  Nt,
  St,
  Ut,
  Lt,
  kt,
  Tt,
  Gt,
  Ft,
  It,
  zt,
  Vt,
  qt,
  Ht,
  Yt,
  jt,
  pe,
  le,
  Wt,
  ve,
  _e,
  We = oe(() => {
    'use strict';
    be();
    de();
    ((we = null),
      (I = new Map()),
      (q = class v {
        buffer;
        shape;
        device;
        _cachedData = null;
        constructor(e, a, t) {
          ((this.buffer = e), (this.shape = [...a]), (this.device = t));
        }
        get size() {
          return this.shape.reduce((e, a) => e * a, 1);
        }
        async getData() {
          if (this._cachedData) return this._cachedData;
          let e = this.size,
            a = this.device.createBuffer({
              size: e * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            t = this.device.createCommandEncoder();
          (t.copyBufferToBuffer(this.buffer, 0, a, 0, e * 4),
            this.device.queue.submit([t.finish()]),
            await a.mapAsync(GPUMapMode.READ));
          let r = new Float32Array(a.getMappedRange().slice(0));
          (a.unmap(), a.destroy());
          let c = new Float64Array(e);
          for (let o = 0; o < e; o++) c[o] = r[o];
          return ((this._cachedData = c), c);
        }
        get isCached() {
          return this._cachedData !== null;
        }
        get data() {
          if (!this._cachedData)
            throw new Error(
              'Data not cached. Call await getData() first, or use WebGPUNDArray.materialize()'
            );
          return this._cachedData;
        }
        getCachedData() {
          if (!this._cachedData) throw new Error('Data not cached. Call getData() first.');
          return this._cachedData;
        }
        static fromArray(e, a, t) {
          let r = e instanceof Float64Array ? e : new Float64Array(e),
            c = r.length,
            o = new Float32Array(c);
          for (let i = 0; i < c; i++) o[i] = r[i];
          let s = t.createBuffer({
            size: c * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
          });
          t.queue.writeBuffer(s, 0, o);
          let n = new v(s, a, t);
          return ((n._cachedData = r), n);
        }
        static empty(e, a) {
          let t = e.reduce((c, o) => c * o, 1),
            r = a.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            });
          return new v(r, e, a);
        }
        destroy() {
          this.buffer.destroy();
        }
      }),
      (ce = new Set()),
      (Q = class v {
        _tensor;
        _pendingReadback = null;
        dtype;
        constructor(e, a = re) {
          ((this._tensor = e), (this.dtype = a), ce.add(this));
        }
        get shape() {
          return [...this._tensor.shape];
        }
        get data() {
          if (this._tensor.isCached) {
            ce.delete(this);
            let e = this._tensor.getCachedData();
            return this.dtype === 'float64' ? e : $(this.dtype, Array.from(e));
          }
          throw (
            this._pendingReadback ||
              (this._pendingReadback = this._tensor.getData().then(e => (ce.delete(this), e))),
            new Error(
              `GPU data not cached. Call await backend.materializeAll() before accessing .data. This array has shape ${JSON.stringify(this.shape)} and is still on GPU.`
            )
          );
        }
        get ndim() {
          return this._tensor.shape.length;
        }
        get size() {
          return this._tensor.shape.reduce((e, a) => e * a, 1);
        }
        get T() {
          let e = this._tensor.shape.length;
          if (e <= 1) return this;
          let a = this.shape,
            t = [...Array(e).keys()].reverse(),
            r = t.map(u => a[u]),
            c = this.size,
            o = this.data,
            s = new Float64Array(c),
            n = new Array(e);
          n[e - 1] = 1;
          for (let u = e - 2; u >= 0; u--) n[u] = n[u + 1] * a[u + 1];
          let i = new Array(e);
          i[e - 1] = 1;
          for (let u = e - 2; u >= 0; u--) i[u] = i[u + 1] * r[u + 1];
          for (let u = 0; u < c; u++) {
            let l = u,
              f = 0;
            for (let h = 0; h < e; h++) {
              let m = Math.floor(l / i[h]);
              ((l -= m * i[h]), (f += m * n[t[h]]));
            }
            s[u] = o[f];
          }
          return new Y(s, r, this.dtype);
        }
        toArray() {
          return Array.from(this.data);
        }
        item() {
          if (this.size !== 1) throw new Error('can only convert an array of size 1 to a scalar');
          return this.data[0];
        }
        get tensor() {
          return this._tensor;
        }
        async getData() {
          let e = await this._tensor.getData();
          return (ce.delete(this), e);
        }
        async materialize() {
          (await this._tensor.getData(), ce.delete(this));
        }
        get isMaterialized() {
          return this._tensor.isCached;
        }
        static fromArray(e, a, t, r = re) {
          let c = new v(q.fromArray(e, a, t), r);
          return (ce.delete(c), c);
        }
      }));
    ((Ue = {
      sin: k('sin(x)'),
      cos: k('cos(x)'),
      tan: k('tan(x)'),
      asin: k('asin(x)'),
      acos: k('acos(x)'),
      atan: k('atan(x)'),
      sinh: k('sinh(x)'),
      cosh: k('cosh(x)'),
      tanh: k('tanh(x)'),
      exp: k('exp(x)'),
      exp2: k('exp2(x)'),
      log: k('log(x)'),
      log2: k('log2(x)'),
      sqrt: k('sqrt(x)'),
      abs: k('abs(x)'),
      sign: k('sign(x)'),
      floor: k('floor(x)'),
      ceil: k('ceil(x)'),
      round: k('round(x)'),
      neg: k('-x'),
      reciprocal: k('1.0 / x'),
      square: k('x * x'),
      cbrt: k('sign(x) * pow(abs(x), 0.333333333333)'),
      log10: k('log(x) / 2.302585093'),
      asinh: k('sign(x) * log(abs(x) + sqrt(x * x + 1.0))'),
      acosh: k('log(x + sqrt(x * x - 1.0))'),
      atanh: k('0.5 * log((1.0 + x) / (1.0 - x))'),
      expm1: k(`
    select(
      exp(x) - 1.0,
      x * (1.0 + x * (0.5 + x * (0.16666666666666666 + x * 0.041666666666666664))),
      abs(x) < 0.01
    )
  `),
      log1p: k(`
    select(
      log(1.0 + x),
      x * (1.0 - x * (0.5 - x * (0.3333333333333333 - x * 0.25))),
      abs(x) < 0.01
    )
  `),
      trunc: k('trunc(x)'),
      sinc: k(
        'select(sin(3.14159265358979 * x) / (3.14159265358979 * x), 1.0, abs(x) < 0.0000001)'
      ),
      deg2rad: k('x * 0.01745329251994329577'),
      rad2deg: k('x * 57.29577951308232087680'),
      signbit: k(`
    select(
      f32(bitcast<u32>(x) >> 31u),
      0.0,
      x != x
    )
  `),
    }),
      (Le = {
        add: j('av + bv'),
        sub: j('av - bv'),
        mul: j('av * bv'),
        div: j('av / bv'),
        pow: j(`
    select(
      pow(av, bv),
      select(
        -pow(-av, bv),
        pow(-av, bv),
        fract(bv) == 0.0 && (i32(bv) % 2) == 1
      ),
      av < 0.0 && fract(bv) == 0.0
    )
  `),
        maximum: j('select(max(av, bv), av + bv, av != av || bv != bv)'),
        minimum: j('select(min(av, bv), av + bv, av != av || bv != bv)'),
        fmod: j('av - trunc(av / bv) * bv'),
        mod: j(`
    select(
      av - trunc(av / bv) * bv + bv,
      av - trunc(av / bv) * bv,
      (av - trunc(av / bv) * bv) * bv >= 0.0 || (av - trunc(av / bv) * bv) == 0.0
    )
  `),
        copysign: j(`
    bitcast<f32>((bitcast<u32>(abs(av)) & 0x7FFFFFFFu) | (bitcast<u32>(bv) & 0x80000000u))
  `),
        hypot: j(`
    select(
      select(
        abs(av) * sqrt(1.0 + (bv / av) * (bv / av)),
        abs(bv) * sqrt(1.0 + (av / bv) * (av / bv)),
        abs(av) > abs(bv)
      ),
      0.0,
      av == 0.0 && bv == 0.0
    )
  `),
        arctan2: j('atan2(av, bv)'),
        logaddexp: j('max(av, bv) + log(1.0 + exp(min(av, bv) - max(av, bv)))'),
        logaddexp2: j('max(av, bv) + log2(1.0 + exp2(min(av, bv) - max(av, bv)))'),
        fmax: j(`
    select(
      select(
        max(av, bv),
        av,
        bv != bv
      ),
      bv,
      av != av
    )
  `),
        fmin: j(`
    select(
      select(
        min(av, bv),
        av,
        bv != bv
      ),
      bv,
      av != av
    )
  `),
      }),
      (ke = {
        addScalar: te('x + s'),
        subScalar: te('x - s'),
        mulScalar: te('x * s'),
        divScalar: te('x / s'),
        powScalar: te(`
    select(
      pow(x, s),
      select(
        -pow(-x, s),
        pow(-x, s),
        fract(s) == 0.0 && (i32(s) % 2) == 1
      ),
      x < 0.0 && fract(s) == 0.0
    )
  `),
        heaviside: te('select(select(1.0, s, x == 0.0), 0.0, x < 0.0)'),
        ldexp: te('x * exp2(s)'),
        minScalar: te('min(x, s)'),
        maxScalar: te('max(x, s)'),
      }),
      (Te = {
        sum: ge('0.0f', '$a + $b'),
        prod: ge('1.0f', '$a * $b'),
        min: ge('3.40282e+38f', 'select(min($a, $b), $a + $b, $a != $a || $b != $b)'),
        max: ge('-3.40282e+38f', 'select(max($a, $b), $a + $b, $a != $a || $b != $b)'),
      }));
    ((Ge = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }
    // For large arrays, we do a simple serial prefix sum per workgroup
    // This is a naive implementation - for production we'd use a proper parallel scan
    var sum: f32 = 0.0;
    for (var i: u32 = 0u; i <= idx; i = i + 1u) {
      sum = sum + input[i];
    }
    output[idx] = sum;
  }
`),
      (Fe = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }
    var prod: f32 = 1.0;
    for (var i: u32 = 0u; i <= idx; i = i + 1u) {
      prod = prod * input[i];
    }
    output[idx] = prod;
  }
`),
      (Ie = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> frac: array<f32>;
  @group(0) @binding(2) var<storage, read_write> integ: array<f32>;
  @group(0) @binding(3) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }
    let x = input[idx];
    let i = trunc(x);
    integ[idx] = i;
    frac[idx] = x - i;
  }
`),
      (ze = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> mantissa: array<f32>;
  @group(0) @binding(2) var<storage, read_write> exponent: array<f32>;
  @group(0) @binding(3) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }
    let x = input[idx];

    // Always compute - handle special cases via output
    // For x=0, log2(0)=-inf, floor(-inf)=-inf, exp2(-inf)=0, so 0/0=NaN
    // We'll handle x=0 specially by checking and returning (0, 0)
    // For NaN/Inf inputs, the math will propagate correctly
    let safeX = select(x, 1.0, x == 0.0);  // Use 1.0 to avoid log2(0)
    let e = floor(log2(abs(safeX))) + 1.0;
    let m = safeX / exp2(e);

    // Output: for x=0, return (0, 0); otherwise use computed values
    mantissa[idx] = select(m, 0.0, x == 0.0);
    exponent[idx] = select(e, 0.0, x == 0.0);
  }
`),
      (Ve = `
  @group(0) @binding(0) var<storage, read> a: array<f32>;
  @group(0) @binding(1) var<storage, read> b: array<f32>;
  @group(0) @binding(2) var<storage, read_write> quotient: array<f32>;
  @group(0) @binding(3) var<storage, read_write> remainder: array<f32>;
  @group(0) @binding(4) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }
    let av = a[idx];
    let bv = b[idx];

    // Python-style floor division
    quotient[idx] = floor(av / bv);

    // Python-style modulo: result has same sign as divisor
    let r = av - trunc(av / bv) * bv;
    // Adjust if r and bv have different signs and r != 0
    remainder[idx] = select(r + bv, r, r * bv >= 0.0 || r == 0.0);
  }
`),
      (nt = `
  struct Uniforms {
    size: u32,
    minVal: f32,
    maxVal: f32,
    _pad: f32,
  }

  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= uniforms.size) { return; }
    output[idx] = clamp(input[idx], uniforms.minVal, uniforms.maxVal);
  }
`));
    ((it = Ye('3.40282e+38f', 'vb < va')),
      (ut = Ye('-3.40282e+38f', 'vb > va')),
      (lt = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<u32>;
  @group(0) @binding(2) var<uniform> size: u32;

  var<workgroup> sdata: array<u32, 256>;

  @compute @workgroup_size(256)
  fn main(
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let tid = lid.x;
    let gid = wid.x * 256u + tid;

    // All: 1 if all non-zero, 0 if any zero
    if (gid < size) {
      sdata[tid] = select(0u, 1u, input[gid] != 0.0f);
    } else {
      sdata[tid] = 1u;  // Identity for all
    }

    workgroupBarrier();

    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] & sdata[tid + s];
      }
      workgroupBarrier();
    }

    if (tid == 0u) {
      output[wid.x] = sdata[0];
    }
  }
`),
      (ft = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<u32>;
  @group(0) @binding(2) var<uniform> size: u32;

  var<workgroup> sdata: array<u32, 256>;

  @compute @workgroup_size(256)
  fn main(
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let tid = lid.x;
    let gid = wid.x * 256u + tid;

    // Any: 1 if any non-zero
    if (gid < size) {
      sdata[tid] = select(0u, 1u, input[gid] != 0.0f);
    } else {
      sdata[tid] = 0u;  // Identity for any
    }

    workgroupBarrier();

    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] | sdata[tid + s];
      }
      workgroupBarrier();
    }

    if (tid == 0u) {
      output[wid.x] = sdata[0];
    }
  }
`),
      (dt = `
  struct Uniforms {
    rows: u32,
    cols: u32,
  }

  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let col = gid.x;
    if (col >= uniforms.cols) { return; }

    var sum: f32 = 0.0f;
    for (var row: u32 = 0u; row < uniforms.rows; row = row + 1u) {
      sum = sum + input[row * uniforms.cols + col];
    }
    output[col] = sum;
  }
`),
      (ht = `
  struct Uniforms {
    rows: u32,
    cols: u32,
  }

  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let row = gid.x;
    if (row >= uniforms.rows) { return; }

    var sum: f32 = 0.0f;
    for (var col: u32 = 0u; col < uniforms.cols; col = col + 1u) {
      sum = sum + input[row * uniforms.cols + col];
    }
    output[row] = sum;
  }
`),
      (mt = `
  struct Uniforms {
    rows: u32,
    cols: u32,
  }

  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  @compute @workgroup_size(16, 16)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let row = gid.y;
    let col = gid.x;
    if (row >= uniforms.rows || col >= uniforms.cols) { return; }

    // input[row, col] -> output[col, row]
    output[col * uniforms.rows + row] = input[row * uniforms.cols + col];
  }
`),
      (gt = `
  struct Uniforms {
    m: u32,
    n: u32,
  }

  @group(0) @binding(0) var<storage, read> a: array<f32>;
  @group(0) @binding(1) var<storage, read> b: array<f32>;
  @group(0) @binding(2) var<storage, read_write> output: array<f32>;
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  @compute @workgroup_size(16, 16)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let i = gid.y;
    let j = gid.x;
    if (i >= uniforms.m || j >= uniforms.n) { return; }

    output[i * uniforms.n + j] = a[i] * b[j];
  }
`),
      (pt = `
  @group(0) @binding(0) var<storage, read> a: array<f32>;
  @group(0) @binding(1) var<storage, read> b: array<f32>;
  @group(0) @binding(2) var<storage, read_write> output: array<f32>;
  @group(0) @binding(3) var<uniform> size: u32;

  var<workgroup> sdata: array<f32, 256>;

  @compute @workgroup_size(256)
  fn main(
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let tid = lid.x;
    let gid = wid.x * 256u + tid;

    // Multiply and load
    if (gid < size) {
      sdata[tid] = a[gid] * b[gid];
    } else {
      sdata[tid] = 0.0f;
    }

    workgroupBarrier();

    // Sum reduction
    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] + sdata[tid + s];
      }
      workgroupBarrier();
    }

    if (tid == 0u) {
      output[wid.x] = sdata[0];
    }
  }
`),
      (_t = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> n: u32;

  var<workgroup> sdata: array<f32, 256>;

  @compute @workgroup_size(256)
  fn main(
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let tid = lid.x;
    let gid = wid.x * 256u + tid;

    // Load diagonal element
    if (gid < n) {
      sdata[tid] = input[gid * n + gid];
    } else {
      sdata[tid] = 0.0f;
    }

    workgroupBarrier();

    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] + sdata[tid + s];
      }
      workgroupBarrier();
    }

    if (tid == 0u) {
      output[wid.x] = sdata[0];
    }
  }
`));
    ((wt = `
  @group(0) @binding(0) var<storage, read_write> indices: array<u32>;
  @group(0) @binding(1) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }
    indices[idx] = idx;
  }
`),
      (vt = `
  @group(0) @binding(0) var<storage, read> sorted: array<f32>;
  @group(0) @binding(1) var<storage, read_write> mask: array<u32>;  // 1 = unique, 0 = duplicate
  @group(0) @binding(2) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }

    if (idx == 0u) {
      mask[idx] = 1u;  // First element is always unique
    } else {
      let prev = sorted[idx - 1u];
      let curr = sorted[idx];
      // Check if different (also handle NaN - NaN != NaN is true)
      let prevNan = (prev != prev);
      let currNan = (curr != curr);
      if (prevNan && currNan) {
        mask[idx] = 0u;  // Both NaN = duplicate
      } else if (prevNan || currNan) {
        mask[idx] = 1u;  // One NaN = unique
      } else {
        mask[idx] = select(0u, 1u, prev != curr);
      }
    }
  }
`),
      (Bt = `
  @group(0) @binding(0) var<storage, read> input: array<u32>;
  @group(0) @binding(1) var<storage, read_write> output: array<u32>;
  @group(0) @binding(2) var<uniform> params: vec2<u32>;  // size, offset

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    let size = params.x;
    let offset = params.y;

    if (idx >= size) { return; }

    // Simple serial scan for now (works but not optimal for large arrays)
    var sum: u32 = 0u;
    for (var i: u32 = 0u; i < idx; i = i + 1u) {
      sum = sum + input[i];
    }
    output[idx] = sum;
  }
`),
      (yt = `
  @group(0) @binding(0) var<storage, read> sorted: array<f32>;
  @group(0) @binding(1) var<storage, read> mask: array<u32>;
  @group(0) @binding(2) var<storage, read> scanResult: array<u32>;
  @group(0) @binding(3) var<storage, read_write> output: array<f32>;
  @group(0) @binding(4) var<uniform> size: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let idx = gid.x;
    if (idx >= size) { return; }

    if (mask[idx] == 1u) {
      let outIdx = scanResult[idx];
      output[outIdx] = sorted[idx];
    }
  }
`));
    ((Dt = `
  @group(0) @binding(0) var<storage, read> input: array<f32>;
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;
  @group(0) @binding(2) var<uniform> size: u32;

  var<workgroup> sdata: array<f32, 256>;

  @compute @workgroup_size(256)
  fn main(
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let tid = lid.x;
    let gid = wid.x * 256u + tid;

    // Sum of squares
    if (gid < size) {
      let v = input[gid];
      sdata[tid] = v * v;
    } else {
      sdata[tid] = 0.0f;
    }

    workgroupBarrier();

    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] + sdata[tid + s];
      }
      workgroupBarrier();
    }

    if (tid == 0u) {
      output[wid.x] = sdata[0];
    }
  }
`),
      (Mt = `
  @group(0) @binding(0) var<storage, read> Q: array<f32>;      // [M, N]
  @group(0) @binding(1) var<storage, read_write> output: array<f32>;  // partial sums
  @group(0) @binding(2) var<uniform> dims: vec4<u32>;          // M, N, col, _pad

  var<workgroup> sdata: array<f32, 256>;

  @compute @workgroup_size(256)
  fn main(@builtin(local_invocation_id) lid: vec3<u32>, @builtin(workgroup_id) wid: vec3<u32>) {
    let M = dims.x;
    let N = dims.y;
    let col = dims.z;
    let tid = lid.x;
    let gid = wid.x * 256u + tid;

    // Sum squares of column 'col' (row index = gid)
    if (gid < M) {
      let v = Q[gid * N + col];
      sdata[tid] = v * v;
    } else {
      sdata[tid] = 0.0f;
    }
    workgroupBarrier();

    // Parallel reduction
    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] + sdata[tid + s];
      }
      workgroupBarrier();
    }

    if (tid == 0u) {
      output[wid.x] = sdata[0];
    }
  }
`),
      (Rt = `
  @group(0) @binding(0) var<storage, read_write> Q: array<f32>;  // [M, N]
  @group(0) @binding(1) var<storage, read_write> R: array<f32>;  // [N, N]
  @group(0) @binding(2) var<uniform> dims: vec4<u32>;            // M, N, col, _pad
  @group(0) @binding(3) var<uniform> norm: f32;                  // column norm

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let M = dims.x;
    let N = dims.y;
    let col = dims.z;
    let row = gid.x;

    // Set R[col, col] = norm (only one thread does this)
    if (row == 0u) {
      R[col * N + col] = norm;
    }

    // Normalize Q[:, col]
    if (row < M && norm > 1e-10f) {
      Q[row * N + col] = Q[row * N + col] / norm;
    }
  }
`),
      (Ot = `
  @group(0) @binding(0) var<storage, read> Q: array<f32>;        // [M, N]
  @group(0) @binding(1) var<storage, read_write> dots: array<f32>; // [N-col-1] dot products
  @group(0) @binding(2) var<uniform> dims: vec4<u32>;            // M, N, col, numCols

  var<workgroup> sdata: array<f32, 256>;

  @compute @workgroup_size(256)
  fn main(@builtin(local_invocation_id) lid: vec3<u32>, @builtin(workgroup_id) wid: vec3<u32>) {
    let M = dims.x;
    let N = dims.y;
    let col = dims.z;
    let numCols = dims.w;  // number of columns to compute dots for (N - col - 1)

    let tid = lid.x;
    // wid.x indexes over rows, wid.y indexes over columns k (offset from col+1)
    let row = wid.x * 256u + tid;
    let kOffset = wid.y;  // which column pair (col, col+1+kOffset)

    if (kOffset >= numCols) {
      return;
    }

    let k = col + 1u + kOffset;

    // Compute partial dot product Q[:, col] . Q[:, k]
    if (row < M) {
      sdata[tid] = Q[row * N + col] * Q[row * N + k];
    } else {
      sdata[tid] = 0.0f;
    }
    workgroupBarrier();

    // Parallel reduction
    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        sdata[tid] = sdata[tid] + sdata[tid + s];
      }
      workgroupBarrier();
    }

    // Store partial sum - each workgroup stores its contribution
    // Need atomic add or final reduction on CPU
    if (tid == 0u) {
      // dots layout: [numRowWorkgroups * numCols]
      // dots[kOffset * numRowWorkgroups + wid.x]
      let numRowWorkgroups = (M + 255u) / 256u;
      dots[kOffset * numRowWorkgroups + wid.x] = sdata[0];
    }
  }
`),
      (Et = `
  @group(0) @binding(0) var<storage, read_write> Q: array<f32>;  // [M, N]
  @group(0) @binding(1) var<storage, read_write> R: array<f32>;  // [N, N]
  @group(0) @binding(2) var<storage, read> dots: array<f32>;     // dot products for each column k
  @group(0) @binding(3) var<uniform> dims: vec4<u32>;            // M, N, col, numCols

  @compute @workgroup_size(16, 16)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let M = dims.x;
    let N = dims.y;
    let col = dims.z;
    let numCols = dims.w;

    let row = gid.x;
    let kOffset = gid.y;

    if (row >= M || kOffset >= numCols) {
      return;
    }

    let k = col + 1u + kOffset;
    let dot = dots[kOffset];

    // Set R[col, k] = dot (only row 0 does this)
    if (row == 0u) {
      R[col * N + k] = dot;
    }

    // Q[:, k] -= dot * Q[:, col]
    Q[row * N + k] = Q[row * N + k] - dot * Q[row * N + col];
  }
`),
      (Pt = `
  @group(0) @binding(0) var<storage, read> A: array<f32>;         // [N, N]
  @group(0) @binding(1) var<storage, read_write> output: array<f32>; // [numWorkgroups, 2] - (maxVal, maxIdx)
  @group(0) @binding(2) var<uniform> dims: vec3<u32>;             // N, col, _pad

  var<workgroup> svals: array<f32, 256>;
  var<workgroup> sidxs: array<u32, 256>;

  @compute @workgroup_size(256)
  fn main(@builtin(local_invocation_id) lid: vec3<u32>, @builtin(workgroup_id) wid: vec3<u32>) {
    let N = dims.x;
    let col = dims.y;
    let tid = lid.x;
    let gid = wid.x * 256u + tid;
    let row = col + gid;  // Search from diagonal down

    // Initialize with current element or -infinity
    if (row < N) {
      svals[tid] = abs(A[row * N + col]);
      sidxs[tid] = row;
    } else {
      svals[tid] = -1e30f;
      sidxs[tid] = col;
    }
    workgroupBarrier();

    // Parallel reduction to find max
    for (var s: u32 = 128u; s > 0u; s = s >> 1u) {
      if (tid < s) {
        if (svals[tid + s] > svals[tid]) {
          svals[tid] = svals[tid + s];
          sidxs[tid] = sidxs[tid + s];
        }
      }
      workgroupBarrier();
    }

    // Write workgroup result
    if (tid == 0u) {
      output[wid.x * 2u] = svals[0];
      output[wid.x * 2u + 1u] = f32(sidxs[0]);
    }
  }
`),
      (xt = `
  @group(0) @binding(0) var<storage, read_write> A: array<f32>;   // [N, N]
  @group(0) @binding(1) var<uniform> dims: vec3<u32>;             // N, row1, row2

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let N = dims.x;
    let row1 = dims.y;
    let row2 = dims.z;
    let col = gid.x;

    if (col >= N || row1 == row2) {
      return;
    }

    let idx1 = row1 * N + col;
    let idx2 = row2 * N + col;
    let tmp = A[idx1];
    A[idx1] = A[idx2];
    A[idx2] = tmp;
  }
`),
      (Kt = `
  @group(0) @binding(0) var<storage, read_write> A: array<f32>;   // [N, N]
  @group(0) @binding(1) var<uniform> dims: vec3<u32>;             // N, col, _pad
  @group(0) @binding(2) var<uniform> pivot: f32;                  // A[col, col]

  @compute @workgroup_size(16, 16)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let N = dims.x;
    let col = dims.y;
    let row = col + 1u + gid.y;  // Rows below diagonal
    let j = col + gid.x;         // Columns from col onwards

    if (row >= N || j >= N) {
      return;
    }

    let factor = A[row * N + col] / pivot;

    // Store factor in L part (below diagonal) for j == col
    if (j == col) {
      A[row * N + col] = factor;
    } else {
      // Update U part (to the right)
      A[row * N + j] = A[row * N + j] - factor * A[col * N + j];
    }
  }
`),
      (Nt = `
  @group(0) @binding(0) var<storage, read_write> aug: array<f32>;   // [N, 2*N]
  @group(0) @binding(1) var<uniform> dims: vec3<u32>;               // N, row1, row2

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let N = dims.x;
    let row1 = dims.y;
    let row2 = dims.z;
    let col = gid.x;
    let width = N * 2u;

    if (col >= width || row1 == row2) {
      return;
    }

    let idx1 = row1 * width + col;
    let idx2 = row2 * width + col;
    let tmp = aug[idx1];
    aug[idx1] = aug[idx2];
    aug[idx2] = tmp;
  }
`),
      (St = `
  @group(0) @binding(0) var<storage, read_write> aug: array<f32>;   // [N, 2*N]
  @group(0) @binding(1) var<uniform> dims: vec2<u32>;               // N, row
  @group(0) @binding(2) var<uniform> scale: f32;                    // 1/pivot

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let N = dims.x;
    let row = dims.y;
    let col = gid.x;
    let width = N * 2u;

    if (col >= width) {
      return;
    }

    let idx = row * width + col;
    aug[idx] = aug[idx] * scale;
  }
`),
      (Ut = `
  @group(0) @binding(0) var<storage, read_write> aug: array<f32>;   // [N, 2*N]
  @group(0) @binding(1) var<uniform> dims: vec3<u32>;               // N, pivotRow, _pad

  @compute @workgroup_size(16, 16)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let N = dims.x;
    let pivotRow = dims.y;
    let row = gid.y;
    let col = gid.x;
    let width = N * 2u;

    if (row >= N || col >= width || row == pivotRow) {
      return;
    }

    // factor = aug[row, pivotRow]
    let factor = aug[row * width + pivotRow];

    // aug[row, col] -= factor * aug[pivotRow, col]
    aug[row * width + col] = aug[row * width + col] - factor * aug[pivotRow * width + col];
  }
`),
      (Lt = `
  @group(0) @binding(0) var<storage, read> ATA: array<f32>;      // [N, N]
  @group(0) @binding(1) var<storage, read> v_in: array<f32>;     // [N] current vector
  @group(0) @binding(2) var<storage, read_write> v_out: array<f32>; // [N] output vector
  @group(0) @binding(3) var<uniform> N: u32;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let i = gid.x;
    if (i >= N) {
      return;
    }

    // v_out[i] = sum_j ATA[i, j] * v_in[j]
    var sum = 0.0f;
    for (var j = 0u; j < N; j = j + 1u) {
      sum = sum + ATA[i * N + j] * v_in[j];
    }
    v_out[i] = sum;
  }
`),
      (kt = `
  struct ConvolveParams {
    aLen: u32,
    vLen: u32,
    outLen: u32,
    _pad: u32,
  }

  @group(0) @binding(0) var<storage, read> a: array<f32>;
  @group(0) @binding(1) var<storage, read> v: array<f32>;
  @group(0) @binding(2) var<storage, read_write> output: array<f32>;
  @group(0) @binding(3) var<uniform> params: ConvolveParams;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let i = gid.x;
    if (i >= params.outLen) {
      return;
    }

    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j < params.vLen; j = j + 1u) {
      // aIdx = i - j (but we need to handle the full convolution indexing)
      let aIdx = i32(i) - i32(j);
      if (aIdx >= 0 && u32(aIdx) < params.aLen) {
        sum = sum + a[u32(aIdx)] * v[j];
      }
    }
    output[i] = sum;
  }
`),
      (Tt = `
  struct Uniforms {
    M: u32,
    K: u32,
    N: u32,
    _pad: u32,
  }

  // Tile configuration
  const BLOCK_M: u32 = 64u;   // Output block rows
  const BLOCK_N: u32 = 64u;   // Output block cols
  const BLOCK_K: u32 = 16u;   // K dimension block (conservative for shared mem)
  const THREAD_M: u32 = 4u;   // Per-thread rows
  const THREAD_N: u32 = 4u;   // Per-thread cols
  const BLOCK_M_PADDED: u32 = 65u;  // Padding for bank conflicts

  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<f32>;
  @group(0) @binding(2) var<storage, read> B: array<f32>;
  @group(0) @binding(3) var<storage, read_write> C: array<f32>;

  // Shared memory tiles
  // As: BLOCK_K x BLOCK_M (transposed) with padding = 16 x 65 = 1040
  // Bs: BLOCK_K x BLOCK_N = 16 x 64 = 1024
  var<workgroup> As: array<f32, 1040>;  // 16 * 65 (transposed + padded)
  var<workgroup> Bs: array<f32, 1024>;  // 16 * 64 (row-major)

  @compute @workgroup_size(16, 16)
  fn main(
    @builtin(global_invocation_id) gid: vec3<u32>,
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let M = uniforms.M;
    let K = uniforms.K;
    let N = uniforms.N;

    // Thread coordinates within workgroup (0-15 each)
    let tx = lid.x;
    let ty = lid.y;
    let tid = ty * 16u + tx;  // Linear thread ID (0-255)

    // Output coordinates - each thread computes 4x4 block
    let outRowBase = wid.y * BLOCK_M + ty * THREAD_M;
    let outColBase = wid.x * BLOCK_N + tx * THREAD_N;

    // 16 accumulators (4x4 output per thread)
    var acc00: f32 = 0.0; var acc01: f32 = 0.0; var acc02: f32 = 0.0; var acc03: f32 = 0.0;
    var acc10: f32 = 0.0; var acc11: f32 = 0.0; var acc12: f32 = 0.0; var acc13: f32 = 0.0;
    var acc20: f32 = 0.0; var acc21: f32 = 0.0; var acc22: f32 = 0.0; var acc23: f32 = 0.0;
    var acc30: f32 = 0.0; var acc31: f32 = 0.0; var acc32: f32 = 0.0; var acc33: f32 = 0.0;

    // Number of tiles along K dimension
    let numTiles = (K + BLOCK_K - 1u) / BLOCK_K;

    for (var t: u32 = 0u; t < numTiles; t = t + 1u) {
      // === Load A tile (transposed) ===
      // Need to load BLOCK_K x BLOCK_M = 16 x 64 = 1024 elements
      // 256 threads, each loads 4 elements
      for (var i: u32 = 0u; i < 4u; i = i + 1u) {
        let loadIdx = tid * 4u + i;
        let loadK = loadIdx / BLOCK_M;     // 0-15 (K index)
        let loadRow = loadIdx % BLOCK_M;   // 0-63 (M index)

        let globalK = t * BLOCK_K + loadK;
        let globalRow = wid.y * BLOCK_M + loadRow;

        var val: f32 = 0.0;
        if (globalRow < M && globalK < K) {
          val = A[globalRow * K + globalK];
        }
        // Store transposed: As[k, row]
        As[loadK * BLOCK_M_PADDED + loadRow] = val;
      }

      // === Load B tile ===
      // Need to load BLOCK_K x BLOCK_N = 16 x 64 = 1024 elements
      // 256 threads, each loads 4 elements
      for (var i: u32 = 0u; i < 4u; i = i + 1u) {
        let loadIdx = tid * 4u + i;
        let loadK = loadIdx / BLOCK_N;     // 0-15 (K index)
        let loadCol = loadIdx % BLOCK_N;   // 0-63 (N index)

        let globalK = t * BLOCK_K + loadK;
        let globalCol = wid.x * BLOCK_N + loadCol;

        var val: f32 = 0.0;
        if (globalK < K && globalCol < N) {
          val = B[globalK * N + globalCol];
        }
        // Store row-major: Bs[k, col]
        Bs[loadK * BLOCK_N + loadCol] = val;
      }

      // Sync to ensure all threads have loaded
      workgroupBarrier();

      // === Compute 4x4 output tile ===
      // Manually unrolled for performance
      for (var k: u32 = 0u; k < BLOCK_K; k = k + 1u) {
        // Load 4 values from A (one column of the 4x4 output)
        let a0 = As[k * BLOCK_M_PADDED + ty * THREAD_M + 0u];
        let a1 = As[k * BLOCK_M_PADDED + ty * THREAD_M + 1u];
        let a2 = As[k * BLOCK_M_PADDED + ty * THREAD_M + 2u];
        let a3 = As[k * BLOCK_M_PADDED + ty * THREAD_M + 3u];

        // Load 4 values from B (one row of the 4x4 output)
        let b0 = Bs[k * BLOCK_N + tx * THREAD_N + 0u];
        let b1 = Bs[k * BLOCK_N + tx * THREAD_N + 1u];
        let b2 = Bs[k * BLOCK_N + tx * THREAD_N + 2u];
        let b3 = Bs[k * BLOCK_N + tx * THREAD_N + 3u];

        // 4x4 outer product
        acc00 = fma(a0, b0, acc00); acc01 = fma(a0, b1, acc01); acc02 = fma(a0, b2, acc02); acc03 = fma(a0, b3, acc03);
        acc10 = fma(a1, b0, acc10); acc11 = fma(a1, b1, acc11); acc12 = fma(a1, b2, acc12); acc13 = fma(a1, b3, acc13);
        acc20 = fma(a2, b0, acc20); acc21 = fma(a2, b1, acc21); acc22 = fma(a2, b2, acc22); acc23 = fma(a2, b3, acc23);
        acc30 = fma(a3, b0, acc30); acc31 = fma(a3, b1, acc31); acc32 = fma(a3, b2, acc32); acc33 = fma(a3, b3, acc33);
      }

      // Sync before loading next tile
      workgroupBarrier();
    }

    // === Write 4x4 output with bounds checking ===
    if (outRowBase + 0u < M) {
      if (outColBase + 0u < N) { C[(outRowBase + 0u) * N + outColBase + 0u] = acc00; }
      if (outColBase + 1u < N) { C[(outRowBase + 0u) * N + outColBase + 1u] = acc01; }
      if (outColBase + 2u < N) { C[(outRowBase + 0u) * N + outColBase + 2u] = acc02; }
      if (outColBase + 3u < N) { C[(outRowBase + 0u) * N + outColBase + 3u] = acc03; }
    }
    if (outRowBase + 1u < M) {
      if (outColBase + 0u < N) { C[(outRowBase + 1u) * N + outColBase + 0u] = acc10; }
      if (outColBase + 1u < N) { C[(outRowBase + 1u) * N + outColBase + 1u] = acc11; }
      if (outColBase + 2u < N) { C[(outRowBase + 1u) * N + outColBase + 2u] = acc12; }
      if (outColBase + 3u < N) { C[(outRowBase + 1u) * N + outColBase + 3u] = acc13; }
    }
    if (outRowBase + 2u < M) {
      if (outColBase + 0u < N) { C[(outRowBase + 2u) * N + outColBase + 0u] = acc20; }
      if (outColBase + 1u < N) { C[(outRowBase + 2u) * N + outColBase + 1u] = acc21; }
      if (outColBase + 2u < N) { C[(outRowBase + 2u) * N + outColBase + 2u] = acc22; }
      if (outColBase + 3u < N) { C[(outRowBase + 2u) * N + outColBase + 3u] = acc23; }
    }
    if (outRowBase + 3u < M) {
      if (outColBase + 0u < N) { C[(outRowBase + 3u) * N + outColBase + 0u] = acc30; }
      if (outColBase + 1u < N) { C[(outRowBase + 3u) * N + outColBase + 1u] = acc31; }
      if (outColBase + 2u < N) { C[(outRowBase + 3u) * N + outColBase + 2u] = acc32; }
      if (outColBase + 3u < N) { C[(outRowBase + 3u) * N + outColBase + 3u] = acc33; }
    }
  }
`),
      (Gt = `
  struct Uniforms { M: u32, K: u32, N: u32, _pad: u32, }
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<vec4<f32>>;  // A[M][K/4] vec4 along K
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;  // B[K][N/4] vec4 along N
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;  // C[M][N/4]
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 32>;  // [32 rows][8 vec4s] = 32x32 tile
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 8>, 32>;  // [32 K values][8 vec4s] = 32x32 tile

  @compute @workgroup_size(8, 8, 1)
  fn main(@builtin(local_invocation_id) localId: vec3<u32>, @builtin(global_invocation_id) globalId: vec3<u32>) {
    let M = i32(uniforms.M);
    let K = i32(uniforms.K);
    let N = i32(uniforms.N);
    let KVec4 = K / 4;  // Number of vec4s along K
    let NVec4 = N / 4;  // Number of vec4s along N

    // Thread coordinates
    let localRow = i32(localId.y);     // 0-7 within workgroup
    let tileRow = localRow * 4;         // Output row within tile (0,4,8,...,28)
    let tileCol = i32(localId.x);       // vec4 column index (0-7)
    let globalRow = i32(globalId.y) * 4; // Global output row start
    let globalCol = i32(globalId.x) * 4; // Global output col start

    // Accumulator: 4 output rows, each is a vec4 (4 columns)
    var acc: array<vec4<f32>, 4>;
    acc[0] = vec4<f32>(0.0); acc[1] = vec4<f32>(0.0);
    acc[2] = vec4<f32>(0.0); acc[3] = vec4<f32>(0.0);

    let numTiles = (K + 31) / 32;  // Number of K-dimension tiles
    var kStart = 0;
    let tileRowB = localRow * 4;  // B tile row index for this thread

    for (var t = 0; t < numTiles; t++) {
      // LOAD A TILE: each thread loads 4 rows, 1 vec4 per row (covers 32 K values)
      // mm_Asub[row][col] = A[globalRow+row, kStart+col*4 : kStart+col*4+4]
      for (var innerRow = 0; innerRow < 4; innerRow++) {
        let inputRow = tileRow + innerRow;
        let aRow = globalRow + innerRow;
        let aColVec4 = (kStart + tileCol * 4) / 4;
        if (aRow < M && aColVec4 < KVec4) {
          mm_Asub[inputRow][tileCol] = A[aRow * KVec4 + aColVec4];
        } else {
          mm_Asub[inputRow][tileCol] = vec4<f32>(0.0);  // Zero-fill out of bounds
        }
      }

      // LOAD B TILE: each thread loads 4 K values, 1 vec4 per K value
      // mm_Bsub[k][col] = B[kStart+k, globalCol+col*4 : globalCol+col*4+4]
      for (var innerRow = 0; innerRow < 4; innerRow++) {
        let inputRow = tileRowB + innerRow;
        let bRow = kStart + inputRow;
        let bColVec4 = globalCol / 4;
        if (bRow < K && bColVec4 < NVec4) {
          mm_Bsub[inputRow][tileCol] = B[bRow * NVec4 + bColVec4];
        } else {
          mm_Bsub[inputRow][tileCol] = vec4<f32>(0.0);  // Zero-fill out of bounds
        }
      }

      kStart = kStart + 32;
      workgroupBarrier();

      // COMPUTE: B-caching pattern - load 4 B rows into registers, iterate over A
      // This maximizes register reuse and minimizes shared memory reads
      for (var k = 0; k < 8; k++) {
        // Cache 4 consecutive B rows (4 K values) into registers
        let BCached0 = mm_Bsub[k * 4 + 0][tileCol];
        let BCached1 = mm_Bsub[k * 4 + 1][tileCol];
        let BCached2 = mm_Bsub[k * 4 + 2][tileCol];
        let BCached3 = mm_Bsub[k * 4 + 3][tileCol];

        // Iterate over 4 output rows, using cached B values
        for (var i = 0; i < 4; i++) {
          let ACached = mm_Asub[tileRow + i][k];  // 4 K values as vec4
          // FMA: acc[i] += A[row][k][j] * B[k*4+j][col] for j=0..3
          acc[i] = fma(BCached0, vec4<f32>(ACached[0]), acc[i]);
          acc[i] = fma(BCached1, vec4<f32>(ACached[1]), acc[i]);
          acc[i] = fma(BCached2, vec4<f32>(ACached[2]), acc[i]);
          acc[i] = fma(BCached3, vec4<f32>(ACached[3]), acc[i]);
        }
      }
      workgroupBarrier();
    }

    // WRITE OUTPUT: store accumulated results to C
    for (var innerRow = 0; innerRow < 4; innerRow++) {
      let outRow = globalRow + innerRow;
      let outColVec4 = globalCol / 4;
      if (outRow < M && outColVec4 < NVec4) {
        C[outRow * NVec4 + outColVec4] = acc[innerRow];
      }
    }
  }
`),
      (Ft = `
  struct Uniforms { M: u32, K: u32, N: u32, _pad: u32, }
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<vec4<f32>>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 32>;  // [32 rows][8 vec4s] = 32x32 tile
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 8>, 32>;  // [32 K rows][8 vec4s] = 32x32 tile

  @compute @workgroup_size(8, 8, 1)
  fn main(@builtin(local_invocation_id) localId: vec3<u32>, @builtin(global_invocation_id) globalId: vec3<u32>) {
    let K = i32(uniforms.K);
    let N = i32(uniforms.N);
    let KVec4 = K / 4;
    let NVec4 = N / 4;

    let localRow = i32(localId.y);
    let tileRow = localRow * 4;
    let tileCol = i32(localId.x);
    let globalRow = i32(globalId.y) * 4;
    let globalCol = i32(globalId.x) * 4;

    var acc: array<vec4<f32>, 4>;
    acc[0] = vec4<f32>(0.0); acc[1] = vec4<f32>(0.0);
    acc[2] = vec4<f32>(0.0); acc[3] = vec4<f32>(0.0);

    let numTiles = K / 32;
    var kStart = 0;
    let tileRowB = localRow * 4;

    for (var t = 0; t < numTiles; t++) {
      // LOAD A TILE: no bounds checking
      for (var innerRow = 0; innerRow < 4; innerRow++) {
        let inputRow = tileRow + innerRow;
        let aRow = globalRow + innerRow;
        let aColVec4 = (kStart + tileCol * 4) / 4;
        mm_Asub[inputRow][tileCol] = A[aRow * KVec4 + aColVec4];
      }

      // LOAD B TILE: no bounds checking
      for (var innerRow = 0; innerRow < 4; innerRow++) {
        let inputRow = tileRowB + innerRow;
        let bRow = kStart + inputRow;
        let bColVec4 = globalCol / 4;
        mm_Bsub[inputRow][tileCol] = B[bRow * NVec4 + bColVec4];
      }

      kStart = kStart + 32;
      workgroupBarrier();

      // COMPUTE: B-caching, fully unrolled
      for (var k = 0; k < 8; k++) {
        let BCached0 = mm_Bsub[k * 4 + 0][tileCol];
        let BCached1 = mm_Bsub[k * 4 + 1][tileCol];
        let BCached2 = mm_Bsub[k * 4 + 2][tileCol];
        let BCached3 = mm_Bsub[k * 4 + 3][tileCol];

        for (var i = 0; i < 4; i++) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = fma(BCached0, vec4<f32>(ACached[0]), acc[i]);
          acc[i] = fma(BCached1, vec4<f32>(ACached[1]), acc[i]);
          acc[i] = fma(BCached2, vec4<f32>(ACached[2]), acc[i]);
          acc[i] = fma(BCached3, vec4<f32>(ACached[3]), acc[i]);
        }
      }
      workgroupBarrier();
    }

    // WRITE OUTPUT: no bounds checking
    for (var innerRow = 0; innerRow < 4; innerRow++) {
      let outRow = globalRow + innerRow;
      let outColVec4 = globalCol / 4;
      C[outRow * NVec4 + outColVec4] = acc[innerRow];
    }
  }
`),
      (It = `
  struct Uniforms { M: u32, K: u32, N: u32, _pad: u32, }
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<vec4<f32>>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 32>;   // [32 rows][8 vec4s] = 32\xD732 tile of A
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 16>, 32>;  // [32 K rows][16 vec4s] = 32\xD764 tile of B

  @compute @workgroup_size(16, 8, 1)
  fn main(@builtin(local_invocation_id) localId: vec3<u32>,
          @builtin(workgroup_id) wgId: vec3<u32>) {
    let K = i32(uniforms.K);
    let N = i32(uniforms.N);
    let KVec4 = K / 4;
    let NVec4 = N / 4;

    let localX = i32(localId.x);  // 0-15 (N direction)
    let localY = i32(localId.y);  // 0-7 (M direction)
    let tileRow = localY * 4;     // This thread's 4 output rows within tile (0,4,8,...,28)
    let tileCol = localX;         // This thread's vec4 column within tile (0-15)

    // Global output position
    let globalRow = i32(wgId.y) * 32 + localY * 4;
    let globalCol = i32(wgId.x) * 64 + localX * 4;

    var acc: array<vec4<f32>, 4>;
    acc[0] = vec4<f32>(0.0); acc[1] = vec4<f32>(0.0);
    acc[2] = vec4<f32>(0.0); acc[3] = vec4<f32>(0.0);

    let numTiles = K / 32;
    let threadIdx = localY * 16 + localX;  // Linear thread index 0-127

    for (var t = 0; t < numTiles; t++) {
      let kStart = t * 32;

      // LOAD A TILE: 32 rows \xD7 8 vec4s = 256 vec4s, 128 threads \u2192 2 vec4s each
      {
        let loadIdx0 = threadIdx * 2;
        let loadIdx1 = loadIdx0 + 1;
        let aRow0 = loadIdx0 / 8;
        let aCol0 = loadIdx0 % 8;
        let aRow1 = loadIdx1 / 8;
        let aCol1 = loadIdx1 % 8;
        let gRow0 = i32(wgId.y) * 32 + aRow0;
        let gRow1 = i32(wgId.y) * 32 + aRow1;
        let gCol0 = (kStart + aCol0 * 4) / 4;
        let gCol1 = (kStart + aCol1 * 4) / 4;
        mm_Asub[aRow0][aCol0] = A[gRow0 * KVec4 + gCol0];
        mm_Asub[aRow1][aCol1] = A[gRow1 * KVec4 + gCol1];
      }

      // LOAD B TILE: 32 K rows \xD7 16 vec4s = 512 vec4s, 128 threads \u2192 4 vec4s each
      {
        let loadIdx0 = threadIdx * 4;
        let bRow0 = loadIdx0 / 16;  let bCol0 = loadIdx0 % 16;
        let bRow1 = (loadIdx0+1) / 16;  let bCol1 = (loadIdx0+1) % 16;
        let bRow2 = (loadIdx0+2) / 16;  let bCol2 = (loadIdx0+2) % 16;
        let bRow3 = (loadIdx0+3) / 16;  let bCol3 = (loadIdx0+3) % 16;
        let bGCol = i32(wgId.x) * 64 / 4;
        mm_Bsub[bRow0][bCol0] = B[(kStart + bRow0) * NVec4 + bGCol + bCol0];
        mm_Bsub[bRow1][bCol1] = B[(kStart + bRow1) * NVec4 + bGCol + bCol1];
        mm_Bsub[bRow2][bCol2] = B[(kStart + bRow2) * NVec4 + bGCol + bCol2];
        mm_Bsub[bRow3][bCol3] = B[(kStart + bRow3) * NVec4 + bGCol + bCol3];
      }

      workgroupBarrier();

      // COMPUTE: same B-caching pattern, but now reads from wider B tile
      for (var k = 0; k < 8; k++) {
        let BCached0 = mm_Bsub[k * 4 + 0][tileCol];
        let BCached1 = mm_Bsub[k * 4 + 1][tileCol];
        let BCached2 = mm_Bsub[k * 4 + 2][tileCol];
        let BCached3 = mm_Bsub[k * 4 + 3][tileCol];

        for (var i = 0; i < 4; i++) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = fma(BCached0, vec4<f32>(ACached[0]), acc[i]);
          acc[i] = fma(BCached1, vec4<f32>(ACached[1]), acc[i]);
          acc[i] = fma(BCached2, vec4<f32>(ACached[2]), acc[i]);
          acc[i] = fma(BCached3, vec4<f32>(ACached[3]), acc[i]);
        }
      }
      workgroupBarrier();
    }

    // WRITE OUTPUT
    for (var innerRow = 0; innerRow < 4; innerRow++) {
      let outRow = globalRow + innerRow;
      let outColVec4 = globalCol / 4;
      C[outRow * NVec4 + outColVec4] = acc[innerRow];
    }
  }
`),
      (zt = `
  struct Uniforms { M: u32, K: u32, N: u32, _pad: u32, }
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<vec4<f32>>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 64>;  // [64 rows][8 vec4s]
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 8>, 32>;  // [32 K rows][8 vec4s]

  @compute @workgroup_size(8, 8, 1)
  fn main(@builtin(local_invocation_id) localId: vec3<u32>,
          @builtin(workgroup_id) wgId: vec3<u32>) {
    let K = i32(uniforms.K);
    let N = i32(uniforms.N);
    let KVec4 = K / 4;
    let NVec4 = N / 4;

    let localX = i32(localId.x);
    let localY = i32(localId.y);
    let tileRow = localY * 8;   // 8 output rows per thread
    let tileCol = localX;

    let globalRow = i32(wgId.y) * 64 + localY * 8;
    let globalCol = i32(wgId.x) * 32 + localX * 4;

    // 8 vec4 accumulators (one per output row)
    var acc0 = vec4<f32>(0.0); var acc1 = vec4<f32>(0.0);
    var acc2 = vec4<f32>(0.0); var acc3 = vec4<f32>(0.0);
    var acc4 = vec4<f32>(0.0); var acc5 = vec4<f32>(0.0);
    var acc6 = vec4<f32>(0.0); var acc7 = vec4<f32>(0.0);

    let numTiles = K / 32;
    let threadIdx = localY * 8 + localX;  // 0-63

    for (var t = 0; t < numTiles; t++) {
      let kStart = t * 32;

      // LOAD A TILE: 64 rows \xD7 8 vec4s = 512 vec4s, 64 threads \u2192 8 each
      for (var li = 0; li < 8; li++) {
        let loadIdx = threadIdx * 8 + li;
        let aRow = loadIdx / 8;
        let aCol = loadIdx % 8;
        let gRow = i32(wgId.y) * 64 + aRow;
        let gCol = (kStart + aCol * 4) / 4;
        mm_Asub[aRow][aCol] = A[gRow * KVec4 + gCol];
      }

      // LOAD B TILE: 32 \xD7 8 = 256 vec4s, 64 threads \u2192 4 each
      for (var li = 0; li < 4; li++) {
        let loadIdx = threadIdx * 4 + li;
        let bRow = loadIdx / 8;
        let bCol = loadIdx % 8;
        let bGCol = i32(wgId.x) * 32 / 4;
        mm_Bsub[bRow][bCol] = B[(kStart + bRow) * NVec4 + bGCol + bCol];
      }

      workgroupBarrier();

      // COMPUTE: 8 rows \xD7 B-caching, fully unrolled rows
      for (var k = 0; k < 8; k++) {
        let BCached0 = mm_Bsub[k * 4 + 0][tileCol];
        let BCached1 = mm_Bsub[k * 4 + 1][tileCol];
        let BCached2 = mm_Bsub[k * 4 + 2][tileCol];
        let BCached3 = mm_Bsub[k * 4 + 3][tileCol];

        let a0 = mm_Asub[tileRow + 0][k];
        acc0 = fma(BCached0, vec4<f32>(a0[0]), acc0);
        acc0 = fma(BCached1, vec4<f32>(a0[1]), acc0);
        acc0 = fma(BCached2, vec4<f32>(a0[2]), acc0);
        acc0 = fma(BCached3, vec4<f32>(a0[3]), acc0);

        let a1 = mm_Asub[tileRow + 1][k];
        acc1 = fma(BCached0, vec4<f32>(a1[0]), acc1);
        acc1 = fma(BCached1, vec4<f32>(a1[1]), acc1);
        acc1 = fma(BCached2, vec4<f32>(a1[2]), acc1);
        acc1 = fma(BCached3, vec4<f32>(a1[3]), acc1);

        let a2 = mm_Asub[tileRow + 2][k];
        acc2 = fma(BCached0, vec4<f32>(a2[0]), acc2);
        acc2 = fma(BCached1, vec4<f32>(a2[1]), acc2);
        acc2 = fma(BCached2, vec4<f32>(a2[2]), acc2);
        acc2 = fma(BCached3, vec4<f32>(a2[3]), acc2);

        let a3 = mm_Asub[tileRow + 3][k];
        acc3 = fma(BCached0, vec4<f32>(a3[0]), acc3);
        acc3 = fma(BCached1, vec4<f32>(a3[1]), acc3);
        acc3 = fma(BCached2, vec4<f32>(a3[2]), acc3);
        acc3 = fma(BCached3, vec4<f32>(a3[3]), acc3);

        let a4 = mm_Asub[tileRow + 4][k];
        acc4 = fma(BCached0, vec4<f32>(a4[0]), acc4);
        acc4 = fma(BCached1, vec4<f32>(a4[1]), acc4);
        acc4 = fma(BCached2, vec4<f32>(a4[2]), acc4);
        acc4 = fma(BCached3, vec4<f32>(a4[3]), acc4);

        let a5 = mm_Asub[tileRow + 5][k];
        acc5 = fma(BCached0, vec4<f32>(a5[0]), acc5);
        acc5 = fma(BCached1, vec4<f32>(a5[1]), acc5);
        acc5 = fma(BCached2, vec4<f32>(a5[2]), acc5);
        acc5 = fma(BCached3, vec4<f32>(a5[3]), acc5);

        let a6 = mm_Asub[tileRow + 6][k];
        acc6 = fma(BCached0, vec4<f32>(a6[0]), acc6);
        acc6 = fma(BCached1, vec4<f32>(a6[1]), acc6);
        acc6 = fma(BCached2, vec4<f32>(a6[2]), acc6);
        acc6 = fma(BCached3, vec4<f32>(a6[3]), acc6);

        let a7 = mm_Asub[tileRow + 7][k];
        acc7 = fma(BCached0, vec4<f32>(a7[0]), acc7);
        acc7 = fma(BCached1, vec4<f32>(a7[1]), acc7);
        acc7 = fma(BCached2, vec4<f32>(a7[2]), acc7);
        acc7 = fma(BCached3, vec4<f32>(a7[3]), acc7);
      }
      workgroupBarrier();
    }

    // WRITE OUTPUT: 8 rows
    let outColVec4 = globalCol / 4;
    C[(globalRow + 0) * NVec4 + outColVec4] = acc0;
    C[(globalRow + 1) * NVec4 + outColVec4] = acc1;
    C[(globalRow + 2) * NVec4 + outColVec4] = acc2;
    C[(globalRow + 3) * NVec4 + outColVec4] = acc3;
    C[(globalRow + 4) * NVec4 + outColVec4] = acc4;
    C[(globalRow + 5) * NVec4 + outColVec4] = acc5;
    C[(globalRow + 6) * NVec4 + outColVec4] = acc6;
    C[(globalRow + 7) * NVec4 + outColVec4] = acc7;
  }
`),
      (Vt = `
  struct Uniforms { M: u32, K: u32, N: u32, _pad: u32, }
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<vec4<f32>>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 64>;   // [64 rows][8 vec4s] = 64\xD732
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 16>, 32>;  // [32 K rows][16 vec4s] = 32\xD764

  @compute @workgroup_size(8, 8, 1)
  fn main(@builtin(local_invocation_id) localId: vec3<u32>,
          @builtin(workgroup_id) wgId: vec3<u32>) {
    let M = i32(uniforms.M);
    let K = i32(uniforms.K);
    let N = i32(uniforms.N);
    let KVec4 = K / 4;
    let NVec4 = N / 4;

    // Thread coordinates within workgroup
    let lx = i32(localId.x);  // 0-7: column thread index
    let ly = i32(localId.y);  // 0-7: row thread index

    // Global output position: each thread covers 8 rows and 8 cols (2 vec4s)
    let globalRowStart = i32(wgId.y) * 64 + ly * 8;
    let globalColVec4Start = i32(wgId.x) * 16 + lx * 2;  // 16 vec4s = 64 cols per WG

    // 8\xD72 accumulators (8 rows \xD7 2 vec4 cols = 8\xD78 output elements)
    var acc00 = vec4<f32>(0.0); var acc01 = vec4<f32>(0.0);
    var acc10 = vec4<f32>(0.0); var acc11 = vec4<f32>(0.0);
    var acc20 = vec4<f32>(0.0); var acc21 = vec4<f32>(0.0);
    var acc30 = vec4<f32>(0.0); var acc31 = vec4<f32>(0.0);
    var acc40 = vec4<f32>(0.0); var acc41 = vec4<f32>(0.0);
    var acc50 = vec4<f32>(0.0); var acc51 = vec4<f32>(0.0);
    var acc60 = vec4<f32>(0.0); var acc61 = vec4<f32>(0.0);
    var acc70 = vec4<f32>(0.0); var acc71 = vec4<f32>(0.0);

    let numTiles = (K + 31) / 32;

    for (var t = 0; t < numTiles; t++) {
      let kBase = t * 32;

      // LOAD A TILE: 64 rows \xD7 32 cols (as 8 vec4s)
      // Each of 64 threads loads 8 rows, 1 vec4 each (covers 64\xD78 per pass)
      // We need 64 rows \xD7 8 vec4s = 512 loads for 64 threads = 8 loads/thread
      for (var r = 0; r < 8; r++) {
        let aRow = globalRowStart + r;
        let aKVec4 = (kBase / 4) + lx;
        if (aRow < M && aKVec4 < KVec4) {
          mm_Asub[ly * 8 + r][lx] = A[aRow * KVec4 + aKVec4];
        } else {
          mm_Asub[ly * 8 + r][lx] = vec4<f32>(0.0);
        }
      }

      // LOAD B TILE: 32 rows \xD7 64 cols (as 16 vec4s)
      // 64 threads need to load 32\xD716 = 512 values = 8 loads/thread
      // Thread (lx,ly) loads: rows [ly*4..ly*4+3], cols [lx*2..lx*2+1]
      for (var r = 0; r < 4; r++) {
        let bRow = kBase + ly * 4 + r;
        let bColVec4_0 = i32(wgId.x) * 16 + lx * 2;
        let bColVec4_1 = bColVec4_0 + 1;
        if (bRow < K) {
          if (bColVec4_0 < NVec4) {
            mm_Bsub[ly * 4 + r][lx * 2] = B[bRow * NVec4 + bColVec4_0];
          } else {
            mm_Bsub[ly * 4 + r][lx * 2] = vec4<f32>(0.0);
          }
          if (bColVec4_1 < NVec4) {
            mm_Bsub[ly * 4 + r][lx * 2 + 1] = B[bRow * NVec4 + bColVec4_1];
          } else {
            mm_Bsub[ly * 4 + r][lx * 2 + 1] = vec4<f32>(0.0);
          }
        } else {
          mm_Bsub[ly * 4 + r][lx * 2] = vec4<f32>(0.0);
          mm_Bsub[ly * 4 + r][lx * 2 + 1] = vec4<f32>(0.0);
        }
      }

      workgroupBarrier();

      // COMPUTE: B-caching pattern over 32 K values (8 iterations \xD7 4 K per iter)
      for (var k = 0; k < 8; k++) {
        // Cache 4 B rows \xD7 2 vec4 cols into registers
        let bc00 = mm_Bsub[k * 4 + 0][lx * 2];     let bc01 = mm_Bsub[k * 4 + 0][lx * 2 + 1];
        let bc10 = mm_Bsub[k * 4 + 1][lx * 2];     let bc11 = mm_Bsub[k * 4 + 1][lx * 2 + 1];
        let bc20 = mm_Bsub[k * 4 + 2][lx * 2];     let bc21 = mm_Bsub[k * 4 + 2][lx * 2 + 1];
        let bc30 = mm_Bsub[k * 4 + 3][lx * 2];     let bc31 = mm_Bsub[k * 4 + 3][lx * 2 + 1];

        // Process 8 output rows
        let a0 = mm_Asub[ly * 8 + 0][k];
        acc00 = fma(bc00, vec4<f32>(a0[0]), acc00); acc01 = fma(bc01, vec4<f32>(a0[0]), acc01);
        acc00 = fma(bc10, vec4<f32>(a0[1]), acc00); acc01 = fma(bc11, vec4<f32>(a0[1]), acc01);
        acc00 = fma(bc20, vec4<f32>(a0[2]), acc00); acc01 = fma(bc21, vec4<f32>(a0[2]), acc01);
        acc00 = fma(bc30, vec4<f32>(a0[3]), acc00); acc01 = fma(bc31, vec4<f32>(a0[3]), acc01);

        let a1 = mm_Asub[ly * 8 + 1][k];
        acc10 = fma(bc00, vec4<f32>(a1[0]), acc10); acc11 = fma(bc01, vec4<f32>(a1[0]), acc11);
        acc10 = fma(bc10, vec4<f32>(a1[1]), acc10); acc11 = fma(bc11, vec4<f32>(a1[1]), acc11);
        acc10 = fma(bc20, vec4<f32>(a1[2]), acc10); acc11 = fma(bc21, vec4<f32>(a1[2]), acc11);
        acc10 = fma(bc30, vec4<f32>(a1[3]), acc10); acc11 = fma(bc31, vec4<f32>(a1[3]), acc11);

        let a2 = mm_Asub[ly * 8 + 2][k];
        acc20 = fma(bc00, vec4<f32>(a2[0]), acc20); acc21 = fma(bc01, vec4<f32>(a2[0]), acc21);
        acc20 = fma(bc10, vec4<f32>(a2[1]), acc20); acc21 = fma(bc11, vec4<f32>(a2[1]), acc21);
        acc20 = fma(bc20, vec4<f32>(a2[2]), acc20); acc21 = fma(bc21, vec4<f32>(a2[2]), acc21);
        acc20 = fma(bc30, vec4<f32>(a2[3]), acc20); acc21 = fma(bc31, vec4<f32>(a2[3]), acc21);

        let a3 = mm_Asub[ly * 8 + 3][k];
        acc30 = fma(bc00, vec4<f32>(a3[0]), acc30); acc31 = fma(bc01, vec4<f32>(a3[0]), acc31);
        acc30 = fma(bc10, vec4<f32>(a3[1]), acc30); acc31 = fma(bc11, vec4<f32>(a3[1]), acc31);
        acc30 = fma(bc20, vec4<f32>(a3[2]), acc30); acc31 = fma(bc21, vec4<f32>(a3[2]), acc31);
        acc30 = fma(bc30, vec4<f32>(a3[3]), acc30); acc31 = fma(bc31, vec4<f32>(a3[3]), acc31);

        let a4 = mm_Asub[ly * 8 + 4][k];
        acc40 = fma(bc00, vec4<f32>(a4[0]), acc40); acc41 = fma(bc01, vec4<f32>(a4[0]), acc41);
        acc40 = fma(bc10, vec4<f32>(a4[1]), acc40); acc41 = fma(bc11, vec4<f32>(a4[1]), acc41);
        acc40 = fma(bc20, vec4<f32>(a4[2]), acc40); acc41 = fma(bc21, vec4<f32>(a4[2]), acc41);
        acc40 = fma(bc30, vec4<f32>(a4[3]), acc40); acc41 = fma(bc31, vec4<f32>(a4[3]), acc41);

        let a5 = mm_Asub[ly * 8 + 5][k];
        acc50 = fma(bc00, vec4<f32>(a5[0]), acc50); acc51 = fma(bc01, vec4<f32>(a5[0]), acc51);
        acc50 = fma(bc10, vec4<f32>(a5[1]), acc50); acc51 = fma(bc11, vec4<f32>(a5[1]), acc51);
        acc50 = fma(bc20, vec4<f32>(a5[2]), acc50); acc51 = fma(bc21, vec4<f32>(a5[2]), acc51);
        acc50 = fma(bc30, vec4<f32>(a5[3]), acc50); acc51 = fma(bc31, vec4<f32>(a5[3]), acc51);

        let a6 = mm_Asub[ly * 8 + 6][k];
        acc60 = fma(bc00, vec4<f32>(a6[0]), acc60); acc61 = fma(bc01, vec4<f32>(a6[0]), acc61);
        acc60 = fma(bc10, vec4<f32>(a6[1]), acc60); acc61 = fma(bc11, vec4<f32>(a6[1]), acc61);
        acc60 = fma(bc20, vec4<f32>(a6[2]), acc60); acc61 = fma(bc21, vec4<f32>(a6[2]), acc61);
        acc60 = fma(bc30, vec4<f32>(a6[3]), acc60); acc61 = fma(bc31, vec4<f32>(a6[3]), acc61);

        let a7 = mm_Asub[ly * 8 + 7][k];
        acc70 = fma(bc00, vec4<f32>(a7[0]), acc70); acc71 = fma(bc01, vec4<f32>(a7[0]), acc71);
        acc70 = fma(bc10, vec4<f32>(a7[1]), acc70); acc71 = fma(bc11, vec4<f32>(a7[1]), acc71);
        acc70 = fma(bc20, vec4<f32>(a7[2]), acc70); acc71 = fma(bc21, vec4<f32>(a7[2]), acc71);
        acc70 = fma(bc30, vec4<f32>(a7[3]), acc70); acc71 = fma(bc31, vec4<f32>(a7[3]), acc71);
      }
      workgroupBarrier();
    }

    // WRITE OUTPUT: 8 rows \xD7 2 vec4 cols
    for (var r = 0; r < 8; r++) {
      let outRow = globalRowStart + r;
      if (outRow < M) {
        let cv4_0 = globalColVec4Start;
        let cv4_1 = cv4_0 + 1;
        if (cv4_0 < NVec4) {
          switch (r) {
            case 0: { C[outRow * NVec4 + cv4_0] = acc00; }
            case 1: { C[outRow * NVec4 + cv4_0] = acc10; }
            case 2: { C[outRow * NVec4 + cv4_0] = acc20; }
            case 3: { C[outRow * NVec4 + cv4_0] = acc30; }
            case 4: { C[outRow * NVec4 + cv4_0] = acc40; }
            case 5: { C[outRow * NVec4 + cv4_0] = acc50; }
            case 6: { C[outRow * NVec4 + cv4_0] = acc60; }
            case 7: { C[outRow * NVec4 + cv4_0] = acc70; }
            default: {}
          }
        }
        if (cv4_1 < NVec4) {
          switch (r) {
            case 0: { C[outRow * NVec4 + cv4_1] = acc01; }
            case 1: { C[outRow * NVec4 + cv4_1] = acc11; }
            case 2: { C[outRow * NVec4 + cv4_1] = acc21; }
            case 3: { C[outRow * NVec4 + cv4_1] = acc31; }
            case 4: { C[outRow * NVec4 + cv4_1] = acc41; }
            case 5: { C[outRow * NVec4 + cv4_1] = acc51; }
            case 6: { C[outRow * NVec4 + cv4_1] = acc61; }
            case 7: { C[outRow * NVec4 + cv4_1] = acc71; }
            default: {}
          }
        }
      }
    }
  }
`),
      (qt = `
  struct Uniforms { M: u32, K: u32, N: u32, _pad: u32, }
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<vec4<f32>>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 64>;
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 16>, 32>;

  @compute @workgroup_size(8, 8, 1)
  fn main(@builtin(local_invocation_id) localId: vec3<u32>,
          @builtin(workgroup_id) wgId: vec3<u32>) {
    let K = i32(uniforms.K);
    let N = i32(uniforms.N);
    let KVec4 = K / 4;
    let NVec4 = N / 4;

    let lx = i32(localId.x);
    let ly = i32(localId.y);
    let globalRowStart = i32(wgId.y) * 64 + ly * 8;
    let globalColVec4Start = i32(wgId.x) * 16 + lx * 2;

    var acc00 = vec4<f32>(0.0); var acc01 = vec4<f32>(0.0);
    var acc10 = vec4<f32>(0.0); var acc11 = vec4<f32>(0.0);
    var acc20 = vec4<f32>(0.0); var acc21 = vec4<f32>(0.0);
    var acc30 = vec4<f32>(0.0); var acc31 = vec4<f32>(0.0);
    var acc40 = vec4<f32>(0.0); var acc41 = vec4<f32>(0.0);
    var acc50 = vec4<f32>(0.0); var acc51 = vec4<f32>(0.0);
    var acc60 = vec4<f32>(0.0); var acc61 = vec4<f32>(0.0);
    var acc70 = vec4<f32>(0.0); var acc71 = vec4<f32>(0.0);

    let numTiles = K / 32;

    for (var t = 0; t < numTiles; t++) {
      let kBase = t * 32;

      // LOAD A TILE: no bounds checking
      for (var r = 0; r < 8; r++) {
        let aRow = globalRowStart + r;
        let aKVec4 = (kBase / 4) + lx;
        mm_Asub[ly * 8 + r][lx] = A[aRow * KVec4 + aKVec4];
      }

      // LOAD B TILE: no bounds checking
      for (var r = 0; r < 4; r++) {
        let bRow = kBase + ly * 4 + r;
        let bColVec4_0 = i32(wgId.x) * 16 + lx * 2;
        let bColVec4_1 = bColVec4_0 + 1;
        mm_Bsub[ly * 4 + r][lx * 2] = B[bRow * NVec4 + bColVec4_0];
        mm_Bsub[ly * 4 + r][lx * 2 + 1] = B[bRow * NVec4 + bColVec4_1];
      }

      workgroupBarrier();

      // COMPUTE: fully unrolled 8 iterations \xD7 8 rows \xD7 4 K values
      for (var k = 0; k < 8; k++) {
        let bc00 = mm_Bsub[k * 4 + 0][lx * 2];     let bc01 = mm_Bsub[k * 4 + 0][lx * 2 + 1];
        let bc10 = mm_Bsub[k * 4 + 1][lx * 2];     let bc11 = mm_Bsub[k * 4 + 1][lx * 2 + 1];
        let bc20 = mm_Bsub[k * 4 + 2][lx * 2];     let bc21 = mm_Bsub[k * 4 + 2][lx * 2 + 1];
        let bc30 = mm_Bsub[k * 4 + 3][lx * 2];     let bc31 = mm_Bsub[k * 4 + 3][lx * 2 + 1];

        let a0 = mm_Asub[ly * 8 + 0][k];
        acc00 = fma(bc00, vec4<f32>(a0[0]), acc00); acc01 = fma(bc01, vec4<f32>(a0[0]), acc01);
        acc00 = fma(bc10, vec4<f32>(a0[1]), acc00); acc01 = fma(bc11, vec4<f32>(a0[1]), acc01);
        acc00 = fma(bc20, vec4<f32>(a0[2]), acc00); acc01 = fma(bc21, vec4<f32>(a0[2]), acc01);
        acc00 = fma(bc30, vec4<f32>(a0[3]), acc00); acc01 = fma(bc31, vec4<f32>(a0[3]), acc01);

        let a1 = mm_Asub[ly * 8 + 1][k];
        acc10 = fma(bc00, vec4<f32>(a1[0]), acc10); acc11 = fma(bc01, vec4<f32>(a1[0]), acc11);
        acc10 = fma(bc10, vec4<f32>(a1[1]), acc10); acc11 = fma(bc11, vec4<f32>(a1[1]), acc11);
        acc10 = fma(bc20, vec4<f32>(a1[2]), acc10); acc11 = fma(bc21, vec4<f32>(a1[2]), acc11);
        acc10 = fma(bc30, vec4<f32>(a1[3]), acc10); acc11 = fma(bc31, vec4<f32>(a1[3]), acc11);

        let a2 = mm_Asub[ly * 8 + 2][k];
        acc20 = fma(bc00, vec4<f32>(a2[0]), acc20); acc21 = fma(bc01, vec4<f32>(a2[0]), acc21);
        acc20 = fma(bc10, vec4<f32>(a2[1]), acc20); acc21 = fma(bc11, vec4<f32>(a2[1]), acc21);
        acc20 = fma(bc20, vec4<f32>(a2[2]), acc20); acc21 = fma(bc21, vec4<f32>(a2[2]), acc21);
        acc20 = fma(bc30, vec4<f32>(a2[3]), acc20); acc21 = fma(bc31, vec4<f32>(a2[3]), acc21);

        let a3 = mm_Asub[ly * 8 + 3][k];
        acc30 = fma(bc00, vec4<f32>(a3[0]), acc30); acc31 = fma(bc01, vec4<f32>(a3[0]), acc31);
        acc30 = fma(bc10, vec4<f32>(a3[1]), acc30); acc31 = fma(bc11, vec4<f32>(a3[1]), acc31);
        acc30 = fma(bc20, vec4<f32>(a3[2]), acc30); acc31 = fma(bc21, vec4<f32>(a3[2]), acc31);
        acc30 = fma(bc30, vec4<f32>(a3[3]), acc30); acc31 = fma(bc31, vec4<f32>(a3[3]), acc31);

        let a4 = mm_Asub[ly * 8 + 4][k];
        acc40 = fma(bc00, vec4<f32>(a4[0]), acc40); acc41 = fma(bc01, vec4<f32>(a4[0]), acc41);
        acc40 = fma(bc10, vec4<f32>(a4[1]), acc40); acc41 = fma(bc11, vec4<f32>(a4[1]), acc41);
        acc40 = fma(bc20, vec4<f32>(a4[2]), acc40); acc41 = fma(bc21, vec4<f32>(a4[2]), acc41);
        acc40 = fma(bc30, vec4<f32>(a4[3]), acc40); acc41 = fma(bc31, vec4<f32>(a4[3]), acc41);

        let a5 = mm_Asub[ly * 8 + 5][k];
        acc50 = fma(bc00, vec4<f32>(a5[0]), acc50); acc51 = fma(bc01, vec4<f32>(a5[0]), acc51);
        acc50 = fma(bc10, vec4<f32>(a5[1]), acc50); acc51 = fma(bc11, vec4<f32>(a5[1]), acc51);
        acc50 = fma(bc20, vec4<f32>(a5[2]), acc50); acc51 = fma(bc21, vec4<f32>(a5[2]), acc51);
        acc50 = fma(bc30, vec4<f32>(a5[3]), acc50); acc51 = fma(bc31, vec4<f32>(a5[3]), acc51);

        let a6 = mm_Asub[ly * 8 + 6][k];
        acc60 = fma(bc00, vec4<f32>(a6[0]), acc60); acc61 = fma(bc01, vec4<f32>(a6[0]), acc61);
        acc60 = fma(bc10, vec4<f32>(a6[1]), acc60); acc61 = fma(bc11, vec4<f32>(a6[1]), acc61);
        acc60 = fma(bc20, vec4<f32>(a6[2]), acc60); acc61 = fma(bc21, vec4<f32>(a6[2]), acc61);
        acc60 = fma(bc30, vec4<f32>(a6[3]), acc60); acc61 = fma(bc31, vec4<f32>(a6[3]), acc61);

        let a7 = mm_Asub[ly * 8 + 7][k];
        acc70 = fma(bc00, vec4<f32>(a7[0]), acc70); acc71 = fma(bc01, vec4<f32>(a7[0]), acc71);
        acc70 = fma(bc10, vec4<f32>(a7[1]), acc70); acc71 = fma(bc11, vec4<f32>(a7[1]), acc71);
        acc70 = fma(bc20, vec4<f32>(a7[2]), acc70); acc71 = fma(bc21, vec4<f32>(a7[2]), acc71);
        acc70 = fma(bc30, vec4<f32>(a7[3]), acc70); acc71 = fma(bc31, vec4<f32>(a7[3]), acc71);
      }
      workgroupBarrier();
    }

    // WRITE OUTPUT: 8 rows \xD7 2 vec4 cols, no bounds checking
    C[globalRowStart * NVec4 + globalColVec4Start] = acc00;
    C[globalRowStart * NVec4 + globalColVec4Start + 1] = acc01;
    C[(globalRowStart + 1) * NVec4 + globalColVec4Start] = acc10;
    C[(globalRowStart + 1) * NVec4 + globalColVec4Start + 1] = acc11;
    C[(globalRowStart + 2) * NVec4 + globalColVec4Start] = acc20;
    C[(globalRowStart + 2) * NVec4 + globalColVec4Start + 1] = acc21;
    C[(globalRowStart + 3) * NVec4 + globalColVec4Start] = acc30;
    C[(globalRowStart + 3) * NVec4 + globalColVec4Start + 1] = acc31;
    C[(globalRowStart + 4) * NVec4 + globalColVec4Start] = acc40;
    C[(globalRowStart + 4) * NVec4 + globalColVec4Start + 1] = acc41;
    C[(globalRowStart + 5) * NVec4 + globalColVec4Start] = acc50;
    C[(globalRowStart + 5) * NVec4 + globalColVec4Start + 1] = acc51;
    C[(globalRowStart + 6) * NVec4 + globalColVec4Start] = acc60;
    C[(globalRowStart + 6) * NVec4 + globalColVec4Start + 1] = acc61;
    C[(globalRowStart + 7) * NVec4 + globalColVec4Start] = acc70;
    C[(globalRowStart + 7) * NVec4 + globalColVec4Start + 1] = acc71;
  }
`),
      (Ht = `
  struct Uniforms {
    M: u32,
    K: u32,
    N: u32,
    NPadded: u32,
  }

  // Same tile configuration as ULTRA_OPTIMIZED
  const BLOCK_M: u32 = 64u;
  const BLOCK_N: u32 = 64u;
  const BLOCK_K: u32 = 32u;
  const THREAD_M: u32 = 4u;
  const THREAD_N: u32 = 4u;
  const BLOCK_M_PADDED: u32 = 65u;

  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<f32>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<vec4<f32>>;

  var<workgroup> As: array<f32, 2080>;       // 32 * 65
  var<workgroup> Bs: array<vec4<f32>, 544>;  // 32 * 17 (padded to avoid bank conflicts)
  const BLOCK_N_VEC4_PADDED: u32 = 17u;  // 16 + 1 for bank conflict avoidance

  @compute @workgroup_size(16, 16)
  fn main(
    @builtin(global_invocation_id) gid: vec3<u32>,
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let K = uniforms.K;
    let NVec4 = uniforms.NPadded / 4u;
    let NVec4Out = uniforms.N / 4u;

    let tx = lid.x;
    let ty = lid.y;
    let tid = ty * 16u + tx;

    let outRowBase = wid.y * BLOCK_M + ty * THREAD_M;
    let outColVec4 = wid.x * (BLOCK_N / 4u) + tx;

    var acc0: vec4<f32> = vec4<f32>(0.0);
    var acc1: vec4<f32> = vec4<f32>(0.0);
    var acc2: vec4<f32> = vec4<f32>(0.0);
    var acc3: vec4<f32> = vec4<f32>(0.0);

    let numTiles = K / BLOCK_K;  // Exact division - no remainder!

    for (var t: u32 = 0u; t < numTiles; t = t + 1u) {
      // === Load A tile (NO BOUNDS CHECKING) ===
      for (var i: u32 = 0u; i < 8u; i = i + 1u) {
        let loadIdx = tid * 8u + i;
        let loadK = loadIdx / BLOCK_M;
        let loadRow = loadIdx % BLOCK_M;
        let globalK = t * BLOCK_K + loadK;
        let globalRow = wid.y * BLOCK_M + loadRow;
        As[loadK * BLOCK_M_PADDED + loadRow] = A[globalRow * K + globalK];
      }

      // === Load B tile (NO BOUNDS CHECKING) ===
      for (var i: u32 = 0u; i < 2u; i = i + 1u) {
        let loadIdx = tid * 2u + i;
        let loadK = loadIdx / 16u;
        let loadColVec = loadIdx % 16u;
        let globalK = t * BLOCK_K + loadK;
        let globalColVec = wid.x * 16u + loadColVec;
        Bs[loadK * BLOCK_N_VEC4_PADDED + loadColVec] = B[globalK * NVec4 + globalColVec];
      }

      workgroupBarrier();

      // === Compute - FULLY unrolled K loop (all 32 iterations, no loop at all) ===
      let aRowBase = ty * THREAD_M;
      // K = 0-31 fully unrolled with no loop overhead
      { let a0 = As[0u * BLOCK_M_PADDED + aRowBase]; let a1 = As[0u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[0u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[0u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[0u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[1u * BLOCK_M_PADDED + aRowBase]; let a1 = As[1u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[1u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[1u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[1u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[2u * BLOCK_M_PADDED + aRowBase]; let a1 = As[2u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[2u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[2u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[2u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[3u * BLOCK_M_PADDED + aRowBase]; let a1 = As[3u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[3u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[3u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[3u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[4u * BLOCK_M_PADDED + aRowBase]; let a1 = As[4u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[4u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[4u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[4u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[5u * BLOCK_M_PADDED + aRowBase]; let a1 = As[5u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[5u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[5u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[5u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[6u * BLOCK_M_PADDED + aRowBase]; let a1 = As[6u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[6u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[6u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[6u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[7u * BLOCK_M_PADDED + aRowBase]; let a1 = As[7u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[7u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[7u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[7u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[8u * BLOCK_M_PADDED + aRowBase]; let a1 = As[8u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[8u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[8u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[8u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[9u * BLOCK_M_PADDED + aRowBase]; let a1 = As[9u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[9u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[9u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[9u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[10u * BLOCK_M_PADDED + aRowBase]; let a1 = As[10u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[10u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[10u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[10u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[11u * BLOCK_M_PADDED + aRowBase]; let a1 = As[11u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[11u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[11u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[11u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[12u * BLOCK_M_PADDED + aRowBase]; let a1 = As[12u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[12u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[12u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[12u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[13u * BLOCK_M_PADDED + aRowBase]; let a1 = As[13u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[13u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[13u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[13u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[14u * BLOCK_M_PADDED + aRowBase]; let a1 = As[14u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[14u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[14u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[14u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[15u * BLOCK_M_PADDED + aRowBase]; let a1 = As[15u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[15u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[15u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[15u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[16u * BLOCK_M_PADDED + aRowBase]; let a1 = As[16u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[16u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[16u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[16u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[17u * BLOCK_M_PADDED + aRowBase]; let a1 = As[17u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[17u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[17u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[17u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[18u * BLOCK_M_PADDED + aRowBase]; let a1 = As[18u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[18u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[18u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[18u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[19u * BLOCK_M_PADDED + aRowBase]; let a1 = As[19u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[19u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[19u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[19u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[20u * BLOCK_M_PADDED + aRowBase]; let a1 = As[20u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[20u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[20u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[20u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[21u * BLOCK_M_PADDED + aRowBase]; let a1 = As[21u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[21u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[21u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[21u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[22u * BLOCK_M_PADDED + aRowBase]; let a1 = As[22u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[22u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[22u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[22u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[23u * BLOCK_M_PADDED + aRowBase]; let a1 = As[23u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[23u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[23u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[23u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[24u * BLOCK_M_PADDED + aRowBase]; let a1 = As[24u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[24u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[24u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[24u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[25u * BLOCK_M_PADDED + aRowBase]; let a1 = As[25u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[25u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[25u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[25u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[26u * BLOCK_M_PADDED + aRowBase]; let a1 = As[26u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[26u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[26u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[26u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[27u * BLOCK_M_PADDED + aRowBase]; let a1 = As[27u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[27u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[27u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[27u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[28u * BLOCK_M_PADDED + aRowBase]; let a1 = As[28u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[28u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[28u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[28u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[29u * BLOCK_M_PADDED + aRowBase]; let a1 = As[29u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[29u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[29u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[29u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[30u * BLOCK_M_PADDED + aRowBase]; let a1 = As[30u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[30u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[30u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[30u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }
      { let a0 = As[31u * BLOCK_M_PADDED + aRowBase]; let a1 = As[31u * BLOCK_M_PADDED + aRowBase + 1u]; let a2 = As[31u * BLOCK_M_PADDED + aRowBase + 2u]; let a3 = As[31u * BLOCK_M_PADDED + aRowBase + 3u]; let b = Bs[31u * BLOCK_N_VEC4_PADDED + tx]; acc0 = fma(vec4<f32>(a0), b, acc0); acc1 = fma(vec4<f32>(a1), b, acc1); acc2 = fma(vec4<f32>(a2), b, acc2); acc3 = fma(vec4<f32>(a3), b, acc3); }

      workgroupBarrier();
    }

    // === Write output (NO BOUNDS CHECKING) ===
    C[(outRowBase + 0u) * NVec4Out + outColVec4] = acc0;
    C[(outRowBase + 1u) * NVec4Out + outColVec4] = acc1;
    C[(outRowBase + 2u) * NVec4Out + outColVec4] = acc2;
    C[(outRowBase + 3u) * NVec4Out + outColVec4] = acc3;
  }
`),
      (Yt = `
  struct Uniforms {
    M: u32,
    K: u32,
    N: u32,
    NPadded: u32,
  }

  // [8,8] workgroup, 4x4 elements per thread
  const WG_X: u32 = 8u;
  const WG_Y: u32 = 8u;
  const ROW_PER_THREAD: u32 = 4u;
  const COL_PER_THREAD: u32 = 4u;
  const TILE_A_OUTER: u32 = 32u;  // WG_Y * ROW_PER_THREAD
  const TILE_B_OUTER: u32 = 32u;  // WG_X * COL_PER_THREAD
  const TILE_INNER: u32 = 32u;
  const INNER_ELEMENT_SIZE: u32 = 4u;  // tileInner / WG_X = 32 / 8

  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<f32>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<f32>;

  // A: [tileAOuter][tileInner/4] = [32][8] of vec4 (each row has 8 vec4s = 32 K values)
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 32>;
  // B: [tileInner][tileBOuter/4] = [32][8] of vec4
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 8>, 32>;

  @compute @workgroup_size(8, 8)
  fn main(
    @builtin(global_invocation_id) gid: vec3<u32>,
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let M = uniforms.M;
    let K = uniforms.K;
    let N = uniforms.N;
    let NPadded = uniforms.NPadded;
    let NVec4 = NPadded / 4u;

    let localRow = i32(lid.y);  // 0-7
    let localCol = i32(lid.x);  // 0-7
    let tileRow = localRow * i32(ROW_PER_THREAD);  // Output row in tile
    let tileCol = localCol;  // vec4 column index

    let globalRow = i32(gid.y) * i32(ROW_PER_THREAD);
    let globalCol = i32(gid.x) * i32(COL_PER_THREAD);
    let globalRowStart = i32(wid.y) * i32(TILE_A_OUTER);

    let numTiles = (i32(K) + i32(TILE_INNER) - 1) / i32(TILE_INNER);
    let rowPerThreadB = TILE_INNER / WG_Y;  // 32 / 8 = 4

    var acc: array<vec4<f32>, 4>;
    for (var i = 0u; i < 4u; i++) { acc[i] = vec4<f32>(0.0); }

    var kStart = 0;
    let tileRowB = localRow * i32(rowPerThreadB);

    for (var t = 0; t < numTiles; t++) {
      // Load A: each thread loads rowPerThread rows, 1 vec4 per row
      // mm_Asub[row][col] = A[globalRow + row, kStart + col*4 : col*4+4]
      for (var innerRow = 0u; innerRow < ROW_PER_THREAD; innerRow++) {
        let inputRow = u32(tileRow) + innerRow;
        let inputCol = u32(localCol);  // vec4 column (0-7)
        let gRow = globalRow + i32(innerRow);
        let gKBase = kStart + i32(inputCol) * 4;

        var v: vec4<f32> = vec4<f32>(0.0);
        if (gRow < i32(M) && gKBase + 3 < i32(K)) {
          let base = u32(gRow) * K + u32(gKBase);
          v = vec4<f32>(A[base], A[base+1u], A[base+2u], A[base+3u]);
        } else if (gRow < i32(M)) {
          let base = u32(gRow) * K + u32(gKBase);
          if (gKBase < i32(K)) { v.x = A[base]; }
          if (gKBase + 1 < i32(K)) { v.y = A[base+1u]; }
          if (gKBase + 2 < i32(K)) { v.z = A[base+2u]; }
          if (gKBase + 3 < i32(K)) { v.w = A[base+3u]; }
        }
        mm_Asub[inputRow][inputCol] = v;
      }

      // Load B: each thread loads rowPerThreadB rows (K values), 1 vec4 per row
      for (var innerRow = 0u; innerRow < rowPerThreadB; innerRow++) {
        let inputRow = u32(tileRowB) + innerRow;
        let inputCol = u32(localCol);
        let gK = kStart + i32(inputRow);
        let gColVec = wid.x * (TILE_B_OUTER / 4u) + inputCol;

        var v: vec4<f32> = vec4<f32>(0.0);
        if (gK < i32(K) && gColVec < NVec4) {
          v = B[u32(gK) * NVec4 + gColVec];
        }
        mm_Bsub[inputRow][inputCol] = v;
      }

      kStart = kStart + i32(TILE_INNER);
      workgroupBarrier();

      // Compute: K loop processes 4 K values at a time (matching innerElementSize)
      // Total: 32 K values / 4 = 8 iterations
      for (var k = 0u; k < 8u; k++) {
        // Load 4 B vec4s at once
        let BCached0 = mm_Bsub[k * 4u + 0u][u32(localCol)];
        let BCached1 = mm_Bsub[k * 4u + 1u][u32(localCol)];
        let BCached2 = mm_Bsub[k * 4u + 2u][u32(localCol)];
        let BCached3 = mm_Bsub[k * 4u + 3u][u32(localCol)];

        // For each output row
        for (var i = 0u; i < 4u; i++) {
          // Load A vec4 (4 consecutive K values for this row)
          let ACached = mm_Asub[u32(tileRow) + i][k];
          // Multiply each A component with corresponding B vec4
          acc[i] = fma(vec4<f32>(ACached.x), BCached0, acc[i]);
          acc[i] = fma(vec4<f32>(ACached.y), BCached1, acc[i]);
          acc[i] = fma(vec4<f32>(ACached.z), BCached2, acc[i]);
          acc[i] = fma(vec4<f32>(ACached.w), BCached3, acc[i]);
        }
      }

      workgroupBarrier();
    }

    // Write output
    for (var innerRow = 0u; innerRow < 4u; innerRow++) {
      let row = globalRow + i32(innerRow);
      if (row < i32(M)) {
        for (var innerCol = 0u; innerCol < 4u; innerCol++) {
          let col = globalCol + i32(innerCol);
          if (col < i32(N)) {
            C[u32(row) * N + u32(col)] = acc[innerRow][innerCol];
          }
        }
      }
    }
  }
`),
      (jt = `
  struct Uniforms {
    M: u32,
    K: u32,
    N: u32,
    NPadded: u32,
  }

  // [8,8] workgroup, 4x4 elements per thread = 32x32 tiles
  const TILE_M: u32 = 32u;
  const TILE_N: u32 = 32u;
  const TILE_K: u32 = 32u;

  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage, read> A: array<f32>;
  @group(0) @binding(2) var<storage, read> B: array<vec4<f32>>;
  @group(0) @binding(3) var<storage, read_write> C: array<f32>;

  // 2D array syntax like tfjs for potentially better compilation
  var<workgroup> mm_Asub: array<array<vec4<f32>, 8>, 32>;  // [32][8] vec4 = 32 rows x 32 K values
  var<workgroup> mm_Bsub: array<array<vec4<f32>, 8>, 32>;  // [32][8] vec4 = 32 K values x 32 cols

  @compute @workgroup_size(8, 8)
  fn main(
    @builtin(global_invocation_id) gid: vec3<u32>,
    @builtin(local_invocation_id) lid: vec3<u32>,
    @builtin(workgroup_id) wid: vec3<u32>
  ) {
    let K = uniforms.K;
    let N = uniforms.N;
    let NVec4 = uniforms.NPadded / 4u;

    let localRow = lid.y;  // 0-7
    let localCol = lid.x;  // 0-7
    let tileRow = localRow * 4u;  // Output row in tile (0, 4, 8, ..., 28)

    let globalRow = gid.y * 4u;  // Global output row
    let globalCol = gid.x * 4u;  // Global output col

    let numTiles = K / TILE_K;  // Exact division - no remainder!

    var acc0: vec4<f32> = vec4<f32>(0.0);
    var acc1: vec4<f32> = vec4<f32>(0.0);
    var acc2: vec4<f32> = vec4<f32>(0.0);
    var acc3: vec4<f32> = vec4<f32>(0.0);

    var kStart: u32 = 0u;

    for (var t: u32 = 0u; t < numTiles; t++) {
      // Load A: each thread loads 4 rows, 1 vec4 per row (4 K values)
      // Total: 64 threads * 4 vec4s = 256 vec4s = 32 rows * 8 vec4s
      for (var i: u32 = 0u; i < 4u; i++) {
        let row = tileRow + i;
        let col = localCol;  // vec4 column (0-7)
        let gRow = wid.y * TILE_M + row;
        let gKBase = kStart + col * 4u;
        let base = gRow * K + gKBase;
        mm_Asub[row][col] = vec4<f32>(A[base], A[base+1u], A[base+2u], A[base+3u]);
      }

      // Load B: each thread loads 4 rows (K values), 1 vec4 per row
      // Total: 64 threads * 4 vec4s = 256 vec4s = 32 K * 8 vec4s
      for (var i: u32 = 0u; i < 4u; i++) {
        let kRow = localRow * 4u + i;  // K index (0-31)
        let colVec = localCol;  // vec4 column (0-7)
        let gK = kStart + kRow;
        let gColVec = wid.x * 8u + colVec;  // 32 / 4 = 8 vec4s per tile
        mm_Bsub[kRow][colVec] = B[gK * NVec4 + gColVec];
      }

      kStart = kStart + TILE_K;
      workgroupBarrier();

      // Compute: process 4 K values at a time, 8 iterations
      for (var k: u32 = 0u; k < 8u; k++) {
        // Cache 4 B vec4s
        let BCached0 = mm_Bsub[k * 4u + 0u][localCol];
        let BCached1 = mm_Bsub[k * 4u + 1u][localCol];
        let BCached2 = mm_Bsub[k * 4u + 2u][localCol];
        let BCached3 = mm_Bsub[k * 4u + 3u][localCol];

        // Load A vec4s and compute
        let ACached0 = mm_Asub[tileRow + 0u][k];
        let ACached1 = mm_Asub[tileRow + 1u][k];
        let ACached2 = mm_Asub[tileRow + 2u][k];
        let ACached3 = mm_Asub[tileRow + 3u][k];

        acc0 = fma(vec4<f32>(ACached0.x), BCached0, acc0);
        acc0 = fma(vec4<f32>(ACached0.y), BCached1, acc0);
        acc0 = fma(vec4<f32>(ACached0.z), BCached2, acc0);
        acc0 = fma(vec4<f32>(ACached0.w), BCached3, acc0);

        acc1 = fma(vec4<f32>(ACached1.x), BCached0, acc1);
        acc1 = fma(vec4<f32>(ACached1.y), BCached1, acc1);
        acc1 = fma(vec4<f32>(ACached1.z), BCached2, acc1);
        acc1 = fma(vec4<f32>(ACached1.w), BCached3, acc1);

        acc2 = fma(vec4<f32>(ACached2.x), BCached0, acc2);
        acc2 = fma(vec4<f32>(ACached2.y), BCached1, acc2);
        acc2 = fma(vec4<f32>(ACached2.z), BCached2, acc2);
        acc2 = fma(vec4<f32>(ACached2.w), BCached3, acc2);

        acc3 = fma(vec4<f32>(ACached3.x), BCached0, acc3);
        acc3 = fma(vec4<f32>(ACached3.y), BCached1, acc3);
        acc3 = fma(vec4<f32>(ACached3.z), BCached2, acc3);
        acc3 = fma(vec4<f32>(ACached3.w), BCached3, acc3);
      }

      workgroupBarrier();
    }

    // Write output (NO BOUNDS CHECKING)
    let outBase0 = (globalRow + 0u) * N + globalCol;
    let outBase1 = (globalRow + 1u) * N + globalCol;
    let outBase2 = (globalRow + 2u) * N + globalCol;
    let outBase3 = (globalRow + 3u) * N + globalCol;

    C[outBase0 + 0u] = acc0.x;
    C[outBase0 + 1u] = acc0.y;
    C[outBase0 + 2u] = acc0.z;
    C[outBase0 + 3u] = acc0.w;

    C[outBase1 + 0u] = acc1.x;
    C[outBase1 + 1u] = acc1.y;
    C[outBase1 + 2u] = acc1.z;
    C[outBase1 + 3u] = acc1.w;

    C[outBase2 + 0u] = acc2.x;
    C[outBase2 + 1u] = acc2.y;
    C[outBase2 + 2u] = acc2.z;
    C[outBase2 + 3u] = acc2.w;

    C[outBase3 + 0u] = acc3.x;
    C[outBase3 + 1u] = acc3.y;
    C[outBase3 + 2u] = acc3.z;
    C[outBase3 + 3u] = acc3.w;
  }
`),
      (pe = [
        {
          name: '8X8-MEGA',
          shader: Vt,
          tileM: 64,
          tileN: 64,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !1,
          usesVec4B: !0,
          usesVec4C: !0,
          usesVec4A: !0,
          minSize: 64,
          maxSize: -1,
        },
        {
          name: '8X8-MEGA-FIT',
          shader: qt,
          tileM: 64,
          tileN: 64,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !0,
          usesVec4B: !0,
          usesVec4C: !0,
          usesVec4A: !0,
          minSize: 128,
          maxSize: -1,
        },
        {
          name: 'BCACHE-FIT',
          shader: Ft,
          tileM: 32,
          tileN: 32,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !0,
          usesVec4B: !0,
          usesVec4C: !0,
          usesVec4A: !0,
          minSize: 64,
          maxSize: -1,
        },
        {
          name: 'TFJS-BCACHE',
          shader: Gt,
          tileM: 32,
          tileN: 32,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !1,
          usesVec4B: !0,
          usesVec4C: !0,
          usesVec4A: !0,
          minSize: 64,
          maxSize: -1,
        },
        {
          name: 'BCACHE-WIDE',
          shader: It,
          tileM: 32,
          tileN: 64,
          tileK: 32,
          workgroupSize: [16, 8],
          requiresFit: !0,
          usesVec4B: !0,
          usesVec4C: !0,
          usesVec4A: !0,
          minSize: 128,
          maxSize: -1,
        },
        {
          name: 'BCACHE-TALL',
          shader: zt,
          tileM: 64,
          tileN: 32,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !0,
          usesVec4B: !0,
          usesVec4C: !0,
          usesVec4A: !0,
          minSize: 128,
          maxSize: -1,
        },
        {
          name: 'FIT-64x64',
          shader: Ht,
          tileM: 64,
          tileN: 64,
          tileK: 32,
          workgroupSize: [16, 16],
          requiresFit: !0,
          usesVec4B: !0,
          usesVec4C: !0,
          minSize: 256,
          maxSize: -1,
        },
        {
          name: 'FIT-32x32',
          shader: jt,
          tileM: 32,
          tileN: 32,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !0,
          usesVec4B: !0,
          usesVec4C: !1,
          minSize: 128,
          maxSize: 2048,
        },
        {
          name: 'TFJS-VEC4-INNER',
          shader: Yt,
          tileM: 32,
          tileN: 32,
          tileK: 32,
          workgroupSize: [8, 8],
          requiresFit: !1,
          usesVec4B: !0,
          usesVec4C: !1,
          minSize: 64,
          maxSize: -1,
        },
        {
          name: 'REGISTER-BLOCKED',
          shader: Tt,
          tileM: 64,
          tileN: 64,
          tileK: 16,
          workgroupSize: [16, 16],
          requiresFit: !1,
          usesVec4B: !1,
          usesVec4C: !1,
          minSize: 32,
          maxSize: 512,
        },
      ]),
      (le = new Map()),
      (Wt = {
        '8192x8192x8192': 'BCACHE-TALL',
        '4096x4096x4096': 'BCACHE-TALL',
        '2048x2048x2048': 'BCACHE-TALL',
        '1024x1024x1024': 'BCACHE-TALL',
        '512x512x512': 'BCACHE-FIT',
        '256x256x256': 'BCACHE-FIT',
        '128x128x128': 'BCACHE-FIT',
        '64x64x64': 'TFJS-BCACHE',
      }));
    for (let [v, e] of Object.entries(Wt)) le.set(v, e);
    ((ve = class {
      freeBuffers = new Map();
      usedBuffers = new Map();
      device;
      freeStagingBuffers = new Map();
      usedStagingBuffers = new Map();
      constructor(e) {
        this.device = e;
      }
      getKey(e, a) {
        return `${e}_${a}`;
      }
      acquire(e, a) {
        let t = this.getKey(e, a);
        this.freeBuffers.has(t) || this.freeBuffers.set(t, []);
        let r = this.freeBuffers.get(t),
          c;
        return (
          r.length > 0 ? (c = r.pop()) : (c = this.device.createBuffer({ size: e, usage: a })),
          this.usedBuffers.has(t) || this.usedBuffers.set(t, []),
          this.usedBuffers.get(t).push(c),
          c
        );
      }
      release(e) {
        let a = this.getKey(e.size, e.usage),
          t = this.usedBuffers.get(a);
        if (t) {
          let r = t.indexOf(e);
          r >= 0 && t.splice(r, 1);
        }
        (this.freeBuffers.has(a) || this.freeBuffers.set(a, []), this.freeBuffers.get(a).push(e));
      }
      roundToPowerOf2(e) {
        if (e <= 0) return 1;
        let a = 1;
        for (; a < e; ) a *= 2;
        return a;
      }
      acquireStaging(e) {
        let a = this.roundToPowerOf2(e);
        this.freeStagingBuffers.has(a) || this.freeStagingBuffers.set(a, []);
        let t = this.freeStagingBuffers.get(a),
          r;
        t.length > 0
          ? (r = t.pop())
          : (r = this.device.createBuffer({
              size: a,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }));
        let c = r.size;
        return (
          this.usedStagingBuffers.has(c) || this.usedStagingBuffers.set(c, []),
          this.usedStagingBuffers.get(c).push(r),
          r
        );
      }
      releaseStaging(e) {
        let a = e.size,
          t = this.usedStagingBuffers.get(a);
        if (t) {
          let r = t.indexOf(e);
          r >= 0 && t.splice(r, 1);
        }
        (this.freeStagingBuffers.has(a) || this.freeStagingBuffers.set(a, []),
          this.freeStagingBuffers.get(a).push(e));
      }
      dispose() {
        for (let e of this.freeBuffers.values()) for (let a of e) a.destroy();
        for (let e of this.usedBuffers.values()) for (let a of e) a.destroy();
        for (let e of this.freeStagingBuffers.values()) for (let a of e) a.destroy();
        for (let e of this.usedStagingBuffers.values()) for (let a of e) a.destroy();
        (this.freeBuffers.clear(),
          this.usedBuffers.clear(),
          this.freeStagingBuffers.clear(),
          this.usedStagingBuffers.clear());
      }
    }),
      (_e = class extends ae {
        name = 'webgpu';
        device;
        bufferManager;
        constructor(e) {
          (super(), (this.device = e), (this.bufferManager = new ve(e)));
        }
        pipelineCache = new Map();
        getOrCreatePipeline(e, a) {
          if (this.pipelineCache.has(e)) return this.pipelineCache.get(e);
          let t = this.device.createShaderModule({ code: a }),
            r = this.device.createComputePipeline({
              layout: 'auto',
              compute: { module: t, entryPoint: 'main' },
            });
          return (this.pipelineCache.set(e, r), r);
        }
        createTensor(e, a) {
          return q.fromArray(e, a, this.device);
        }
        runUnaryOpOnTensor(e, a) {
          let t = Ue[a];
          if (!t) throw new Error(`Unknown unary op: ${a}`);
          let r = this.getOrCreatePipeline(`unary_${a}`, t),
            c = e.size,
            o = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(s, 0, new Uint32Array([c]));
          let n = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: o } },
                { binding: 2, resource: { buffer: s } },
              ],
            }),
            i = this.device.createCommandEncoder(),
            u = i.beginComputePass();
          return (
            u.setPipeline(r),
            u.setBindGroup(0, n),
            u.dispatchWorkgroups(Math.ceil(c / 256)),
            u.end(),
            this.device.queue.submit([i.finish()]),
            s.destroy(),
            new q(o, e.shape, this.device)
          );
        }
        runBinaryOpOnTensor(e, a, t) {
          let r = Le[t];
          if (!r) throw new Error(`Unknown binary op: ${t}`);
          if (e.size !== a.size) throw new Error('Shape mismatch');
          let c = this.getOrCreatePipeline(`binary_${t}`, r),
            o = e.size,
            s = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(n, 0, new Uint32Array([o]));
          let i = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: a.buffer } },
                { binding: 2, resource: { buffer: s } },
                { binding: 3, resource: { buffer: n } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          return (
            l.setPipeline(c),
            l.setBindGroup(0, i),
            l.dispatchWorkgroups(Math.ceil(o / 256)),
            l.end(),
            this.device.queue.submit([u.finish()]),
            n.destroy(),
            new q(s, e.shape, this.device)
          );
        }
        toTensor(e) {
          return e instanceof Q ? e.tensor : this.createTensor(e.data, e.shape);
        }
        fromTensor(e, a = re) {
          return new Q(e, a);
        }
        async materializeAll() {
          return He();
        }
        _prepGpuBinaryArgs(e, a) {
          let t = this._toNDArray(e),
            r = this._toNDArray(a),
            c = t.shape,
            o = r.shape;
          if (c.length === o.length && c.every((i, u) => i === o[u])) return [t, r];
          let [s, n] = this.broadcastArrays(t, r);
          return [s, n];
        }
        runScalarOpOnTensor(e, a, t) {
          let r = ke[t];
          if (!r) throw new Error(`Unknown scalar op: ${t}`);
          let c = this.getOrCreatePipeline(`scalar_${t}`, r),
            o = e.size,
            s = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: 8,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            i = new ArrayBuffer(8);
          ((new Uint32Array(i, 0, 1)[0] = o),
            (new Float32Array(i, 4, 1)[0] = a),
            this.device.queue.writeBuffer(n, 0, new Uint8Array(i)));
          let u = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
              ],
            }),
            l = this.device.createCommandEncoder(),
            f = l.beginComputePass();
          return (
            f.setPipeline(c),
            f.setBindGroup(0, u),
            f.dispatchWorkgroups(Math.ceil(o / 256)),
            f.end(),
            this.device.queue.submit([l.finish()]),
            n.destroy(),
            new q(s, e.shape, this.device)
          );
        }
        runModfOnTensor(e) {
          let a = this.getOrCreatePipeline('modf', Ie),
            t = e.size,
            r = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            c = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(o, 0, new Uint32Array([t]));
          let s = this.device.createBindGroup({
              layout: a.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: r } },
                { binding: 2, resource: { buffer: c } },
                { binding: 3, resource: { buffer: o } },
              ],
            }),
            n = this.device.createCommandEncoder(),
            i = n.beginComputePass();
          return (
            i.setPipeline(a),
            i.setBindGroup(0, s),
            i.dispatchWorkgroups(Math.ceil(t / 256)),
            i.end(),
            this.device.queue.submit([n.finish()]),
            o.destroy(),
            { frac: new q(r, e.shape, this.device), integ: new q(c, e.shape, this.device) }
          );
        }
        runFrexpOnTensor(e) {
          let a = this.getOrCreatePipeline('frexp', ze),
            t = e.size,
            r = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            c = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(o, 0, new Uint32Array([t]));
          let s = this.device.createBindGroup({
              layout: a.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: r } },
                { binding: 2, resource: { buffer: c } },
                { binding: 3, resource: { buffer: o } },
              ],
            }),
            n = this.device.createCommandEncoder(),
            i = n.beginComputePass();
          return (
            i.setPipeline(a),
            i.setBindGroup(0, s),
            i.dispatchWorkgroups(Math.ceil(t / 256)),
            i.end(),
            this.device.queue.submit([n.finish()]),
            o.destroy(),
            { mantissa: new q(r, e.shape, this.device), exponent: new q(c, e.shape, this.device) }
          );
        }
        runDivmodOnTensor(e, a) {
          let t = this.getOrCreatePipeline('divmod', Ve),
            r = e.size,
            c = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(s, 0, new Uint32Array([r]));
          let n = this.device.createBindGroup({
              layout: t.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: a.buffer } },
                { binding: 2, resource: { buffer: c } },
                { binding: 3, resource: { buffer: o } },
                { binding: 4, resource: { buffer: s } },
              ],
            }),
            i = this.device.createCommandEncoder(),
            u = i.beginComputePass();
          return (
            u.setPipeline(t),
            u.setBindGroup(0, n),
            u.dispatchWorkgroups(Math.ceil(r / 256)),
            u.end(),
            this.device.queue.submit([i.finish()]),
            s.destroy(),
            { quotient: new q(c, e.shape, this.device), remainder: new q(o, e.shape, this.device) }
          );
        }
        async runReductionOnTensor(e, a) {
          let t = Te[a];
          if (!t) throw new Error(`Unknown reduction op: ${a}`);
          let r = this.getOrCreatePipeline(`reduction_${a}`, t),
            c = e.size,
            o = Math.ceil(c / 256),
            s = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            n = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(n, 0, new Uint32Array([c]));
          let i = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          (l.setPipeline(r), l.setBindGroup(0, i), l.dispatchWorkgroups(o), l.end());
          let f = this.device.createBuffer({
            size: o * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (u.copyBufferToBuffer(s, 0, f, 0, o * 4),
            this.device.queue.submit([u.finish()]),
            await f.mapAsync(GPUMapMode.READ));
          let h = new Float32Array(f.getMappedRange().slice(0));
          f.unmap();
          let m;
          if (a === 'sum') {
            m = 0;
            for (let d = 0; d < o; d++) m += h[d];
          } else if (a === 'prod') {
            m = 1;
            for (let d = 0; d < o; d++) m *= h[d];
          } else if (a === 'min') {
            m = h[0];
            for (let d = 1; d < o; d++) m = Math.min(m, h[d]);
          } else if (a === 'max') {
            m = h[0];
            for (let d = 1; d < o; d++) m = Math.max(m, h[d]);
          } else throw new Error(`Unknown reduction: ${a}`);
          return (s.destroy(), n.destroy(), f.destroy(), m);
        }
        runCumulativeOnTensor(e, a) {
          let t = a === 'cumsum' ? Ge : Fe,
            r = this.getOrCreatePipeline(a, t),
            c = e.size,
            o = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(s, 0, new Uint32Array([c]));
          let n = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: o } },
                { binding: 2, resource: { buffer: s } },
              ],
            }),
            i = this.device.createCommandEncoder(),
            u = i.beginComputePass();
          return (
            u.setPipeline(r),
            u.setBindGroup(0, n),
            u.dispatchWorkgroups(Math.ceil(c / 256)),
            u.end(),
            this.device.queue.submit([i.finish()]),
            s.destroy(),
            new q(o, e.shape, this.device)
          );
        }
        async runUnaryOp(e, a) {
          let t = Ue[a];
          if (!t) throw new Error(`Unknown unary op: ${a}`);
          let r = this.getOrCreatePipeline(`unary_${a}`, t),
            c = e.data.length,
            o = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            n = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            i = new Float32Array(c);
          for (let g = 0; g < c; g++) i[g] = e.data[g];
          (this.device.queue.writeBuffer(o, 0, i),
            this.device.queue.writeBuffer(n, 0, new Uint32Array([c])));
          let u = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: o } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
              ],
            }),
            l = this.device.createCommandEncoder(),
            f = l.beginComputePass();
          (f.setPipeline(r),
            f.setBindGroup(0, u),
            f.dispatchWorkgroups(Math.ceil(c / 256)),
            f.end());
          let h = this.device.createBuffer({
            size: c * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (l.copyBufferToBuffer(s, 0, h, 0, c * 4),
            this.device.queue.submit([l.finish()]),
            await h.mapAsync(GPUMapMode.READ));
          let m = new Float32Array(h.getMappedRange().slice(0));
          h.unmap();
          let d = new Float64Array(c);
          for (let g = 0; g < c; g++) d[g] = m[g];
          return (o.destroy(), s.destroy(), n.destroy(), h.destroy(), this.createArray(d, e.shape));
        }
        async runBinaryOp(e, a, t) {
          let r = Le[t];
          if (!r) throw new Error(`Unknown binary op: ${t}`);
          if (e.data.length !== a.data.length) throw new Error('Shape mismatch');
          let c = this.getOrCreatePipeline(`binary_${t}`, r),
            o = e.data.length,
            s = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            i = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            u = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            l = new Float32Array(o),
            f = new Float32Array(o);
          for (let _ = 0; _ < o; _++) ((l[_] = e.data[_]), (f[_] = a.data[_]));
          (this.device.queue.writeBuffer(s, 0, l),
            this.device.queue.writeBuffer(n, 0, f),
            this.device.queue.writeBuffer(u, 0, new Uint32Array([o])));
          let h = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: s } },
                { binding: 1, resource: { buffer: n } },
                { binding: 2, resource: { buffer: i } },
                { binding: 3, resource: { buffer: u } },
              ],
            }),
            m = this.device.createCommandEncoder(),
            d = m.beginComputePass();
          (d.setPipeline(c),
            d.setBindGroup(0, h),
            d.dispatchWorkgroups(Math.ceil(o / 256)),
            d.end());
          let g = this.device.createBuffer({
            size: o * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (m.copyBufferToBuffer(i, 0, g, 0, o * 4),
            this.device.queue.submit([m.finish()]),
            await g.mapAsync(GPUMapMode.READ));
          let b = new Float32Array(g.getMappedRange().slice(0));
          g.unmap();
          let p = new Float64Array(o);
          for (let _ = 0; _ < o; _++) p[_] = b[_];
          return (
            s.destroy(),
            n.destroy(),
            i.destroy(),
            u.destroy(),
            g.destroy(),
            this.createArray(p, e.shape)
          );
        }
        async runScalarOp(e, a, t) {
          let r = ke[t];
          if (!r) throw new Error(`Unknown scalar op: ${t}`);
          let c = this.getOrCreatePipeline(`scalar_${t}`, r),
            o = e.data.length,
            s = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: 8,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            u = new Float32Array(o);
          for (let p = 0; p < o; p++) u[p] = e.data[p];
          this.device.queue.writeBuffer(s, 0, u);
          let l = new ArrayBuffer(8);
          ((new Uint32Array(l, 0, 1)[0] = o),
            (new Float32Array(l, 4, 1)[0] = a),
            this.device.queue.writeBuffer(i, 0, new Uint8Array(l)));
          let f = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: s } },
                { binding: 1, resource: { buffer: n } },
                { binding: 2, resource: { buffer: i } },
              ],
            }),
            h = this.device.createCommandEncoder(),
            m = h.beginComputePass();
          (m.setPipeline(c),
            m.setBindGroup(0, f),
            m.dispatchWorkgroups(Math.ceil(o / 256)),
            m.end());
          let d = this.device.createBuffer({
            size: o * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (h.copyBufferToBuffer(n, 0, d, 0, o * 4),
            this.device.queue.submit([h.finish()]),
            await d.mapAsync(GPUMapMode.READ));
          let g = new Float32Array(d.getMappedRange().slice(0));
          d.unmap();
          let b = new Float64Array(o);
          for (let p = 0; p < o; p++) b[p] = g[p];
          return (s.destroy(), n.destroy(), i.destroy(), d.destroy(), this.createArray(b, e.shape));
        }
        async runModf(e) {
          let a = this.getOrCreatePipeline('modf', Ie),
            t = e.data.length,
            r = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            c = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            o = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            n = new Float32Array(t);
          for (let p = 0; p < t; p++) n[p] = e.data[p];
          (this.device.queue.writeBuffer(r, 0, n),
            this.device.queue.writeBuffer(s, 0, new Uint32Array([t])));
          let i = this.device.createBindGroup({
              layout: a.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: r } },
                { binding: 1, resource: { buffer: c } },
                { binding: 2, resource: { buffer: o } },
                { binding: 3, resource: { buffer: s } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          (l.setPipeline(a),
            l.setBindGroup(0, i),
            l.dispatchWorkgroups(Math.ceil(t / 256)),
            l.end());
          let f = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            h = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
          (u.copyBufferToBuffer(c, 0, f, 0, t * 4),
            u.copyBufferToBuffer(o, 0, h, 0, t * 4),
            this.device.queue.submit([u.finish()]),
            await f.mapAsync(GPUMapMode.READ));
          let m = new Float32Array(f.getMappedRange().slice(0));
          (f.unmap(), await h.mapAsync(GPUMapMode.READ));
          let d = new Float32Array(h.getMappedRange().slice(0));
          h.unmap();
          let g = new Float64Array(t),
            b = new Float64Array(t);
          for (let p = 0; p < t; p++) ((g[p] = m[p]), (b[p] = d[p]));
          return (
            r.destroy(),
            c.destroy(),
            o.destroy(),
            s.destroy(),
            f.destroy(),
            h.destroy(),
            { frac: this.createArray(g, e.shape), integ: this.createArray(b, e.shape) }
          );
        }
        async runFrexp(e) {
          let a = this.getOrCreatePipeline('frexp', ze),
            t = e.data.length,
            r = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            c = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            o = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            n = new Float32Array(t);
          for (let p = 0; p < t; p++) n[p] = e.data[p];
          (this.device.queue.writeBuffer(r, 0, n),
            this.device.queue.writeBuffer(s, 0, new Uint32Array([t])));
          let i = this.device.createBindGroup({
              layout: a.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: r } },
                { binding: 1, resource: { buffer: c } },
                { binding: 2, resource: { buffer: o } },
                { binding: 3, resource: { buffer: s } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          (l.setPipeline(a),
            l.setBindGroup(0, i),
            l.dispatchWorkgroups(Math.ceil(t / 256)),
            l.end());
          let f = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            h = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
          (u.copyBufferToBuffer(c, 0, f, 0, t * 4),
            u.copyBufferToBuffer(o, 0, h, 0, t * 4),
            this.device.queue.submit([u.finish()]),
            await f.mapAsync(GPUMapMode.READ));
          let m = new Float32Array(f.getMappedRange().slice(0));
          (f.unmap(), await h.mapAsync(GPUMapMode.READ));
          let d = new Float32Array(h.getMappedRange().slice(0));
          h.unmap();
          let g = new Float64Array(t),
            b = new Float64Array(t);
          for (let p = 0; p < t; p++) ((g[p] = m[p]), (b[p] = d[p]));
          return (
            r.destroy(),
            c.destroy(),
            o.destroy(),
            s.destroy(),
            f.destroy(),
            h.destroy(),
            { mantissa: this.createArray(g, e.shape), exponent: this.createArray(b, e.shape) }
          );
        }
        async runDivmod(e, a) {
          if (e.data.length !== a.data.length) throw new Error('Shape mismatch');
          let t = this.getOrCreatePipeline('divmod', Ve),
            r = e.data.length,
            c = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            n = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            u = new Float32Array(r),
            l = new Float32Array(r);
          for (let w = 0; w < r; w++) ((u[w] = e.data[w]), (l[w] = a.data[w]));
          (this.device.queue.writeBuffer(c, 0, u),
            this.device.queue.writeBuffer(o, 0, l),
            this.device.queue.writeBuffer(i, 0, new Uint32Array([r])));
          let f = this.device.createBindGroup({
              layout: t.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: c } },
                { binding: 1, resource: { buffer: o } },
                { binding: 2, resource: { buffer: s } },
                { binding: 3, resource: { buffer: n } },
                { binding: 4, resource: { buffer: i } },
              ],
            }),
            h = this.device.createCommandEncoder(),
            m = h.beginComputePass();
          (m.setPipeline(t),
            m.setBindGroup(0, f),
            m.dispatchWorkgroups(Math.ceil(r / 256)),
            m.end());
          let d = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            g = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
          (h.copyBufferToBuffer(s, 0, d, 0, r * 4),
            h.copyBufferToBuffer(n, 0, g, 0, r * 4),
            this.device.queue.submit([h.finish()]),
            await d.mapAsync(GPUMapMode.READ));
          let b = new Float32Array(d.getMappedRange().slice(0));
          (d.unmap(), await g.mapAsync(GPUMapMode.READ));
          let p = new Float32Array(g.getMappedRange().slice(0));
          g.unmap();
          let _ = new Float64Array(r),
            A = new Float64Array(r);
          for (let w = 0; w < r; w++) ((_[w] = b[w]), (A[w] = p[w]));
          return (
            c.destroy(),
            o.destroy(),
            s.destroy(),
            n.destroy(),
            i.destroy(),
            d.destroy(),
            g.destroy(),
            { quotient: this.createArray(_, e.shape), remainder: this.createArray(A, e.shape) }
          );
        }
        async runReduction(e, a) {
          let t = Te[a];
          if (!t) throw new Error(`Unknown reduction op: ${a}`);
          let r = this.getOrCreatePipeline(`reduction_${a}`, t),
            c = e.data.length,
            o = Math.ceil(c / 256),
            s = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            u = new Float32Array(c);
          for (let b = 0; b < c; b++) u[b] = e.data[b];
          (this.device.queue.writeBuffer(s, 0, u),
            this.device.queue.writeBuffer(i, 0, new Uint32Array([c])));
          let l = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: s } },
                { binding: 1, resource: { buffer: n } },
                { binding: 2, resource: { buffer: i } },
              ],
            }),
            f = this.device.createCommandEncoder(),
            h = f.beginComputePass();
          (h.setPipeline(r), h.setBindGroup(0, l), h.dispatchWorkgroups(o), h.end());
          let m = this.device.createBuffer({
            size: o * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (f.copyBufferToBuffer(n, 0, m, 0, o * 4),
            this.device.queue.submit([f.finish()]),
            await m.mapAsync(GPUMapMode.READ));
          let d = new Float32Array(m.getMappedRange().slice(0));
          m.unmap();
          let g;
          if (a === 'sum') {
            g = 0;
            for (let b = 0; b < o; b++) g += d[b];
          } else if (a === 'prod') {
            g = 1;
            for (let b = 0; b < o; b++) g *= d[b];
          } else if (a === 'min') {
            g = d[0];
            for (let b = 1; b < o; b++) g = Math.min(g, d[b]);
          } else if (a === 'max') {
            g = d[0];
            for (let b = 1; b < o; b++) g = Math.max(g, d[b]);
          } else throw new Error(`Unknown reduction: ${a}`);
          return (s.destroy(), n.destroy(), i.destroy(), m.destroy(), g);
        }
        async runCumulative(e, a) {
          let t = a === 'cumsum' ? Ge : Fe,
            r = this.getOrCreatePipeline(a, t),
            c = e.data.length,
            o = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            n = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            i = new Float32Array(c);
          for (let g = 0; g < c; g++) i[g] = e.data[g];
          (this.device.queue.writeBuffer(o, 0, i),
            this.device.queue.writeBuffer(n, 0, new Uint32Array([c])));
          let u = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: o } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
              ],
            }),
            l = this.device.createCommandEncoder(),
            f = l.beginComputePass();
          (f.setPipeline(r),
            f.setBindGroup(0, u),
            f.dispatchWorkgroups(Math.ceil(c / 256)),
            f.end());
          let h = this.device.createBuffer({
            size: c * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (l.copyBufferToBuffer(s, 0, h, 0, c * 4),
            this.device.queue.submit([l.finish()]),
            await h.mapAsync(GPUMapMode.READ));
          let m = new Float32Array(h.getMappedRange().slice(0));
          h.unmap();
          let d = new Float64Array(c);
          for (let g = 0; g < c; g++) d[g] = m[g];
          return (o.destroy(), s.destroy(), n.destroy(), h.destroy(), this.createArray(d, e.shape));
        }
        async runClip(e, a, t) {
          let r = this.getOrCreatePipeline('clip', nt),
            c = e.data.length,
            o = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            n = this.device.createBuffer({
              size: 16,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            i = new Float32Array(c);
          for (let b = 0; b < c; b++) i[b] = e.data[b];
          this.device.queue.writeBuffer(o, 0, i);
          let u = new ArrayBuffer(16);
          ((new Uint32Array(u, 0, 1)[0] = c),
            (new Float32Array(u, 4, 1)[0] = a),
            (new Float32Array(u, 8, 1)[0] = t),
            this.device.queue.writeBuffer(n, 0, new Uint8Array(u)));
          let l = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: o } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
              ],
            }),
            f = this.device.createCommandEncoder(),
            h = f.beginComputePass();
          (h.setPipeline(r),
            h.setBindGroup(0, l),
            h.dispatchWorkgroups(Math.ceil(c / 256)),
            h.end());
          let m = this.device.createBuffer({
            size: c * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (f.copyBufferToBuffer(s, 0, m, 0, c * 4),
            this.device.queue.submit([f.finish()]),
            await m.mapAsync(GPUMapMode.READ));
          let d = new Float32Array(m.getMappedRange().slice(0));
          m.unmap();
          let g = new Float64Array(c);
          for (let b = 0; b < c; b++) g[b] = d[b];
          return (o.destroy(), s.destroy(), n.destroy(), m.destroy(), this.createArray(g, e.shape));
        }
        async runArgReduction(e, a) {
          if (e.data.length === 0) throw new Error('zero-size array');
          let t = a === 'argmin' ? it : ut,
            r = this.getOrCreatePipeline(a, t),
            c = e.data.length,
            o = Math.ceil(c / 256),
            s = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            u = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            l = new Float32Array(c);
          for (let w = 0; w < c; w++) l[w] = e.data[w];
          (this.device.queue.writeBuffer(s, 0, l),
            this.device.queue.writeBuffer(u, 0, new Uint32Array([c])));
          let f = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: s } },
                { binding: 1, resource: { buffer: n } },
                { binding: 2, resource: { buffer: i } },
                { binding: 3, resource: { buffer: u } },
              ],
            }),
            h = this.device.createCommandEncoder(),
            m = h.beginComputePass();
          (m.setPipeline(r), m.setBindGroup(0, f), m.dispatchWorkgroups(o), m.end());
          let d = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            g = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
          (h.copyBufferToBuffer(i, 0, d, 0, o * 4),
            h.copyBufferToBuffer(n, 0, g, 0, o * 4),
            this.device.queue.submit([h.finish()]),
            await d.mapAsync(GPUMapMode.READ),
            await g.mapAsync(GPUMapMode.READ));
          let b = new Uint32Array(d.getMappedRange().slice(0)),
            p = new Float32Array(g.getMappedRange().slice(0));
          (d.unmap(), g.unmap());
          let _ = b[0],
            A = p[0];
          for (let w = 1; w < o; w++)
            ((a === 'argmin' && p[w] < A) || (a === 'argmax' && p[w] > A)) &&
              ((A = p[w]), (_ = b[w]));
          return (s.destroy(), n.destroy(), i.destroy(), u.destroy(), d.destroy(), g.destroy(), _);
        }
        async runBoolReduction(e, a) {
          let t = a === 'all' ? lt : ft,
            r = this.getOrCreatePipeline(a, t),
            c = e.data.length,
            o = Math.ceil(c / 256),
            s = this.device.createBuffer({
              size: c * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            u = new Float32Array(c);
          for (let b = 0; b < c; b++) u[b] = e.data[b];
          (this.device.queue.writeBuffer(s, 0, u),
            this.device.queue.writeBuffer(i, 0, new Uint32Array([c])));
          let l = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: s } },
                { binding: 1, resource: { buffer: n } },
                { binding: 2, resource: { buffer: i } },
              ],
            }),
            f = this.device.createCommandEncoder(),
            h = f.beginComputePass();
          (h.setPipeline(r), h.setBindGroup(0, l), h.dispatchWorkgroups(o), h.end());
          let m = this.device.createBuffer({
            size: o * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (f.copyBufferToBuffer(n, 0, m, 0, o * 4),
            this.device.queue.submit([f.finish()]),
            await m.mapAsync(GPUMapMode.READ));
          let d = new Uint32Array(m.getMappedRange().slice(0));
          m.unmap();
          let g = a === 'all' ? 1 : 0;
          for (let b = 0; b < o; b++) a === 'all' ? (g = g & d[b]) : (g = g | d[b]);
          return (s.destroy(), n.destroy(), i.destroy(), m.destroy(), g !== 0);
        }
        async runSumAxis(e, a) {
          if (e.shape.length !== 2) throw new Error('sumAxis only supports 2D arrays');
          let [t, r] = e.shape,
            c = a === 0 ? dt : ht,
            o = this.getOrCreatePipeline(`sumAxis${a}`, c),
            s = a === 0 ? r : t,
            n = this.device.createBuffer({
              size: t * r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            i = this.device.createBuffer({
              size: s * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            u = this.device.createBuffer({
              size: 8,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            l = new Float32Array(t * r);
          for (let p = 0; p < e.data.length; p++) l[p] = e.data[p];
          (this.device.queue.writeBuffer(n, 0, l),
            this.device.queue.writeBuffer(u, 0, new Uint32Array([t, r])));
          let f = this.device.createBindGroup({
              layout: o.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: n } },
                { binding: 1, resource: { buffer: i } },
                { binding: 2, resource: { buffer: u } },
              ],
            }),
            h = this.device.createCommandEncoder(),
            m = h.beginComputePass();
          (m.setPipeline(o),
            m.setBindGroup(0, f),
            m.dispatchWorkgroups(Math.ceil(s / 256)),
            m.end());
          let d = this.device.createBuffer({
            size: s * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (h.copyBufferToBuffer(i, 0, d, 0, s * 4),
            this.device.queue.submit([h.finish()]),
            await d.mapAsync(GPUMapMode.READ));
          let g = new Float32Array(d.getMappedRange().slice(0));
          d.unmap();
          let b = new Float64Array(s);
          for (let p = 0; p < s; p++) b[p] = g[p];
          return (n.destroy(), i.destroy(), u.destroy(), d.destroy(), this.createArray(b, [s]));
        }
        async runTranspose(e) {
          if (e.shape.length !== 2) throw new Error('transpose only supports 2D arrays');
          let [a, t] = e.shape,
            r = this.getOrCreatePipeline('transpose', mt),
            c = this.device.createBuffer({
              size: a * t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: a * t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            s = this.device.createBuffer({
              size: 8,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            n = new Float32Array(a * t);
          for (let d = 0; d < e.data.length; d++) n[d] = e.data[d];
          (this.device.queue.writeBuffer(c, 0, n),
            this.device.queue.writeBuffer(s, 0, new Uint32Array([a, t])));
          let i = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: c } },
                { binding: 1, resource: { buffer: o } },
                { binding: 2, resource: { buffer: s } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          (l.setPipeline(r),
            l.setBindGroup(0, i),
            l.dispatchWorkgroups(Math.ceil(t / 16), Math.ceil(a / 16)),
            l.end());
          let f = this.device.createBuffer({
            size: a * t * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (u.copyBufferToBuffer(o, 0, f, 0, a * t * 4),
            this.device.queue.submit([u.finish()]),
            await f.mapAsync(GPUMapMode.READ));
          let h = new Float32Array(f.getMappedRange().slice(0));
          f.unmap();
          let m = new Float64Array(a * t);
          for (let d = 0; d < a * t; d++) m[d] = h[d];
          return (c.destroy(), o.destroy(), s.destroy(), f.destroy(), this.createArray(m, [t, a]));
        }
        async runOuter(e, a) {
          let t = e.data.length,
            r = a.data.length,
            c = this.getOrCreatePipeline('outer', gt),
            o = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: t * r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: 8,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            u = new Float32Array(t),
            l = new Float32Array(r);
          for (let p = 0; p < t; p++) u[p] = e.data[p];
          for (let p = 0; p < r; p++) l[p] = a.data[p];
          (this.device.queue.writeBuffer(o, 0, u),
            this.device.queue.writeBuffer(s, 0, l),
            this.device.queue.writeBuffer(i, 0, new Uint32Array([t, r])));
          let f = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: o } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
                { binding: 3, resource: { buffer: i } },
              ],
            }),
            h = this.device.createCommandEncoder(),
            m = h.beginComputePass();
          (m.setPipeline(c),
            m.setBindGroup(0, f),
            m.dispatchWorkgroups(Math.ceil(r / 16), Math.ceil(t / 16)),
            m.end());
          let d = this.device.createBuffer({
            size: t * r * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (h.copyBufferToBuffer(n, 0, d, 0, t * r * 4),
            this.device.queue.submit([h.finish()]),
            await d.mapAsync(GPUMapMode.READ));
          let g = new Float32Array(d.getMappedRange().slice(0));
          d.unmap();
          let b = new Float64Array(t * r);
          for (let p = 0; p < t * r; p++) b[p] = g[p];
          return (
            o.destroy(),
            s.destroy(),
            n.destroy(),
            i.destroy(),
            d.destroy(),
            this.createArray(b, [t, r])
          );
        }
        async runDot(e, a) {
          if (e.data.length !== a.data.length) throw new Error('Dimension mismatch');
          let t = e.data.length,
            r = Math.ceil(t / 256),
            c = this.getOrCreatePipeline('dot', pt),
            o = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: r * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            i = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            u = new Float32Array(t),
            l = new Float32Array(t);
          for (let p = 0; p < t; p++) ((u[p] = e.data[p]), (l[p] = a.data[p]));
          (this.device.queue.writeBuffer(o, 0, u),
            this.device.queue.writeBuffer(s, 0, l),
            this.device.queue.writeBuffer(i, 0, new Uint32Array([t])));
          let f = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: o } },
                { binding: 1, resource: { buffer: s } },
                { binding: 2, resource: { buffer: n } },
                { binding: 3, resource: { buffer: i } },
              ],
            }),
            h = this.device.createCommandEncoder(),
            m = h.beginComputePass();
          (m.setPipeline(c), m.setBindGroup(0, f), m.dispatchWorkgroups(r), m.end());
          let d = this.device.createBuffer({
            size: r * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (h.copyBufferToBuffer(n, 0, d, 0, r * 4),
            this.device.queue.submit([h.finish()]),
            await d.mapAsync(GPUMapMode.READ));
          let g = new Float32Array(d.getMappedRange().slice(0));
          d.unmap();
          let b = 0;
          for (let p = 0; p < r; p++) b += g[p];
          return (o.destroy(), s.destroy(), n.destroy(), i.destroy(), d.destroy(), b);
        }
        async runTrace(e) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('trace requires square matrix');
          let a = e.shape[0],
            t = Math.ceil(a / 256),
            r = this.getOrCreatePipeline('trace', _t),
            c = this.device.createBuffer({
              size: a * a * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            n = new Float32Array(a * a);
          for (let d = 0; d < e.data.length; d++) n[d] = e.data[d];
          (this.device.queue.writeBuffer(c, 0, n),
            this.device.queue.writeBuffer(s, 0, new Uint32Array([a])));
          let i = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: c } },
                { binding: 1, resource: { buffer: o } },
                { binding: 2, resource: { buffer: s } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          (l.setPipeline(r), l.setBindGroup(0, i), l.dispatchWorkgroups(t), l.end());
          let f = this.device.createBuffer({
            size: t * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (u.copyBufferToBuffer(o, 0, f, 0, t * 4),
            this.device.queue.submit([u.finish()]),
            await f.mapAsync(GPUMapMode.READ));
          let h = new Float32Array(f.getMappedRange().slice(0));
          f.unmap();
          let m = 0;
          for (let d = 0; d < t; d++) m += h[d];
          return (c.destroy(), o.destroy(), s.destroy(), f.destroy(), m);
        }
        async runNorm(e) {
          let a = e.data.length,
            t = Math.ceil(a / 256),
            r = this.getOrCreatePipeline('norm', Dt),
            c = this.device.createBuffer({
              size: a * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            n = new Float32Array(a);
          for (let d = 0; d < a; d++) n[d] = e.data[d];
          (this.device.queue.writeBuffer(c, 0, n),
            this.device.queue.writeBuffer(s, 0, new Uint32Array([a])));
          let i = this.device.createBindGroup({
              layout: r.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: c } },
                { binding: 1, resource: { buffer: o } },
                { binding: 2, resource: { buffer: s } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          (l.setPipeline(r), l.setBindGroup(0, i), l.dispatchWorkgroups(t), l.end());
          let f = this.device.createBuffer({
            size: t * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          });
          (u.copyBufferToBuffer(o, 0, f, 0, t * 4),
            this.device.queue.submit([u.finish()]),
            await f.mapAsync(GPUMapMode.READ));
          let h = new Float32Array(f.getMappedRange().slice(0));
          f.unmap();
          let m = 0;
          for (let d = 0; d < t; d++) m += h[d];
          return (c.destroy(), o.destroy(), s.destroy(), f.destroy(), Math.sqrt(m));
        }
        createArray(e, a, t = re) {
          let r = e instanceof Float64Array ? e : new Float64Array(e);
          return Q.fromArray(r, a, this.device, t);
        }
        sin(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'sin'));
        }
        cos(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'cos'));
        }
        tan(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'tan'));
        }
        arcsin(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'asin'));
        }
        arccos(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'acos'));
        }
        arctan(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'atan'));
        }
        sinh(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'sinh'));
        }
        cosh(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'cosh'));
        }
        tanh(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'tanh'));
        }
        exp(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'exp'));
        }
        log(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'log'));
        }
        log2(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'log2'));
        }
        log10(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'log10'));
        }
        sqrt(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'sqrt'));
        }
        cbrt(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'cbrt'));
        }
        abs(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'abs'));
        }
        absolute(e) {
          return this.abs(e);
        }
        sign(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'sign'));
        }
        floor(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'floor'));
        }
        ceil(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'ceil'));
        }
        round(e, a = 0) {
          if (a === 0) {
            let c = this.toTensor(e);
            return this.fromTensor(this.runUnaryOpOnTensor(c, 'round'));
          }
          let t = Math.pow(10, a),
            r = new Float64Array(e.data.length);
          for (let c = 0; c < r.length; c++) r[c] = se(e.data[c] * t) / t;
          return this.createArray(r, [...e.shape]);
        }
        negative(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'neg'));
        }
        neg(e) {
          return this.negative(e);
        }
        reciprocal(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'reciprocal'));
        }
        square(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'square'));
        }
        arcsinh(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'asinh'));
        }
        arccosh(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'acosh'));
        }
        arctanh(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'atanh'));
        }
        expm1(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'expm1'));
        }
        log1p(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'log1p'));
        }
        trunc(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'trunc'));
        }
        fix(e) {
          return this.trunc(e);
        }
        sinc(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'sinc'));
        }
        deg2rad(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'deg2rad'));
        }
        rad2deg(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'rad2deg'));
        }
        heaviside(e, a) {
          let t = this.toTensor(e);
          return this.fromTensor(this.runScalarOpOnTensor(t, a, 'heaviside'));
        }
        signbit(e) {
          let a = this.toTensor(e);
          return this.fromTensor(this.runUnaryOpOnTensor(a, 'signbit'));
        }
        modf(e) {
          let a = this.toTensor(e),
            t = this.runModfOnTensor(a);
          return { frac: this.fromTensor(t.frac), integ: this.fromTensor(t.integ) };
        }
        frexp(e) {
          let a = this.toTensor(e),
            t = this.runFrexpOnTensor(a);
          return { mantissa: this.fromTensor(t.mantissa), exponent: this.fromTensor(t.exponent) };
        }
        ldexp(e, a) {
          let t = this.toTensor(e),
            r = this.toTensor(a),
            c = this.runUnaryOpOnTensor(r, 'exp2');
          return this.fromTensor(this.runBinaryOpOnTensor(t, c, 'mul'));
        }
        divmod(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a),
            c = this.toTensor(t),
            o = this.toTensor(r),
            s = this.runDivmodOnTensor(c, o);
          return { quotient: this.fromTensor(s.quotient), remainder: this.fromTensor(s.remainder) };
        }
        add(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'add')
          );
        }
        subtract(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'sub')
          );
        }
        sub(e, a) {
          return this.subtract(e, a);
        }
        multiply(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'mul')
          );
        }
        mul(e, a) {
          return this.multiply(e, a);
        }
        divide(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'div')
          );
        }
        div(e, a) {
          return this.divide(e, a);
        }
        power(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'pow')
          );
        }
        pow(e, a) {
          return this.power(e, a);
        }
        floorDivide(e, a) {
          return this.floor(this.divide(e, a));
        }
        maximum(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'maximum')
          );
        }
        minimum(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'minimum')
          );
        }
        mod(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'mod')
          );
        }
        fmod(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'fmod')
          );
        }
        remainder(e, a) {
          return this.mod(e, a);
        }
        copysign(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'copysign')
          );
        }
        hypot(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'hypot')
          );
        }
        arctan2(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'arctan2')
          );
        }
        logaddexp(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'logaddexp')
          );
        }
        logaddexp2(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'logaddexp2')
          );
        }
        fmax(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'fmax')
          );
        }
        fmin(e, a) {
          let [t, r] = this._prepGpuBinaryArgs(e, a);
          return this.fromTensor(
            this.runBinaryOpOnTensor(this.toTensor(t), this.toTensor(r), 'fmin')
          );
        }
        addScalar(e, a) {
          let t = this.toTensor(e);
          return this.fromTensor(this.runScalarOpOnTensor(t, a, 'addScalar'));
        }
        subScalar(e, a) {
          let t = this.toTensor(e);
          return this.fromTensor(this.runScalarOpOnTensor(t, a, 'subScalar'));
        }
        mulScalar(e, a) {
          let t = this.toTensor(e);
          return this.fromTensor(this.runScalarOpOnTensor(t, a, 'mulScalar'));
        }
        divScalar(e, a) {
          let t = this.toTensor(e);
          return this.fromTensor(this.runScalarOpOnTensor(t, a, 'divScalar'));
        }
        powScalar(e, a) {
          let t = this.toTensor(e);
          return this.fromTensor(this.runScalarOpOnTensor(t, a, 'powScalar'));
        }
        clip(e, a, t) {
          let c = this.toTensor(e);
          return (
            t !== null && (c = this.runScalarOpOnTensor(c, t, 'minScalar')),
            a !== null && (c = this.runScalarOpOnTensor(c, a, 'maxScalar')),
            this.fromTensor(c)
          );
        }
        _toCpu(e) {
          return e instanceof Q
            ? this._createCpuArray(Float64Array.from(e.data), [...e.shape], e.dtype)
            : e;
        }
        _cpuBackend = null;
        _getCpuBackend() {
          if (!this._cpuBackend) {
            let e = (t, r, c) =>
              new Y(
                t instanceof Float64Array ? t : Array.isArray(t) ? new Float64Array(t) : t,
                r,
                c || 'float64'
              );
            class a extends ae {
              name = 'cpu-only';
              createArray(r, c, o) {
                return e(r, c, o);
              }
            }
            this._cpuBackend = new a();
          }
          return this._cpuBackend;
        }
        lstsq(e, a, t) {
          let r = this._getCpuBackend(),
            c = this._toCpu(e),
            o = this._toCpu(a);
          return r.lstsq(c, o, t);
        }
        pinv(e) {
          return this._getCpuBackend().pinv(this._toCpu(e));
        }
        matmul(e, a) {
          return super.matmul(e, a);
        }
        async matmulAsync(e, a) {
          if (e.shape.length !== 2 || a.shape.length !== 2)
            throw new Error('matmul requires 2D arrays');
          let [t, r] = e.shape,
            [c, o] = a.shape;
          if (r !== c) throw new Error(`Dimension mismatch: ${r} vs ${c}`);
          let s = r,
            n = qe(t, s, o);
          if (!n) return this.matmul(e, a);
          let i = n.usesVec4A ? Math.ceil(s / 4) * 4 : s,
            u = n.usesVec4B ? Math.ceil(o / 4) * 4 : o,
            l,
            f;
          if (n.usesVec4A) {
            l = new Float32Array(t * i);
            for (let x = 0; x < t; x++)
              for (let N = 0; N < s; N++) l[x * i + N] = e.data[x * s + N];
            f = l.byteLength;
          } else {
            l = new Float32Array(t * s);
            for (let x = 0; x < e.data.length; x++) l[x] = e.data[x];
            f = l.byteLength;
          }
          let h, m;
          if (n.usesVec4B) {
            h = new Float32Array(s * u);
            for (let x = 0; x < s; x++)
              for (let N = 0; N < o; N++) h[x * u + N] = a.data[x * o + N];
            m = h.byteLength;
          } else {
            h = new Float32Array(s * o);
            for (let x = 0; x < a.data.length; x++) h[x] = a.data[x];
            m = h.byteLength;
          }
          let d = new Uint32Array([t, s, o, u]),
            g = this.bufferManager.acquire(16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
          this.device.queue.writeBuffer(g, 0, d);
          let b = this.bufferManager.acquire(f, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
            p = this.bufferManager.acquire(m, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
            _ = n.usesVec4C ? t * u * 4 : t * o * 4,
            A = this.bufferManager.acquire(_, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC),
            w = this.bufferManager.acquireStaging(_);
          (this.device.queue.writeBuffer(b, 0, l), this.device.queue.writeBuffer(p, 0, h));
          let y = `matmul-${n.name}`,
            D = I.get(y);
          if (!D) {
            let x = this.device.createShaderModule({ code: n.shader });
            ((D = this.device.createComputePipeline({
              layout: 'auto',
              compute: { module: x, entryPoint: 'main' },
            })),
              I.set(y, D));
          }
          let C = this.device.createBindGroup({
              layout: D.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: g } },
                { binding: 1, resource: { buffer: b } },
                { binding: 2, resource: { buffer: p } },
                { binding: 3, resource: { buffer: A } },
              ],
            }),
            O = this.device.createCommandEncoder(),
            M = O.beginComputePass();
          (M.setPipeline(D),
            M.setBindGroup(0, C),
            M.dispatchWorkgroups(Math.ceil(o / n.tileN), Math.ceil(t / n.tileM)),
            M.end(),
            O.copyBufferToBuffer(A, 0, w, 0, _),
            this.device.queue.submit([O.finish()]));
          let E;
          try {
            (await w.mapAsync(GPUMapMode.READ),
              (E = new Float32Array(w.getMappedRange().slice(0))),
              w.unmap());
          } catch (x) {
            throw (
              this.bufferManager.release(g),
              this.bufferManager.release(b),
              this.bufferManager.release(p),
              this.bufferManager.release(A),
              w.destroy(),
              x
            );
          }
          let R = new Float64Array(t * o);
          if (n.usesVec4C && u !== o)
            for (let x = 0; x < t; x++) for (let N = 0; N < o; N++) R[x * o + N] = E[x * u + N];
          else for (let x = 0; x < R.length; x++) R[x] = E[x];
          return (
            this.bufferManager.release(g),
            this.bufferManager.release(b),
            this.bufferManager.release(p),
            this.bufferManager.release(A),
            this.bufferManager.releaseStaging(w),
            this.createArray(R, [t, o])
          );
        }
        uniformCache = new Map();
        matmulConfigCache = new Map();
        matmulTensor(e, a) {
          let [t, r] = e.shape,
            [c, o] = a.shape;
          if (r !== c) throw new Error(`Dimension mismatch: ${r} vs ${c}`);
          let s = r,
            n = `${t}x${s}x${o}`,
            i = this.matmulConfigCache.get(n);
          if (!i) {
            let C = qe(t, s, o);
            if (!C) throw new Error('No suitable matmul config');
            let O = C.usesVec4A ? Math.ceil(s / 4) * 4 : s,
              M = C.usesVec4B ? Math.ceil(o / 4) * 4 : o,
              E = `matmul-${C.name}`,
              R = I.get(E);
            if (!R) {
              let N = this.device.createShaderModule({ code: C.shader });
              ((R = this.device.createComputePipeline({
                layout: 'auto',
                compute: { module: N, entryPoint: 'main' },
              })),
                I.set(E, R));
            }
            let x = this.device.createBuffer({
              size: 16,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            (this.device.queue.writeBuffer(x, 0, new Uint32Array([t, s, o, M])),
              this.uniformCache.set(n, x),
              (i = {
                config: C,
                pipeline: R,
                wgX: Math.ceil(o / C.tileN),
                wgY: Math.ceil(t / C.tileM),
                kPadded: O,
                nPadded: M,
                aBufferSize: t * O * 4,
                bBufferSize: s * M * 4,
                outputSize: C.usesVec4C ? t * M * 4 : t * o * 4,
              }),
              this.matmulConfigCache.set(n, i));
          }
          let {
              config: u,
              pipeline: l,
              wgX: f,
              wgY: h,
              aBufferSize: m,
              bBufferSize: d,
              outputSize: g,
              nPadded: b,
            } = i,
            p = this.uniformCache.get(n),
            _ = this.bufferManager.acquire(g, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC),
            A = this.device.createBindGroup({
              layout: l.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: p } },
                { binding: 1, resource: { buffer: e.buffer, size: m } },
                { binding: 2, resource: { buffer: a.buffer, size: d } },
                { binding: 3, resource: { buffer: _ } },
              ],
            }),
            w = this.device.createCommandEncoder(),
            y = w.beginComputePass();
          (y.setPipeline(l),
            y.setBindGroup(0, A),
            y.dispatchWorkgroups(f, h),
            y.end(),
            this.device.queue.submit([w.finish()]));
          let D = u.usesVec4C && b !== o ? [t, b] : [t, o];
          return new q(_, D, this.device);
        }
        createAlignedTensor(e, a, t, r) {
          let [c, o] = a,
            s = r ? Math.ceil(o / 4) * 4 : o,
            n;
          if (s !== o) {
            n = new Float32Array(c * s);
            for (let u = 0; u < c; u++) for (let l = 0; l < o; l++) n[u * s + l] = e[u * o + l];
          } else n = e;
          let i = this.device.createBuffer({
            size: n.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
          });
          return (this.device.queue.writeBuffer(i, 0, n), new q(i, [c, s], this.device));
        }
        async autotune(e, a, t, r = 5) {
          let c = `${e}x${a}x${t}`;
          console.log(`Autotuning matmul for ${c}...`);
          let o = pe.filter(
            h =>
              !(
                e < h.minSize ||
                a < h.minSize ||
                t < h.minSize ||
                (h.maxSize > 0 && (e > h.maxSize || a > h.maxSize || t > h.maxSize)) ||
                (h.requiresFit &&
                  (e % h.tileM !== 0 ||
                    t % h.tileN !== 0 ||
                    a % h.tileK !== 0 ||
                    (h.usesVec4B && t % 4 !== 0)))
              )
          );
          if (o.length === 0) return (console.log('No compatible configs found'), 'NONE');
          let s = new Float64Array(e * a),
            n = new Float64Array(a * t);
          for (let h = 0; h < e * a; h++) s[h] = Math.random();
          for (let h = 0; h < a * t; h++) n[h] = Math.random();
          let i = this.createArray(s, [e, a]),
            u = this.createArray(n, [a, t]),
            l = [];
          for (let h of o) {
            le.set(c, h.name);
            for (let g = 0; g < 2; g++) await this.matmulAsync(i, u);
            let m = [];
            for (let g = 0; g < r; g++) {
              let b = performance.now();
              await this.matmulAsync(i, u);
              let p = performance.now();
              m.push(p - b);
            }
            let d = m.reduce((g, b) => g + b) / m.length;
            (l.push({ name: h.name, avgMs: d }), console.log(`  ${h.name}: ${d.toFixed(2)}ms`));
          }
          l.sort((h, m) => h.avgMs - m.avgMs);
          let f = l[0];
          return (
            le.set(c, f.name),
            console.log(`Winner: ${f.name} (${f.avgMs.toFixed(2)}ms)`),
            f.name
          );
        }
        async det(e) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('det requires square matrix');
          return e.shape[0] < 64 ? this.detCPU(e) : await this.detGPU(e);
        }
        detCPU(e) {
          let a = e.shape[0],
            t = new Float64Array(e.data),
            r = 1;
          for (let c = 0; c < a; c++) {
            let o = c;
            for (let n = c + 1; n < a; n++)
              Math.abs(t[n * a + c]) > Math.abs(t[o * a + c]) && (o = n);
            if (o !== c) {
              for (let n = 0; n < a; n++)
                [t[c * a + n], t[o * a + n]] = [t[o * a + n], t[c * a + n]];
              r *= -1;
            }
            let s = t[c * a + c];
            if (Math.abs(s) < 1e-10) return 0;
            r *= s;
            for (let n = c + 1; n < a; n++) {
              let i = t[n * a + c] / s;
              for (let u = c; u < a; u++) t[n * a + u] -= i * t[c * a + u];
            }
          }
          return r;
        }
        async detGPU(e) {
          let a = e.shape[0],
            t = new Float32Array(a * a);
          for (let f = 0; f < a * a; f++) t[f] = e.data[f];
          let r = this.device.createBuffer({
            size: a * a * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
          });
          this.device.queue.writeBuffer(r, 0, t);
          let c = this.device.createBuffer({
              size: 16,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            o = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            s = this.getOrCreatePipeline('lu_find_pivot', Pt),
            n = this.getOrCreatePipeline('lu_swap_rows', xt),
            i = this.getOrCreatePipeline('lu_eliminate', Kt),
            u = 1,
            l = 0;
          for (let f = 0; f < a; f++) {
            let h = a - f,
              m = Math.ceil(h / 256),
              d = this.device.createBuffer({
                size: m * 8,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
              });
            this.device.queue.writeBuffer(c, 0, new Uint32Array([a, f, 0, 0]));
            let g = this.device.createCommandEncoder(),
              b = g.beginComputePass();
            (b.setPipeline(s),
              b.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: s.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: r } },
                    { binding: 1, resource: { buffer: d } },
                    { binding: 2, resource: { buffer: c } },
                  ],
                })
              ),
              b.dispatchWorkgroups(m),
              b.end());
            let p = this.device.createBuffer({
              size: m * 8,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
            (g.copyBufferToBuffer(d, 0, p, 0, m * 8), this.device.queue.submit([g.finish()]));
            let _ = new ArrayBuffer(m * 8);
            await p.mapAsync(GPUMapMode.READ);
            let A = new Float32Array(p.getMappedRange());
            (new Float32Array(_).set(A), p.unmap());
            let w = new Float32Array(_),
              y = -1 / 0,
              D = f;
            for (let M = 0; M < m; M++)
              w[M * 2] > y && ((y = w[M * 2]), (D = Math.round(w[M * 2 + 1])));
            D !== f &&
              (l++,
              this.device.queue.writeBuffer(c, 0, new Uint32Array([a, f, D, 0])),
              (g = this.device.createCommandEncoder()),
              (b = g.beginComputePass()),
              b.setPipeline(n),
              b.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: n.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: r } },
                    { binding: 1, resource: { buffer: c } },
                  ],
                })
              ),
              b.dispatchWorkgroups(Math.ceil(a / 256)),
              b.end(),
              this.device.queue.submit([g.finish()]));
            let C = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
            ((g = this.device.createCommandEncoder()),
              g.copyBufferToBuffer(r, (f * a + f) * 4, C, 0, 4),
              this.device.queue.submit([g.finish()]),
              await C.mapAsync(GPUMapMode.READ));
            let O = new Float32Array(C.getMappedRange())[0];
            if ((C.unmap(), Math.abs(O) < 1e-10))
              return (
                r.destroy(),
                c.destroy(),
                o.destroy(),
                d.destroy(),
                p.destroy(),
                C.destroy(),
                0
              );
            ((u *= O),
              f < a - 1 &&
                (this.device.queue.writeBuffer(c, 0, new Uint32Array([a, f, 0, 0])),
                this.device.queue.writeBuffer(o, 0, new Float32Array([O])),
                (g = this.device.createCommandEncoder()),
                (b = g.beginComputePass()),
                b.setPipeline(i),
                b.setBindGroup(
                  0,
                  this.device.createBindGroup({
                    layout: i.getBindGroupLayout(0),
                    entries: [
                      { binding: 0, resource: { buffer: r } },
                      { binding: 1, resource: { buffer: c } },
                      { binding: 2, resource: { buffer: o } },
                    ],
                  })
                ),
                b.dispatchWorkgroups(Math.ceil((a - f) / 16), Math.ceil((a - f - 1) / 16)),
                b.end(),
                this.device.queue.submit([g.finish()])),
              d.destroy(),
              p.destroy(),
              C.destroy());
          }
          return (r.destroy(), c.destroy(), o.destroy(), l % 2 === 0 ? u : -u);
        }
        async inv(e) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('inv requires square matrix');
          return e.shape[0] < 64 ? this.invCPU(e) : this.invGPU(e);
        }
        invCPU(e) {
          let a = e.shape[0],
            t = new Float64Array(a * a * 2);
          for (let c = 0; c < a; c++)
            for (let o = 0; o < a; o++)
              ((t[c * a * 2 + o] = e.data[c * a + o]), (t[c * a * 2 + a + o] = c === o ? 1 : 0));
          for (let c = 0; c < a; c++) {
            let o = c;
            for (let n = c + 1; n < a; n++)
              Math.abs(t[n * a * 2 + c]) > Math.abs(t[o * a * 2 + c]) && (o = n);
            for (let n = 0; n < a * 2; n++)
              [t[c * a * 2 + n], t[o * a * 2 + n]] = [t[o * a * 2 + n], t[c * a * 2 + n]];
            let s = t[c * a * 2 + c];
            if (Math.abs(s) < 1e-10) throw new Error('Matrix is singular');
            for (let n = 0; n < a * 2; n++) t[c * a * 2 + n] /= s;
            for (let n = 0; n < a; n++)
              if (n !== c) {
                let i = t[n * a * 2 + c];
                for (let u = 0; u < a * 2; u++) t[n * a * 2 + u] -= i * t[c * a * 2 + u];
              }
          }
          let r = new Float64Array(a * a);
          for (let c = 0; c < a; c++)
            for (let o = 0; o < a; o++) r[c * a + o] = t[c * a * 2 + a + o];
          return this.createArray(r, [a, a]);
        }
        async invGPU(e) {
          let a = e.shape[0],
            t = a * 2,
            r = new Float32Array(a * t);
          for (let d = 0; d < a; d++)
            for (let g = 0; g < a; g++)
              ((r[d * t + g] = e.data[d * a + g]), (r[d * t + a + g] = d === g ? 1 : 0));
          let c = this.device.createBuffer({
            size: a * t * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
          });
          this.device.queue.writeBuffer(c, 0, r);
          let o = this.device.createBuffer({
              size: 16,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            s = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            n = this.getOrCreatePipeline('inv_swap_rows', Nt),
            i = this.getOrCreatePipeline('inv_scale_row', St),
            u = this.getOrCreatePipeline('inv_eliminate', Ut);
          for (let d = 0; d < a; d++) {
            let g = this.device.createBuffer({
                size: (a - d) * 4,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
              }),
              b = this.device.createCommandEncoder();
            for (let M = d; M < a; M++) b.copyBufferToBuffer(c, (M * t + d) * 4, g, (M - d) * 4, 4);
            (this.device.queue.submit([b.finish()]), await g.mapAsync(GPUMapMode.READ));
            let p = new Float32Array(g.getMappedRange()),
              _ = d,
              A = Math.abs(p[0]);
            for (let M = 1; M < a - d; M++)
              Math.abs(p[M]) > A && ((A = Math.abs(p[M])), (_ = d + M));
            if ((g.unmap(), g.destroy(), _ !== d)) {
              this.device.queue.writeBuffer(o, 0, new Uint32Array([a, d, _, 0]));
              let M = this.device.createCommandEncoder(),
                E = M.beginComputePass();
              (E.setPipeline(n),
                E.setBindGroup(
                  0,
                  this.device.createBindGroup({
                    layout: n.getBindGroupLayout(0),
                    entries: [
                      { binding: 0, resource: { buffer: c } },
                      { binding: 1, resource: { buffer: o } },
                    ],
                  })
                ),
                E.dispatchWorkgroups(Math.ceil(t / 256)),
                E.end(),
                this.device.queue.submit([M.finish()]));
            }
            let w = this.device.createBuffer({
                size: 4,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
              }),
              y = this.device.createCommandEncoder();
            (y.copyBufferToBuffer(c, (d * t + d) * 4, w, 0, 4),
              this.device.queue.submit([y.finish()]),
              await w.mapAsync(GPUMapMode.READ));
            let D = new Float32Array(w.getMappedRange())[0];
            if ((w.unmap(), w.destroy(), Math.abs(D) < 1e-10))
              throw (c.destroy(), o.destroy(), s.destroy(), new Error('Matrix is singular'));
            (this.device.queue.writeBuffer(o, 0, new Uint32Array([a, d, 0, 0])),
              this.device.queue.writeBuffer(s, 0, new Float32Array([1 / D])));
            let C = this.device.createCommandEncoder(),
              O = C.beginComputePass();
            (O.setPipeline(i),
              O.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: i.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: c } },
                    { binding: 1, resource: { buffer: o } },
                    { binding: 2, resource: { buffer: s } },
                  ],
                })
              ),
              O.dispatchWorkgroups(Math.ceil(t / 256)),
              O.end(),
              this.device.queue.submit([C.finish()]),
              this.device.queue.writeBuffer(o, 0, new Uint32Array([a, d, 0, 0])),
              (C = this.device.createCommandEncoder()),
              (O = C.beginComputePass()),
              O.setPipeline(u),
              O.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: u.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: c } },
                    { binding: 1, resource: { buffer: o } },
                  ],
                })
              ),
              O.dispatchWorkgroups(Math.ceil(t / 16), Math.ceil(a / 16)),
              O.end(),
              this.device.queue.submit([C.finish()]));
          }
          let l = this.device.createBuffer({
              size: a * t * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            f = this.device.createCommandEncoder();
          (f.copyBufferToBuffer(c, 0, l, 0, a * t * 4),
            this.device.queue.submit([f.finish()]),
            await l.mapAsync(GPUMapMode.READ));
          let h = new Float32Array(l.getMappedRange()),
            m = new Float64Array(a * a);
          for (let d = 0; d < a; d++) for (let g = 0; g < a; g++) m[d * a + g] = h[d * t + a + g];
          return (
            l.unmap(),
            l.destroy(),
            c.destroy(),
            o.destroy(),
            s.destroy(),
            this.createArray(m, [a, a])
          );
        }
        async qrAsync(e) {
          if (e.shape.length !== 2) throw new Error('qr requires 2D array');
          let [a, t] = e.shape,
            r;
          e instanceof Q
            ? (r = await e.getData())
            : (r = e.data instanceof Float64Array ? e.data : new Float64Array(e.data));
          let c = new Float32Array(a * t);
          for (let b = 0; b < a * t; b++) c[b] = r[b];
          let o = this.device.createBuffer({
            size: a * t * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
          });
          this.device.queue.writeBuffer(o, 0, c);
          let s = this.device.createBuffer({
            size: t * t * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
          });
          this.device.queue.writeBuffer(s, 0, new Float32Array(t * t));
          let n = this.getOrCreatePipeline('qr_column_norm', Mt),
            i = this.getOrCreatePipeline('qr_normalize', Rt),
            u = this.getOrCreatePipeline('qr_orthogonalize', Et),
            l = Math.ceil(a / 256),
            f = this.device.createBuffer({
              size: 16,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            h = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            m = this.device.createBuffer({
              size: Math.max(l, 1) * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            d = this.bufferManager.acquireStaging(l * 4),
            g = [d];
          try {
            for (let C = 0; C < t; C++) {
              this.device.queue.writeBuffer(f, 0, new Uint32Array([a, t, C, 0]));
              let O = this.device.createCommandEncoder(),
                M = O.beginComputePass();
              (M.setPipeline(n),
                M.setBindGroup(
                  0,
                  this.device.createBindGroup({
                    layout: n.getBindGroupLayout(0),
                    entries: [
                      { binding: 0, resource: { buffer: o } },
                      { binding: 1, resource: { buffer: m } },
                      { binding: 2, resource: { buffer: f } },
                    ],
                  })
                ),
                M.dispatchWorkgroups(Math.max(l, 1)),
                M.end(),
                O.copyBufferToBuffer(m, 0, d, 0, l * 4),
                this.device.queue.submit([O.finish()]),
                await d.mapAsync(GPUMapMode.READ));
              let E = new Float32Array(d.getMappedRange().slice(0));
              d.unmap();
              let R = 0;
              for (let U = 0; U < l; U++) R += E[U];
              let x = Math.sqrt(R);
              this.device.queue.writeBuffer(h, 0, new Float32Array([x]));
              let N = t - C - 1;
              if (N > 0) {
                ((O = this.device.createCommandEncoder()),
                  (M = O.beginComputePass()),
                  M.setPipeline(i),
                  M.setBindGroup(
                    0,
                    this.device.createBindGroup({
                      layout: i.getBindGroupLayout(0),
                      entries: [
                        { binding: 0, resource: { buffer: o } },
                        { binding: 1, resource: { buffer: s } },
                        { binding: 2, resource: { buffer: f } },
                        { binding: 3, resource: { buffer: h } },
                      ],
                    })
                  ),
                  M.dispatchWorkgroups(Math.ceil(a / 256)),
                  M.end());
                let U = this.device.createBuffer({
                  size: N * l * 4,
                  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
                });
                this.device.queue.writeBuffer(f, 0, new Uint32Array([a, t, C, N]));
                let F = this.getOrCreatePipeline('qr_dot_columns', Ot);
                ((M = O.beginComputePass()),
                  M.setPipeline(F),
                  M.setBindGroup(
                    0,
                    this.device.createBindGroup({
                      layout: F.getBindGroupLayout(0),
                      entries: [
                        { binding: 0, resource: { buffer: o } },
                        { binding: 1, resource: { buffer: U } },
                        { binding: 2, resource: { buffer: f } },
                      ],
                    })
                  ),
                  M.dispatchWorkgroups(l, N),
                  M.end());
                let L = this.bufferManager.acquireStaging(N * l * 4);
                (g.push(L),
                  O.copyBufferToBuffer(U, 0, L, 0, N * l * 4),
                  this.device.queue.submit([O.finish()]),
                  await L.mapAsync(GPUMapMode.READ));
                let z = new Float32Array(L.getMappedRange().slice(0));
                (L.unmap(), this.bufferManager.releaseStaging(L), g.pop(), U.destroy());
                let V = new Float32Array(N);
                for (let X = 0; X < N; X++) {
                  let T = 0;
                  for (let W = 0; W < l; W++) T += z[X * l + W];
                  V[X] = T;
                }
                let J = this.device.createBuffer({
                  size: N * 4,
                  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
                });
                (this.device.queue.writeBuffer(J, 0, V),
                  this.device.queue.writeBuffer(f, 0, new Uint32Array([a, t, C, N])),
                  (O = this.device.createCommandEncoder()),
                  (M = O.beginComputePass()),
                  M.setPipeline(u),
                  M.setBindGroup(
                    0,
                    this.device.createBindGroup({
                      layout: u.getBindGroupLayout(0),
                      entries: [
                        { binding: 0, resource: { buffer: o } },
                        { binding: 1, resource: { buffer: s } },
                        { binding: 2, resource: { buffer: J } },
                        { binding: 3, resource: { buffer: f } },
                      ],
                    })
                  ),
                  M.dispatchWorkgroups(Math.ceil(a / 16), Math.ceil(N / 16)),
                  M.end(),
                  this.device.queue.submit([O.finish()]),
                  J.destroy());
              } else
                ((O = this.device.createCommandEncoder()),
                  (M = O.beginComputePass()),
                  M.setPipeline(i),
                  M.setBindGroup(
                    0,
                    this.device.createBindGroup({
                      layout: i.getBindGroupLayout(0),
                      entries: [
                        { binding: 0, resource: { buffer: o } },
                        { binding: 1, resource: { buffer: s } },
                        { binding: 2, resource: { buffer: f } },
                        { binding: 3, resource: { buffer: h } },
                      ],
                    })
                  ),
                  M.dispatchWorkgroups(Math.ceil(a / 256)),
                  M.end(),
                  this.device.queue.submit([O.finish()]));
            }
            let b = this.bufferManager.acquireStaging(a * t * 4),
              p = this.bufferManager.acquireStaging(t * t * 4);
            g.push(b, p);
            let _ = this.device.createCommandEncoder();
            (_.copyBufferToBuffer(o, 0, b, 0, a * t * 4),
              _.copyBufferToBuffer(s, 0, p, 0, t * t * 4),
              this.device.queue.submit([_.finish()]),
              await b.mapAsync(GPUMapMode.READ));
            let A = new Float32Array(b.getMappedRange().slice(0));
            (b.unmap(), await p.mapAsync(GPUMapMode.READ));
            let w = new Float32Array(p.getMappedRange().slice(0));
            p.unmap();
            let y = new Float64Array(a * t),
              D = new Float64Array(t * t);
            for (let C = 0; C < a * t; C++) y[C] = A[C];
            for (let C = 0; C < t * t; C++) D[C] = w[C];
            return { q: this.createArray(y, [a, t]), r: this.createArray(D, [t, t]) };
          } finally {
            for (let b of g) this.bufferManager.releaseStaging(b);
            (f.destroy(), h.destroy(), m.destroy(), o.destroy(), s.destroy());
          }
        }
        async svdAsync(e) {
          if (e.shape.length !== 2) throw new Error('svd requires 2D array');
          let [a, t] = e.shape,
            r = Math.min(a, t),
            c;
          e instanceof Q
            ? (c = await e.getData())
            : (c = e.data instanceof Float64Array ? e.data : new Float64Array(e.data));
          let o = this.transpose(e),
            s = await this.matmulAsync(o, e),
            n;
          s instanceof Q
            ? (n = await s.getData())
            : (n = s.data instanceof Float64Array ? s.data : new Float64Array(s.data));
          let i = this.getOrCreatePipeline('svd_power_iter', Lt),
            u = new Float32Array(t * t);
          for (let M = 0; M < t * t; M++) u[M] = n[M];
          let l = new Float64Array(r),
            f = new Float64Array(t * r),
            h = this.device.createBuffer({
              size: t * t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            m = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            d = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
            }),
            g = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            }),
            b = this.device.createBuffer({
              size: t * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            });
          try {
            this.device.queue.writeBuffer(g, 0, new Uint32Array([t]));
            for (let M = 0; M < r; M++) {
              this.device.queue.writeBuffer(h, 0, u);
              let E = new Float32Array(t);
              for (let L = 0; L < t; L++) E[L] = Math.random() - 0.5;
              for (let L = 0; L < M; L++) {
                let z = 0;
                for (let V = 0; V < t; V++) z += E[V] * f[V * r + L];
                for (let V = 0; V < t; V++) E[V] -= z * f[V * r + L];
              }
              let R = Math.sqrt(E.reduce((L, z) => L + z * z, 0));
              if (R > 1e-10) for (let L = 0; L < t; L++) E[L] /= R;
              let x = 30,
                N = 1e-6,
                U = 0,
                F = !1;
              for (let L = 0; L < x && !F; L++) {
                this.device.queue.writeBuffer(m, 0, E);
                let z = this.device.createCommandEncoder(),
                  V = z.beginComputePass();
                (V.setPipeline(i),
                  V.setBindGroup(
                    0,
                    this.device.createBindGroup({
                      layout: i.getBindGroupLayout(0),
                      entries: [
                        { binding: 0, resource: { buffer: h } },
                        { binding: 1, resource: { buffer: m } },
                        { binding: 2, resource: { buffer: d } },
                        { binding: 3, resource: { buffer: g } },
                      ],
                    })
                  ),
                  V.dispatchWorkgroups(Math.ceil(t / 256)),
                  V.end(),
                  z.copyBufferToBuffer(d, 0, b, 0, t * 4),
                  this.device.queue.submit([z.finish()]),
                  await b.mapAsync(GPUMapMode.READ));
                let J = new Float32Array(b.getMappedRange().slice(0));
                (b.unmap(), (R = Math.sqrt(J.reduce((T, W) => T + W * W, 0))), (U = R));
                let X = 0;
                for (let T = 0; T < t; T++) {
                  let W = R > 1e-10 ? J[T] / R : 0;
                  X += (W - E[T]) ** 2;
                }
                if (((F = Math.sqrt(X) < N), R > 1e-10))
                  for (let T = 0; T < t; T++) E[T] = J[T] / R;
                for (let T = 0; T < M; T++) {
                  let W = 0;
                  for (let ee = 0; ee < t; ee++) W += E[ee] * f[ee * r + T];
                  for (let ee = 0; ee < t; ee++) E[ee] -= W * f[ee * r + T];
                }
                if (((R = Math.sqrt(E.reduce((T, W) => T + W * W, 0))), R > 1e-10))
                  for (let T = 0; T < t; T++) E[T] /= R;
              }
              l[M] = Math.sqrt(Math.abs(U));
              for (let L = 0; L < t; L++) f[L * r + M] = E[L];
              for (let L = 0; L < t; L++)
                for (let z = 0; z < t; z++) u[L * t + z] -= U * E[L] * E[z];
            }
          } finally {
            (h.destroy(), m.destroy(), d.destroy(), g.destroy(), b.destroy());
          }
          let p = Array.from({ length: r }, (M, E) => E);
          p.sort((M, E) => l[E] - l[M]);
          let _ = new Float64Array(r),
            A = new Float64Array(t * r);
          for (let M = 0; M < r; M++) {
            _[M] = l[p[M]];
            for (let E = 0; E < t; E++) A[E * r + M] = f[E * r + p[M]];
          }
          let w = this.createArray(A, [t, r]),
            y = await this.matmulAsync(e, w),
            D;
          y instanceof Q
            ? (D = await y.getData())
            : (D = y.data instanceof Float64Array ? y.data : new Float64Array(y.data));
          let C = new Float64Array(a * r);
          for (let M = 0; M < a; M++)
            for (let E = 0; E < r; E++) {
              let R = _[E];
              C[M * r + E] = R > 1e-10 ? D[M * r + E] / R : 0;
            }
          let O = new Float64Array(r * t);
          for (let M = 0; M < r; M++) for (let E = 0; E < t; E++) O[M * t + E] = A[E * r + M];
          return {
            u: this.createArray(C, [a, r]),
            s: this.createArray(_, [r]),
            vt: this.createArray(O, [r, t]),
          };
        }
        async matrixPower(e, a) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('matrixPower requires square 2D array');
          if (a === 0) return this.eye(e.shape[0]);
          a < 0 && ((e = await this.inv(e)), (a = -a));
          let t = this.eye(e.shape[0]),
            r = e;
          for (; a > 0; )
            (a % 2 === 1 && (t = this.matmul(t, r)),
              (r = this.matmul(r, r)),
              (a = Math.floor(a / 2)));
          return t;
        }
        kron(e, a) {
          let t = e.shape.length === 1 ? this.reshape(e, [e.shape[0], 1]) : e,
            r = a.shape.length === 1 ? this.reshape(a, [a.shape[0], 1]) : a;
          if (t.shape.length !== 2 || r.shape.length !== 2)
            throw new Error('kron requires 1D or 2D arrays');
          let [c, o] = t.shape,
            [s, n] = r.shape,
            i = [c * s, o * n],
            u = this.toTensor(t),
            l = this.toTensor(r),
            f = this.runKronOnTensor(u, l, c, o, s, n);
          return this.fromTensor(f);
        }
        runKronOnTensor(e, a, t, r, c, o) {
          let s = rt(),
            n = this.getOrCreatePipeline('kron', s),
            i = t * c,
            u = r * o,
            l = i * u,
            f = this.device.createBuffer({
              size: l * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            h = this.device.createBuffer({
              size: 16,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(h, 0, new Uint32Array([t, r, c, o]));
          let m = this.device.createBindGroup({
              layout: n.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: a.buffer } },
                { binding: 2, resource: { buffer: f } },
                { binding: 3, resource: { buffer: h } },
              ],
            }),
            d = this.device.createCommandEncoder(),
            g = d.beginComputePass();
          return (
            g.setPipeline(n),
            g.setBindGroup(0, m),
            g.dispatchWorkgroups(Math.ceil(l / 256)),
            g.end(),
            this.device.queue.submit([d.finish()]),
            h.destroy(),
            new q(f, [i, u], this.device)
          );
        }
        async condAsync(e, a = 2) {
          if (e.shape.length !== 2) throw new Error('cond requires a 2D matrix');
          if (a === 2 || a === -2) {
            let { s } = await this.svdAsync(e),
              n;
            s instanceof Q
              ? (n = await s.getData())
              : (n = s.data instanceof Float64Array ? s.data : new Float64Array(s.data));
            let i = Math.max(...n),
              u = Math.min(...Array.from(n).filter(l => l > 0));
            return u === 0 || n.length === 0 ? 1 / 0 : a === 2 ? i / u : u / i;
          }
          if (a === 1 || a === 1 / 0 || a === -1 || a === -1 / 0 || a === 'fro') {
            let s = this.norm(e, a),
              n;
            try {
              n = await this.inv(e);
            } catch {
              return 1 / 0;
            }
            let i = this.norm(n, a);
            return s * i;
          }
          let { s: t } = await this.svdAsync(e),
            r;
          t instanceof Q
            ? (r = await t.getData())
            : (r = t.data instanceof Float64Array ? t.data : new Float64Array(t.data));
          let c = Math.max(...r),
            o = Math.min(...Array.from(r).filter(s => s > 0));
          return o === 0 || r.length === 0 ? 1 / 0 : c / o;
        }
        cond(e, a = 2) {
          if (e.shape.length !== 2) throw new Error('cond requires a 2D matrix');
          if (a === 2 || a === -2) {
            let { s } = this.svd(e),
              n = s.data,
              i = Math.max(...n),
              u = Math.min(...Array.from(n).filter(l => l > 0));
            return u === 0 || n.length === 0 ? 1 / 0 : a === 2 ? i / u : u / i;
          }
          if (a === 1 || a === 1 / 0 || a === -1 || a === -1 / 0 || a === 'fro') {
            let s = this.norm(e, a),
              n;
            try {
              n = this.invCPU(e);
            } catch {
              return 1 / 0;
            }
            let i = this.norm(n, a);
            return s * i;
          }
          let { s: t } = this.svd(e),
            r = t.data,
            c = Math.max(...r),
            o = Math.min(...Array.from(r).filter(s => s > 0));
          return o === 0 || r.length === 0 ? 1 / 0 : c / o;
        }
        async slogdet(e) {
          if (e.shape.length !== 2 || e.shape[0] !== e.shape[1])
            throw new Error('slogdet requires a square 2D matrix');
          let a = await this.det(e);
          return a === 0
            ? { sign: 0, logabsdet: -1 / 0 }
            : { sign: a > 0 ? 1 : -1, logabsdet: Math.log(Math.abs(a)) };
        }
        multiDot(e) {
          if (e.length === 0) throw new Error('multiDot requires at least one array');
          if (e.length === 1) return this.createArray(e[0].data.slice(), e[0].shape);
          let a = e[0];
          for (let t = 1; t < e.length; t++) a = this.matmul(a, e[t]);
          return a;
        }
        polyval(e, a) {
          let t = this.flatten(e),
            r = this.flatten(a),
            c = t.shape[0] - 1,
            o = this.toTensor(t),
            s = this.toTensor(r),
            n = this.runPolyvalOnTensor(o, s, c);
          return this.fromTensor(n);
        }
        runPolyvalOnTensor(e, a, t) {
          let r = ct(t),
            c = this.getOrCreatePipeline(`polyval_${t}`, r),
            o = a.size,
            s = this.device.createBuffer({
              size: o * 4,
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            }),
            n = this.device.createBuffer({
              size: 4,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
          this.device.queue.writeBuffer(n, 0, new Uint32Array([o]));
          let i = this.device.createBindGroup({
              layout: c.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: e.buffer } },
                { binding: 1, resource: { buffer: a.buffer } },
                { binding: 2, resource: { buffer: s } },
                { binding: 3, resource: { buffer: n } },
              ],
            }),
            u = this.device.createCommandEncoder(),
            l = u.beginComputePass();
          return (
            l.setPipeline(c),
            l.setBindGroup(0, i),
            l.dispatchWorkgroups(Math.ceil(o / 256)),
            l.end(),
            this.device.queue.submit([u.finish()]),
            n.destroy(),
            new q(s, a.shape, this.device)
          );
        }
        batchedMatmul(e, a) {
          if (e.shape.length < 2 || a.shape.length < 2)
            throw new Error('batchedMatmul requires at least 2D arrays');
          let t = e.shape[e.shape.length - 2],
            r = e.shape[e.shape.length - 1],
            c = a.shape[a.shape.length - 2],
            o = a.shape[a.shape.length - 1];
          if (r !== c) throw new Error('matmul inner dimensions must match');
          let s = e.shape.slice(0, -2),
            n = a.shape.slice(0, -2),
            i = Math.max(s.length, n.length),
            u = new Array(i - s.length).fill(1).concat(s),
            l = new Array(i - n.length).fill(1).concat(n),
            f = [];
          for (let y = 0; y < i; y++) {
            let D = u[y],
              C = l[y];
            if (D !== 1 && C !== 1 && D !== C)
              throw new Error('batch dimensions are not broadcastable');
            f.push(Math.max(D, C));
          }
          let h = [...f, t, o],
            m = f.length === 0 ? 1 : f.reduce((y, D) => y * D, 1),
            d = t * o,
            g = new Float64Array(m * d),
            b = this._computeStrides(u),
            p = this._computeStrides(l),
            _ = this._computeStrides(f),
            A = t * r,
            w = c * o;
          for (let y = 0; y < m; y++) {
            let D = new Array(i),
              C = y;
            for (let R = 0; R < i; R++) ((D[R] = Math.floor(C / _[R])), (C = C % _[R]));
            let O = 0,
              M = 0;
            for (let R = 0; R < i; R++) {
              let x = u[R] === 1 ? 0 : D[R],
                N = l[R] === 1 ? 0 : D[R];
              ((O += x * b[R]), (M += N * p[R]));
            }
            ((O *= A), (M *= w));
            let E = y * d;
            for (let R = 0; R < t; R++)
              for (let x = 0; x < o; x++) {
                let N = 0;
                for (let U = 0; U < r; U++) N += e.data[O + R * r + U] * a.data[M + U * o + x];
                g[E + R * o + x] = N;
              }
          }
          return this.createArray(g, h);
        }
        async einsum(e, ...a) {
          let [t, r] = e.split('->').map(s => s.trim()),
            c = t.split(',').map(s => s.trim());
          if (c.length !== a.length)
            throw new Error(`einsum: expected ${c.length} operands, got ${a.length}`);
          let o = this._tryOptimizedEinsum(e, a);
          return o !== null ? o : await this._einsumGPU(c, r, a);
        }
        _tryOptimizedEinsum(e, a) {
          let t = e.replace(/\s+/g, '');
          if (t === 'ij,jk->ik' && a.length === 2) return this.matmul(a[0], a[1]);
          if (t === 'ij,kj->ik' && a.length === 2) return this.matmul(a[0], this.transpose(a[1]));
          if (t === 'ji,jk->ik' && a.length === 2) return this.matmul(this.transpose(a[0]), a[1]);
          if ((t === 'i,i->' || t === 'i,i') && a.length === 2) return this.dot(a[0], a[1]);
          if (t === 'i,j->ij' && a.length === 2) return this.outer(a[0], a[1]);
          if ((t === 'ii->' || t === 'ii') && a.length === 1)
            return this.createArray(new Float64Array([this.trace(a[0])]), [1]);
          if (t === 'ii->i' && a.length === 1) return this.diag(a[0]);
          if (t === 'ij->ji' && a.length === 1) return this.transpose(a[0]);
          if (t.endsWith('->') && a.length === 1) {
            let r = this.sum(a[0]);
            return this.createArray(new Float64Array([r]), [1]);
          }
          if ((t === 'bij,bjk->bik' && a.length, t === 'ij,j->ij' && a.length === 2)) {
            let [r, c] = a[0].shape,
              o = a[1];
            if (o.shape.length === 1 && o.shape[0] === c) {
              let s = new Float64Array(r * c);
              for (let u = 0; u < r; u++)
                for (let l = 0; l < c; l++) s[u * c + l] = a[0].data[u * c + l] * o.data[l];
              let n = this.flatten(a[0]),
                i = this.tile(o, [r]);
              return this.reshape(this.multiply(n, i), [r, c]);
            }
          }
          return null;
        }
        async _einsumGPU(e, a, t) {
          let r = new Map(),
            c = [];
          for (let m = 0; m < t.length; m++) {
            let d = e[m].split('');
            if ((c.push(d), d.length !== t[m].shape.length))
              throw new Error(
                `einsum: operand ${m} has ${t[m].shape.length} dimensions but subscripts specify ${d.length}`
              );
            for (let g = 0; g < d.length; g++) {
              let b = d[g],
                p = t[m].shape[g];
              if (r.has(b)) {
                if (r.get(b) !== p) throw new Error(`einsum: inconsistent size for label '${b}'`);
              } else r.set(b, p);
            }
          }
          let o;
          if (a !== void 0 && a !== '') o = a.split('');
          else {
            let m = new Map();
            for (let g of c) for (let b of g) m.set(b, (m.get(b) || 0) + 1);
            o = [];
            let d = Array.from(r.keys()).sort();
            for (let g of d) m.get(g) === 1 && o.push(g);
          }
          let s = o.map(m => r.get(m)),
            n = s.length === 0 ? 1 : s.reduce((m, d) => m * d, 1),
            i = new Set(o),
            l = Array.from(r.keys()).filter(m => !i.has(m)),
            f = l.map(m => r.get(m)),
            h = f.length === 0 ? 1 : f.reduce((m, d) => m * d, 1);
          return n * h > 1024
            ? await this._einsumGPUShader(t, c, o, l, r, s, n, h, f)
            : this._einsumCPU(t, c, o, l, r, s, n, h, f);
        }
        _einsumCPU(e, a, t, r, c, o, s, n, i) {
          let u = new Float64Array(s),
            l = e.map(h => this._computeStrides(h.shape)),
            f = o.length === 0 ? [] : this._computeStrides(o);
          for (let h = 0; h < s; h++) {
            let m = new Map(),
              d = h;
            for (let b = 0; b < t.length; b++) {
              let p = Math.floor(d / f[b]);
              ((d = d % f[b]), m.set(t[b], p));
            }
            let g = 0;
            for (let b = 0; b < n; b++) {
              let p = new Map(),
                _ = b;
              for (let y = 0; y < r.length; y++) {
                let D = y < i.length - 1 ? i.slice(y + 1).reduce((O, M) => O * M, 1) : 1,
                  C = Math.floor(_ / D);
                ((_ = _ % D), p.set(r[y], C));
              }
              let A = new Map([...m, ...p]),
                w = 1;
              for (let y = 0; y < e.length; y++) {
                let D = a[y],
                  C = l[y],
                  O = 0;
                for (let M = 0; M < D.length; M++) O += A.get(D[M]) * C[M];
                w *= e[y].data[O];
              }
              g += w;
            }
            u[h] = g;
          }
          return this.createArray(u, o.length === 0 ? [1] : o);
        }
        async _einsumGPUShader(e, a, t, r, c, o, s, n, i) {
          let u = [...t, ...r],
            l = new Map();
          u.forEach((R, x) => l.set(R, x));
          let f = e.map((R, x) => {
              let N = [],
                U = 1;
              for (let F = R.shape.length - 1; F >= 0; F--) (N.unshift(U), (U *= R.shape[F]));
              return N;
            }),
            h = o.length === 0 ? [] : this._computeStrides(o),
            m = i.length === 0 ? [] : this._computeStrides(i),
            d = this._generateEinsumShader(e.length, a, t, r, c, f, h, m, s, n),
            g = `einsum_${a.map(R => R.join('')).join('_')}_${t.join('')}`,
            b = this.getOrCreatePipeline(g, d),
            p = [];
          for (let R = 0; R < e.length; R++) {
            let x = e[R].data.length * 4,
              N = this.bufferManager.acquire(x, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
              U = new Float32Array(e[R].data.length);
            for (let F = 0; F < e[R].data.length; F++) U[F] = e[R].data[F];
            (this.device.queue.writeBuffer(N, 0, U), p.push(N));
          }
          let _ = this.bufferManager.acquire(
              s * 4,
              GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
            ),
            A = p.map((R, x) => ({ binding: x, resource: { buffer: R } }));
          A.push({ binding: e.length, resource: { buffer: _ } });
          let w = this.device.createBindGroup({ layout: b.getBindGroupLayout(0), entries: A }),
            y = this.device.createCommandEncoder(),
            D = y.beginComputePass();
          (D.setPipeline(b),
            D.setBindGroup(0, w),
            D.dispatchWorkgroups(Math.ceil(s / 256)),
            D.end(),
            this.device.queue.submit([y.finish()]));
          let C = this.device.createBuffer({
              size: s * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            O = this.device.createCommandEncoder();
          (O.copyBufferToBuffer(_, 0, C, 0, s * 4),
            this.device.queue.submit([O.finish()]),
            await C.mapAsync(GPUMapMode.READ));
          let M = new Float32Array(C.getMappedRange().slice(0));
          (C.unmap(), C.destroy());
          for (let R of p) this.bufferManager.release(R);
          this.bufferManager.release(_);
          let E = new Float64Array(s);
          for (let R = 0; R < s; R++) E[R] = M[R];
          return this.createArray(E, o.length === 0 ? [1] : o);
        }
        _generateEinsumShader(e, a, t, r, c, o, s, n, i, u) {
          let l = '';
          for (let g = 0; g < e; g++)
            l += `  @group(0) @binding(${g}) var<storage, read> op${g}: array<f32>;
`;
          l += `  @group(0) @binding(${e}) var<storage, read_write> result: array<f32>;
`;
          let f = g => {
              let b = a[g],
                p = o[g],
                _ = [];
              for (let A = 0; A < b.length; A++) {
                let w = b[A],
                  y = t.indexOf(w),
                  D = r.indexOf(w);
                y >= 0
                  ? _.push(`outCoord${y} * ${p[A]}u`)
                  : D >= 0 && _.push(`contrCoord${D} * ${p[A]}u`);
              }
              return _.length > 0 ? _.join(' + ') : '0u';
            },
            h = '';
          for (let g = 0; g < t.length; g++) {
            let b = s[g] || 1;
            g === 0
              ? ((h += `    var outCoord${g} = outIdx / ${b}u;
`),
                (h += `    var outRem${g} = outIdx % ${b}u;
`))
              : ((h += `    var outCoord${g} = outRem${g - 1} / ${b}u;
`),
                g < t.length - 1 &&
                  (h += `    var outRem${g} = outRem${g - 1} % ${b}u;
`));
          }
          let m = '';
          for (let g = 0; g < r.length; g++) {
            let b = n[g] || 1;
            g === 0
              ? ((m += `      var contrCoord${g} = contrIdx / ${b}u;
`),
                (m += `      var contrRem${g} = contrIdx % ${b}u;
`))
              : ((m += `      var contrCoord${g} = contrRem${g - 1} / ${b}u;
`),
                g < r.length - 1 &&
                  (m += `      var contrRem${g} = contrRem${g - 1} % ${b}u;
`));
          }
          let d = '';
          for (let g = 0; g < e; g++) {
            let b = f(g);
            d += `      prod = prod * op${g}[${b}];
`;
          }
          return `
${l}
  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let outIdx = gid.x;
    if (outIdx >= ${i}u) { return; }

${h}
    var sum: f32 = 0.0;
    for (var contrIdx: u32 = 0u; contrIdx < ${u}u; contrIdx = contrIdx + 1u) {
${m}
      var prod: f32 = 1.0;
${d}
      sum = sum + prod;
    }
    result[outIdx] = sum;
  }
`;
        }
        async convolve(e, a, t = 'full') {
          let r = this.flatten(e),
            c = this.flatten(a),
            o = r.data.length,
            s = c.data.length,
            n = o + s - 1,
            i,
            u;
          t === 'full'
            ? ((i = n), (u = 0))
            : t === 'same'
              ? ((i = o), (u = Math.floor((s - 1) / 2)))
              : ((i = Math.max(o - s + 1, 0)), (u = s - 1));
          let l = this.getOrCreatePipeline('convolve', kt),
            f = this.bufferManager.acquire(o * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
            h = this.bufferManager.acquire(s * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
            m = this.bufferManager.acquire(n * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC),
            d = this.bufferManager.acquire(16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST),
            g = new Float32Array(o),
            b = new Float32Array(s);
          for (let O = 0; O < o; O++) g[O] = r.data[O];
          for (let O = 0; O < s; O++) b[O] = c.data[O];
          (this.device.queue.writeBuffer(f, 0, g),
            this.device.queue.writeBuffer(h, 0, b),
            this.device.queue.writeBuffer(d, 0, new Uint32Array([o, s, n, 0])));
          let p = this.device.createBindGroup({
              layout: l.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: f } },
                { binding: 1, resource: { buffer: h } },
                { binding: 2, resource: { buffer: m } },
                { binding: 3, resource: { buffer: d } },
              ],
            }),
            _ = this.device.createCommandEncoder(),
            A = _.beginComputePass();
          (A.setPipeline(l),
            A.setBindGroup(0, p),
            A.dispatchWorkgroups(Math.ceil(n / 256)),
            A.end(),
            this.device.queue.submit([_.finish()]));
          let w = this.device.createBuffer({
              size: n * 4,
              usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
            }),
            y = this.device.createCommandEncoder();
          (y.copyBufferToBuffer(m, 0, w, 0, n * 4),
            this.device.queue.submit([y.finish()]),
            await w.mapAsync(GPUMapMode.READ));
          let D = new Float32Array(w.getMappedRange().slice(0));
          (w.unmap(),
            w.destroy(),
            this.bufferManager.release(f),
            this.bufferManager.release(h),
            this.bufferManager.release(m),
            this.bufferManager.release(d));
          let C = new Float64Array(i);
          for (let O = 0; O < i; O++) C[O] = D[u + O];
          return this.createArray(C, [i]);
        }
        async correlate(e, a, t = 'valid') {
          let r = this.flatten(a),
            c = r.data.length,
            o = new Float64Array(c);
          for (let n = 0; n < c; n++) o[n] = r.data[c - 1 - n];
          let s = this.createArray(o, r.shape);
          return await this.convolve(e, s, t);
        }
        sort(e, a = -1, t) {
          let r = e.shape.length;
          a = this._normalizeAxis(a, r);
          let c = e.shape,
            o = c[a];
          if (r === 1)
            return this._sortSliceGPU(
              e.data instanceof Float64Array ? e.data : new Float64Array(e.data),
              c
            );
          let s = new Float64Array(e.data),
            n = this._computeStrides(c),
            i = c.filter((f, h) => h !== a),
            u = i.length > 0 ? this._computeStrides(i) : [1],
            l = i.reduce((f, h) => f * h, 1) || 1;
          for (let f = 0; f < l; f++) {
            let h = new Float64Array(o),
              m = new Array(i.length),
              d = f;
            for (let _ = 0; _ < i.length; _++) ((m[_] = Math.floor(d / u[_])), (d = d % u[_]));
            let g = new Array(r),
              b = 0;
            for (let _ = 0; _ < r; _++) _ === a ? (g[_] = 0) : (g[_] = m[b++]);
            for (let _ = 0; _ < o; _++) {
              let A = [...g];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * n[y];
              h[_] = e.data[w];
            }
            let p = this._sortSliceNative(h);
            for (let _ = 0; _ < o; _++) {
              let A = [...g];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * n[y];
              s[w] = p[_];
            }
          }
          return this.createArray(s, c);
        }
        _sortSliceNative(e) {
          let a = Array.from(e);
          return (
            a.sort((t, r) =>
              Number.isNaN(t) && Number.isNaN(r)
                ? 0
                : Number.isNaN(t)
                  ? 1
                  : Number.isNaN(r)
                    ? -1
                    : t - r
            ),
            new Float64Array(a)
          );
        }
        _sortSliceGPU(e, a) {
          return this.createArray(this._sortSliceNative(e), a);
        }
        argsort(e, a = -1, t) {
          let r = e.shape.length;
          a = this._normalizeAxis(a, r);
          let c = e.shape,
            o = c[a];
          if (r === 1)
            return this.createArray(
              this._argsortSliceNative(
                e.data instanceof Float64Array ? e.data : new Float64Array(e.data)
              ),
              c
            );
          let s = new Float64Array(e.data.length),
            n = this._computeStrides(c),
            i = c.filter((f, h) => h !== a),
            u = i.length > 0 ? this._computeStrides(i) : [1],
            l = i.reduce((f, h) => f * h, 1) || 1;
          for (let f = 0; f < l; f++) {
            let h = new Array(i.length),
              m = f;
            for (let _ = 0; _ < i.length; _++) ((h[_] = Math.floor(m / u[_])), (m = m % u[_]));
            let d = new Array(r),
              g = 0;
            for (let _ = 0; _ < r; _++) _ === a ? (d[_] = 0) : (d[_] = h[g++]);
            let b = new Float64Array(o);
            for (let _ = 0; _ < o; _++) {
              let A = [...d];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * n[y];
              b[_] = e.data[w];
            }
            let p = this._argsortSliceNative(b);
            for (let _ = 0; _ < o; _++) {
              let A = [...d];
              A[a] = _;
              let w = 0;
              for (let y = 0; y < r; y++) w += A[y] * n[y];
              s[w] = p[_];
            }
          }
          return this.createArray(s, c);
        }
        _argsortSliceNative(e) {
          let a = Array.from({ length: e.length }, (t, r) => r);
          return (
            a.sort((t, r) => {
              let c = e[t],
                o = e[r];
              return Number.isNaN(c) && Number.isNaN(o)
                ? 0
                : Number.isNaN(c)
                  ? 1
                  : Number.isNaN(o)
                    ? -1
                    : c - o;
            }),
            new Float64Array(a)
          );
        }
        async sinAsync(e) {
          return this.runUnaryOp(e, 'sin');
        }
        async cosAsync(e) {
          return this.runUnaryOp(e, 'cos');
        }
        async tanAsync(e) {
          return this.runUnaryOp(e, 'tan');
        }
        async arcsinAsync(e) {
          return this.runUnaryOp(e, 'asin');
        }
        async arccosAsync(e) {
          return this.runUnaryOp(e, 'acos');
        }
        async arctanAsync(e) {
          return this.runUnaryOp(e, 'atan');
        }
        async sinhAsync(e) {
          return this.runUnaryOp(e, 'sinh');
        }
        async coshAsync(e) {
          return this.runUnaryOp(e, 'cosh');
        }
        async tanhAsync(e) {
          return this.runUnaryOp(e, 'tanh');
        }
        async expAsync(e) {
          return this.runUnaryOp(e, 'exp');
        }
        async exp2Async(e) {
          return this.runUnaryOp(e, 'exp2');
        }
        async logAsync(e) {
          return this.runUnaryOp(e, 'log');
        }
        async log2Async(e) {
          return this.runUnaryOp(e, 'log2');
        }
        async log10Async(e) {
          return this.runUnaryOp(e, 'log10');
        }
        async sqrtAsync(e) {
          return this.runUnaryOp(e, 'sqrt');
        }
        async cbrtAsync(e) {
          return this.runUnaryOp(e, 'cbrt');
        }
        async absAsync(e) {
          return this.runUnaryOp(e, 'abs');
        }
        async signAsync(e) {
          return this.runUnaryOp(e, 'sign');
        }
        async floorAsync(e) {
          return this.runUnaryOp(e, 'floor');
        }
        async ceilAsync(e) {
          return this.runUnaryOp(e, 'ceil');
        }
        async roundAsync(e) {
          return this.runUnaryOp(e, 'round');
        }
        async negAsync(e) {
          return this.runUnaryOp(e, 'neg');
        }
        async reciprocalAsync(e) {
          return this.runUnaryOp(e, 'reciprocal');
        }
        async squareAsync(e) {
          return this.runUnaryOp(e, 'square');
        }
        async arcsinhAsync(e) {
          return this.runUnaryOp(e, 'asinh');
        }
        async arccoshAsync(e) {
          return this.runUnaryOp(e, 'acosh');
        }
        async arctanhAsync(e) {
          return this.runUnaryOp(e, 'atanh');
        }
        async expm1Async(e) {
          return this.runUnaryOp(e, 'expm1');
        }
        async log1pAsync(e) {
          return this.runUnaryOp(e, 'log1p');
        }
        async truncAsync(e) {
          return this.runUnaryOp(e, 'trunc');
        }
        async fixAsync(e) {
          return this.runUnaryOp(e, 'trunc');
        }
        async sincAsync(e) {
          return this.runUnaryOp(e, 'sinc');
        }
        async deg2radAsync(e) {
          return this.runUnaryOp(e, 'deg2rad');
        }
        async rad2degAsync(e) {
          return this.runUnaryOp(e, 'rad2deg');
        }
        async signbitAsync(e) {
          return this.runUnaryOp(e, 'signbit');
        }
        async heavisideAsync(e, a) {
          return this.runScalarOp(e, a, 'heaviside');
        }
        async addAsync(e, a) {
          return this.runBinaryOp(e, a, 'add');
        }
        async subAsync(e, a) {
          return this.runBinaryOp(e, a, 'sub');
        }
        async mulAsync(e, a) {
          return this.runBinaryOp(e, a, 'mul');
        }
        async divAsync(e, a) {
          return this.runBinaryOp(e, a, 'div');
        }
        async powAsync(e, a) {
          return this.runBinaryOp(e, a, 'pow');
        }
        async maximumAsync(e, a) {
          return this.runBinaryOp(e, a, 'maximum');
        }
        async minimumAsync(e, a) {
          return this.runBinaryOp(e, a, 'minimum');
        }
        async modAsync(e, a) {
          return this.runBinaryOp(e, a, 'mod');
        }
        async fmodAsync(e, a) {
          return this.runBinaryOp(e, a, 'fmod');
        }
        async remainderAsync(e, a) {
          return this.runBinaryOp(e, a, 'mod');
        }
        async copysignAsync(e, a) {
          return this.runBinaryOp(e, a, 'copysign');
        }
        async hypotAsync(e, a) {
          return this.runBinaryOp(e, a, 'hypot');
        }
        async arctan2Async(e, a) {
          return this.runBinaryOp(e, a, 'arctan2');
        }
        async logaddexpAsync(e, a) {
          return this.runBinaryOp(e, a, 'logaddexp');
        }
        async logaddexp2Async(e, a) {
          return this.runBinaryOp(e, a, 'logaddexp2');
        }
        async fmaxAsync(e, a) {
          return this.runBinaryOp(e, a, 'fmax');
        }
        async fminAsync(e, a) {
          return this.runBinaryOp(e, a, 'fmin');
        }
        async modfAsync(e) {
          return this.runModf(e);
        }
        async frexpAsync(e) {
          return this.runFrexp(e);
        }
        async ldexpAsync(e, a) {
          let t = await this.runUnaryOp(a, 'exp2');
          return this.runBinaryOp(e, t, 'mul');
        }
        async divmodAsync(e, a) {
          return this.runDivmod(e, a);
        }
        async addScalarAsync(e, a) {
          return this.runScalarOp(e, a, 'addScalar');
        }
        async subScalarAsync(e, a) {
          return this.runScalarOp(e, a, 'subScalar');
        }
        async mulScalarAsync(e, a) {
          return this.runScalarOp(e, a, 'mulScalar');
        }
        async divScalarAsync(e, a) {
          return this.runScalarOp(e, a, 'divScalar');
        }
        async powScalarAsync(e, a) {
          return this.runScalarOp(e, a, 'powScalar');
        }
        async clipAsync(e, a, t) {
          return this.runClip(e, a, t);
        }
        async sumAsync(e) {
          return this.runReduction(e, 'sum');
        }
        async prodAsync(e) {
          return this.runReduction(e, 'prod');
        }
        async minAsync(e) {
          if (e.data.length === 0) throw new Error('zero-size array');
          return this.runReduction(e, 'min');
        }
        async maxAsync(e) {
          if (e.data.length === 0) throw new Error('zero-size array');
          return this.runReduction(e, 'max');
        }
        async cumsumAsync(e) {
          return this.runCumulative(e, 'cumsum');
        }
        async cumprodAsync(e) {
          return this.runCumulative(e, 'cumprod');
        }
        async meanAsync(e) {
          return e.data.length === 0 ? NaN : (await this.sumAsync(e)) / e.data.length;
        }
        async varAsync(e, a = 0) {
          let t = e.data.length;
          if (t === 0) return NaN;
          let r = await this.meanAsync(e),
            c = await this.addScalarAsync(e, -r),
            o = await this.squareAsync(c);
          return (await this.sumAsync(o)) / (t - a);
        }
        async stdAsync(e, a = 0) {
          return Math.sqrt(await this.varAsync(e, a));
        }
        async argminAsync(e) {
          return this.runArgReduction(e, 'argmin');
        }
        async argmaxAsync(e) {
          return this.runArgReduction(e, 'argmax');
        }
        async allAsync(e) {
          return this.runBoolReduction(e, 'all');
        }
        async anyAsync(e) {
          return this.runBoolReduction(e, 'any');
        }
        async sumAxisAsync(e, a) {
          return this.runSumAxis(e, a);
        }
        async meanAxisAsync(e, a) {
          let t = await this.runSumAxis(e, a),
            r = e.shape[a],
            c = new Float64Array(t.data.length);
          for (let o = 0; o < c.length; o++) c[o] = t.data[o] / r;
          return this.createArray(c, t.shape);
        }
        async transposeAsync(e) {
          return this.runTranspose(e);
        }
        async outerAsync(e, a) {
          return this.runOuter(e, a);
        }
        async dotAsync(e, a) {
          if (e.shape.length === 1 && a.shape.length === 1) {
            let t = await this.runDot(e, a);
            return this.createArray([t], [1]);
          }
          return this.matmulAsync(e, a);
        }
        async innerAsync(e, a) {
          return this.runDot(e, a);
        }
        async traceAsync(e) {
          return this.runTrace(e);
        }
        async normAsync(e, a) {
          if (a === void 0 || a === 2) return this.runNorm(e);
          if (a === 1) {
            let t = await this.absAsync(e);
            return this.sumAsync(t);
          }
          if (a === 1 / 0) {
            let t = await this.absAsync(e);
            return this.maxAsync(t);
          }
          throw new Error(`Norm ord=${a} not supported`);
        }
        async sortFlatAsync(e) {
          let a = e.data,
            t = a.length;
          if (t <= 1) return this.createArray(new Float64Array(a), e.shape);
          let r = 1;
          for (; r < t; ) r *= 2;
          let c = new Float32Array(r);
          for (let l = 0; l < t; l++) c[l] = a[l];
          for (let l = t; l < r; l++) c[l] = 1 / 0;
          let o = this.bufferManager.acquire(
            r * 4,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
          );
          this.device.queue.writeBuffer(o, 0, c);
          let s = 'bitonic-sort-step',
            n = I.get(s);
          if (!n) {
            let l = this.device.createShaderModule({ code: bt() });
            ((n = this.device.createComputePipeline({
              layout: 'auto',
              compute: { module: l, entryPoint: 'main' },
            })),
              I.set(s, n));
          }
          let i = this.bufferManager.acquire(16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST),
            u = Math.ceil(r / 256);
          try {
            for (let d = 2; d <= r; d *= 2)
              for (let g = d / 2; g >= 1; g = Math.floor(g / 2)) {
                let b = new Uint32Array([r, g, d, 0]);
                this.device.queue.writeBuffer(i, 0, b);
                let p = this.device.createBindGroup({
                    layout: n.getBindGroupLayout(0),
                    entries: [
                      { binding: 0, resource: { buffer: o } },
                      { binding: 1, resource: { buffer: i } },
                    ],
                  }),
                  _ = this.device.createCommandEncoder(),
                  A = _.beginComputePass();
                (A.setPipeline(n),
                  A.setBindGroup(0, p),
                  A.dispatchWorkgroups(u),
                  A.end(),
                  this.device.queue.submit([_.finish()]));
              }
            let l = this.bufferManager.acquireStaging(t * 4),
              f = this.device.createCommandEncoder();
            (f.copyBufferToBuffer(o, 0, l, 0, t * 4),
              this.device.queue.submit([f.finish()]),
              await l.mapAsync(GPUMapMode.READ));
            let h = new Float32Array(l.getMappedRange().slice(0, t * 4));
            (l.unmap(), this.bufferManager.releaseStaging(l));
            let m = new Float64Array(t);
            for (let d = 0; d < t; d++) m[d] = h[d];
            return this.createArray(m, e.shape);
          } finally {
            (this.bufferManager.release(o), this.bufferManager.release(i));
          }
        }
        async argsortFlatAsync(e) {
          let a = e.data,
            t = a.length;
          if (t <= 1) return this.createArray(new Float64Array([0]), [1]);
          let r = 1;
          for (; r < t; ) r *= 2;
          let c = new Float32Array(r);
          for (let p = 0; p < t; p++) c[p] = a[p];
          for (let p = t; p < r; p++) c[p] = 1 / 0;
          let o = this.bufferManager.acquire(
            r * 4,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
          );
          this.device.queue.writeBuffer(o, 0, c);
          let s = this.bufferManager.acquire(
              r * 4,
              GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            ),
            n = 'init-indices',
            i = I.get(n);
          if (!i) {
            let p = this.device.createShaderModule({ code: wt });
            ((i = this.device.createComputePipeline({
              layout: 'auto',
              compute: { module: p, entryPoint: 'main' },
            })),
              I.set(n, i));
          }
          let u = this.bufferManager.acquire(4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
          this.device.queue.writeBuffer(u, 0, new Uint32Array([r]));
          let l = this.device.createBindGroup({
              layout: i.getBindGroupLayout(0),
              entries: [
                { binding: 0, resource: { buffer: s } },
                { binding: 1, resource: { buffer: u } },
              ],
            }),
            f = this.device.createCommandEncoder(),
            h = f.beginComputePass();
          (h.setPipeline(i),
            h.setBindGroup(0, l),
            h.dispatchWorkgroups(Math.ceil(r / 256)),
            h.end(),
            this.device.queue.submit([f.finish()]));
          let m = 'bitonic-argsort-step',
            d = I.get(m);
          if (!d) {
            let p = this.device.createShaderModule({ code: At() });
            ((d = this.device.createComputePipeline({
              layout: 'auto',
              compute: { module: p, entryPoint: 'main' },
            })),
              I.set(m, d));
          }
          let g = this.bufferManager.acquire(16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST),
            b = Math.ceil(r / 256);
          try {
            for (let w = 2; w <= r; w *= 2)
              for (let y = w / 2; y >= 1; y = Math.floor(y / 2)) {
                let D = new Uint32Array([r, y, w, 0]);
                this.device.queue.writeBuffer(g, 0, D);
                let C = this.device.createBindGroup({
                  layout: d.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: o } },
                    { binding: 1, resource: { buffer: s } },
                    { binding: 2, resource: { buffer: g } },
                  ],
                });
                ((f = this.device.createCommandEncoder()),
                  (h = f.beginComputePass()),
                  h.setPipeline(d),
                  h.setBindGroup(0, C),
                  h.dispatchWorkgroups(b),
                  h.end(),
                  this.device.queue.submit([f.finish()]));
              }
            let p = this.bufferManager.acquireStaging(t * 4);
            ((f = this.device.createCommandEncoder()),
              f.copyBufferToBuffer(s, 0, p, 0, t * 4),
              this.device.queue.submit([f.finish()]),
              await p.mapAsync(GPUMapMode.READ));
            let _ = new Uint32Array(p.getMappedRange().slice(0, t * 4));
            (p.unmap(), this.bufferManager.releaseStaging(p));
            let A = new Float64Array(t);
            for (let w = 0; w < t; w++) A[w] = _[w];
            return this.createArray(A, e.shape);
          } finally {
            (this.bufferManager.release(o),
              this.bufferManager.release(s),
              this.bufferManager.release(g),
              this.bufferManager.release(u));
          }
        }
        async uniqueAsync(e) {
          let a = e.data,
            t = a.length;
          if (t === 0) return this.createArray(new Float64Array(0), [0]);
          if (t === 1) return this.createArray(new Float64Array(a), [1]);
          let c = (await this.sortFlatAsync(this.flatten(e))).data;
          if (t < 1024) {
            let f = new Set(),
              h = [];
            for (let m = 0; m < t; m++) {
              let d = c[m];
              f.has(d) || (f.add(d), h.push(d));
            }
            return this.createArray(new Float64Array(h), [h.length]);
          }
          let o = new Float32Array(t);
          for (let f = 0; f < t; f++) o[f] = c[f];
          let s = this.bufferManager.acquire(
            t * 4,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
          );
          this.device.queue.writeBuffer(s, 0, o);
          let n = this.bufferManager.acquire(
              t * 4,
              GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            ),
            i = this.bufferManager.acquire(
              t * 4,
              GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            ),
            u = this.bufferManager.acquire(t * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC),
            l = this.bufferManager.acquire(8, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
          try {
            let f = 'mark-unique',
              h = I.get(f);
            if (!h) {
              let E = this.device.createShaderModule({ code: vt });
              ((h = this.device.createComputePipeline({
                layout: 'auto',
                compute: { module: E, entryPoint: 'main' },
              })),
                I.set(f, h));
            }
            this.device.queue.writeBuffer(l, 0, new Uint32Array([t]));
            let m = this.device.createCommandEncoder(),
              d = m.beginComputePass();
            (d.setPipeline(h),
              d.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: h.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: s } },
                    { binding: 1, resource: { buffer: n } },
                    { binding: 2, resource: { buffer: l } },
                  ],
                })
              ),
              d.dispatchWorkgroups(Math.ceil(t / 256)),
              d.end(),
              this.device.queue.submit([m.finish()]));
            let g = 'exclusive-scan',
              b = I.get(g);
            if (!b) {
              let E = this.device.createShaderModule({ code: Bt });
              ((b = this.device.createComputePipeline({
                layout: 'auto',
                compute: { module: E, entryPoint: 'main' },
              })),
                I.set(g, b));
            }
            let p = this.bufferManager.acquire(8, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
            (this.device.queue.writeBuffer(p, 0, new Uint32Array([t, 0])),
              (m = this.device.createCommandEncoder()),
              (d = m.beginComputePass()),
              d.setPipeline(b),
              d.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: b.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: n } },
                    { binding: 1, resource: { buffer: i } },
                    { binding: 2, resource: { buffer: p } },
                  ],
                })
              ),
              d.dispatchWorkgroups(Math.ceil(t / 256)),
              d.end(),
              this.device.queue.submit([m.finish()]));
            let _ = 'compact-unique',
              A = I.get(_);
            if (!A) {
              let E = this.device.createShaderModule({ code: yt });
              ((A = this.device.createComputePipeline({
                layout: 'auto',
                compute: { module: E, entryPoint: 'main' },
              })),
                I.set(_, A));
            }
            ((m = this.device.createCommandEncoder()),
              (d = m.beginComputePass()),
              d.setPipeline(A),
              d.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: A.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: s } },
                    { binding: 1, resource: { buffer: n } },
                    { binding: 2, resource: { buffer: i } },
                    { binding: 3, resource: { buffer: u } },
                    { binding: 4, resource: { buffer: l } },
                  ],
                })
              ),
              d.dispatchWorkgroups(Math.ceil(t / 256)),
              d.end(),
              this.device.queue.submit([m.finish()]));
            let w = this.bufferManager.acquireStaging(t * 4);
            ((m = this.device.createCommandEncoder()),
              m.copyBufferToBuffer(n, 0, w, 0, t * 4),
              this.device.queue.submit([m.finish()]),
              await w.mapAsync(GPUMapMode.READ));
            let y = new Uint32Array(w.getMappedRange().slice(0));
            (w.unmap(), this.bufferManager.releaseStaging(w));
            let D = 0;
            for (let E = 0; E < t; E++) D += y[E];
            let C = this.bufferManager.acquireStaging(D * 4);
            ((m = this.device.createCommandEncoder()),
              m.copyBufferToBuffer(u, 0, C, 0, D * 4),
              this.device.queue.submit([m.finish()]),
              await C.mapAsync(GPUMapMode.READ));
            let O = new Float32Array(C.getMappedRange().slice(0, D * 4));
            (C.unmap(), this.bufferManager.releaseStaging(C));
            let M = new Float64Array(D);
            for (let E = 0; E < D; E++) M[E] = O[E];
            return (this.bufferManager.release(p), this.createArray(M, [D]));
          } finally {
            (this.bufferManager.release(s),
              this.bufferManager.release(n),
              this.bufferManager.release(i),
              this.bufferManager.release(u),
              this.bufferManager.release(l));
          }
        }
        async bincountAsync(e, a, t) {
          let r = e.data,
            c = r.length,
            o = 0;
          for (let h = 0; h < c; h++) {
            let m = Math.floor(r[h]);
            if (m < 0) throw new Error('bincount requires non-negative integers');
            m > o && (o = m);
          }
          let s = Math.max(o + 1, t || 0);
          if (c === 0) return this.createArray(new Float64Array(s), [s]);
          if (c < 256 || s < 16) return this.bincount(e, a, t);
          let n = new Int32Array(c);
          for (let h = 0; h < c; h++) n[h] = Math.floor(r[h]);
          let i = this.bufferManager.acquire(
            c * 4,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
          );
          this.device.queue.writeBuffer(i, 0, n);
          let u = this.bufferManager.acquire(
              s * 4,
              GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            ),
            l = new Uint32Array(s);
          this.device.queue.writeBuffer(u, 0, l);
          let f = this.bufferManager.acquire(4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
          this.device.queue.writeBuffer(f, 0, new Uint32Array([c]));
          try {
            if (a) {
              let h = a.data,
                m = new Float32Array(c);
              for (let C = 0; C < c; C++) m[C] = h[C];
              let d = this.bufferManager.acquire(
                c * 4,
                GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
              );
              this.device.queue.writeBuffer(d, 0, m);
              let g = 'weighted-bincount',
                b = I.get(g);
              if (!b) {
                let C = this.device.createShaderModule({ code: st() });
                ((b = this.device.createComputePipeline({
                  layout: 'auto',
                  compute: { module: C, entryPoint: 'main' },
                })),
                  I.set(g, b));
              }
              let p = this.device.createCommandEncoder(),
                _ = p.beginComputePass();
              (_.setPipeline(b),
                _.setBindGroup(
                  0,
                  this.device.createBindGroup({
                    layout: b.getBindGroupLayout(0),
                    entries: [
                      { binding: 0, resource: { buffer: i } },
                      { binding: 1, resource: { buffer: d } },
                      { binding: 2, resource: { buffer: u } },
                      { binding: 3, resource: { buffer: f } },
                    ],
                  })
                ),
                _.dispatchWorkgroups(Math.ceil(c / 256)),
                _.end(),
                this.device.queue.submit([p.finish()]));
              let A = this.bufferManager.acquireStaging(s * 4),
                w = this.device.createCommandEncoder();
              (w.copyBufferToBuffer(u, 0, A, 0, s * 4),
                this.device.queue.submit([w.finish()]),
                await A.mapAsync(GPUMapMode.READ));
              let y = new Uint32Array(A.getMappedRange().slice(0));
              (A.unmap(), this.bufferManager.releaseStaging(A), this.bufferManager.release(d));
              let D = new Float64Array(s);
              for (let C = 0; C < s; C++) D[C] = y[C] / 1e6;
              return this.createArray(D, [s]);
            } else {
              let h = 'bincount',
                m = I.get(h);
              if (!m) {
                let w = this.device.createShaderModule({ code: ot() });
                ((m = this.device.createComputePipeline({
                  layout: 'auto',
                  compute: { module: w, entryPoint: 'main' },
                })),
                  I.set(h, m));
              }
              let d = this.device.createCommandEncoder(),
                g = d.beginComputePass();
              (g.setPipeline(m),
                g.setBindGroup(
                  0,
                  this.device.createBindGroup({
                    layout: m.getBindGroupLayout(0),
                    entries: [
                      { binding: 0, resource: { buffer: i } },
                      { binding: 1, resource: { buffer: u } },
                      { binding: 2, resource: { buffer: f } },
                    ],
                  })
                ),
                g.dispatchWorkgroups(Math.ceil(c / 256)),
                g.end(),
                this.device.queue.submit([d.finish()]));
              let b = this.bufferManager.acquireStaging(s * 4),
                p = this.device.createCommandEncoder();
              (p.copyBufferToBuffer(u, 0, b, 0, s * 4),
                this.device.queue.submit([p.finish()]),
                await b.mapAsync(GPUMapMode.READ));
              let _ = new Uint32Array(b.getMappedRange().slice(0));
              (b.unmap(), this.bufferManager.releaseStaging(b));
              let A = new Float64Array(s);
              for (let w = 0; w < s; w++) A[w] = _[w];
              return this.createArray(A, [s]);
            }
          } finally {
            (this.bufferManager.release(i),
              this.bufferManager.release(u),
              this.bufferManager.release(f));
          }
        }
        async searchsortedAsync(e, a, t = 'left') {
          let r = this.flatten(e).data,
            c = this.flatten(a).data,
            o = r.length,
            s = c.length;
          if (s === 0) return this.createArray(new Float64Array(0), [0]);
          if (o === 0) return this.createArray(new Float64Array(s).fill(0), a.shape);
          if (s < 64 || o < 64) return this.searchsorted(e, a, t);
          let n = new Float32Array(o);
          for (let m = 0; m < o; m++) n[m] = r[m];
          let i = new Float32Array(s);
          for (let m = 0; m < s; m++) i[m] = c[m];
          let u = this.bufferManager.acquire(
              o * 4,
              GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            ),
            l = this.bufferManager.acquire(s * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
            f = this.bufferManager.acquire(s * 4, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC),
            h = this.bufferManager.acquire(8, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
          (this.device.queue.writeBuffer(u, 0, n),
            this.device.queue.writeBuffer(l, 0, i),
            this.device.queue.writeBuffer(h, 0, new Uint32Array([o, s])));
          try {
            let m = `searchsorted-${t}`,
              d = I.get(m);
            if (!d) {
              let y = this.device.createShaderModule({ code: Ct(t) });
              ((d = this.device.createComputePipeline({
                layout: 'auto',
                compute: { module: y, entryPoint: 'main' },
              })),
                I.set(m, d));
            }
            let g = this.device.createCommandEncoder(),
              b = g.beginComputePass();
            (b.setPipeline(d),
              b.setBindGroup(
                0,
                this.device.createBindGroup({
                  layout: d.getBindGroupLayout(0),
                  entries: [
                    { binding: 0, resource: { buffer: u } },
                    { binding: 1, resource: { buffer: l } },
                    { binding: 2, resource: { buffer: f } },
                    { binding: 3, resource: { buffer: h } },
                  ],
                })
              ),
              b.dispatchWorkgroups(Math.ceil(s / 256)),
              b.end(),
              this.device.queue.submit([g.finish()]));
            let p = this.bufferManager.acquireStaging(s * 4),
              _ = this.device.createCommandEncoder();
            (_.copyBufferToBuffer(f, 0, p, 0, s * 4),
              this.device.queue.submit([_.finish()]),
              await p.mapAsync(GPUMapMode.READ));
            let A = new Uint32Array(p.getMappedRange().slice(0));
            (p.unmap(), this.bufferManager.releaseStaging(p));
            let w = new Float64Array(s);
            for (let y = 0; y < s; y++) w[y] = A[y];
            return this.createArray(w, a.shape);
          } finally {
            (this.bufferManager.release(u),
              this.bufferManager.release(l),
              this.bufferManager.release(f),
              this.bufferManager.release(h));
          }
        }
        async lexsortAsync(e) {
          if (e.length === 0) throw new Error('lexsort requires at least one key');
          let a = e[0].data.length;
          for (let r of e)
            if (r.data.length !== a) throw new Error('All keys must have the same length');
          if (a <= 1) return this.createArray(new Float64Array([0]), [1]);
          let t = new Float64Array(a);
          for (let r = 0; r < a; r++) t[r] = r;
          for (let r = e.length - 1; r >= 0; r--) {
            let c = e[r].data,
              o = new Float64Array(a);
            for (let u = 0; u < a; u++) o[u] = c[t[u]];
            let s = this.createArray(o, [a]),
              n = await this.argsortFlatAsync(s),
              i = new Float64Array(a);
            for (let u = 0; u < a; u++) i[u] = t[n.data[u]];
            t = i;
          }
          return this.createArray(t, [a]);
        }
      }));
  });
async function or(v = 'js') {
  if (v === 'js') {
    let { createJsBackend: e } = await Promise.resolve().then(() => (De(), Ce));
    return e();
  }
  if (v === 'wasm') {
    let { initWasmBackend: e, createWasmBackend: a } = await Promise.resolve().then(
      () => (Se(), Ne)
    );
    return (await e(), a());
  }
  if (v === 'webgpu') {
    let { initWebGPUBackend: e, createWebGPUBackend: a } = await Promise.resolve().then(
      () => (We(), je)
    );
    return (await e(), a());
  }
  throw new Error(`Unknown backend type: ${v}. Use 'js', 'wasm', or 'webgpu'.`);
}
var sr = '1.0.0';
export { or as createBackend, sr as version };
