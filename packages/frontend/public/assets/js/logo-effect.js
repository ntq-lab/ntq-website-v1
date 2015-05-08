;(function() {
    'use strict';

    var helperFactory = function (data) {
        var lineMaterial = function () {
            return new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true
            });
        };

        var meshMaterial = function () {
            return new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true
            });
        };

        var boundary = {
            x1: 9999999,
            y1: 9999999,
            x2: -9999999,
            y2: -9999999
        };

        var textureLoadingJobs = [];

        for (var i = 0; i < data.length; i++) {
            boundary.x1 = boundary.x1 > data[i].x ? data[i].x : boundary.x1;
            boundary.y1 = boundary.y1 > data[i].y ? data[i].y : boundary.y1;
            boundary.x2 = boundary.x2 < data[i].x + data[i].width ? data[i].x + data[i].width : boundary.x2;
            boundary.y2 = boundary.y2 < data[i].y + data[i].height ? data[i].y + data[i].width : boundary.y2;
        }

        return {
            ready: Promise.all(textureLoadingJobs),
            adjustCoordinate: function (object, origin) {
                origin = origin || { x: 0, y: 0, z: 0 };

                object.x = object.x - boundary.x1 - (boundary.x2 - boundary.x1) / 2 + origin.x;
                object.y = -object.y + boundary.y1 + (boundary.y2 - boundary.y1) / 2 - origin.y;
                object.z = object.z;

                return object;
            },
            adjustCoordinates: function (points) {
                if (points.length) {
                    for (var i = 0; i < points.length; i++) {
                        this.adjustCoordinate(points[i]);
                    }
                } else {
                    this.adjustCoordinate(points);
                }

                var arg = arguments;
                var self = this;

                return {
                    then: function (action) {
                        return action.apply(self, arg);
                    }
                };
            },
            drawLine: function (points, options) {
                options = options || {};
                var g = new THREE.Geometry();

                for (var i = 0; i < points.length - 1; i++) {
                    var from = points[i];
                    var to = points[i + 1];


                    g.vertices.push(
                    new THREE.Vector3(from.x, from.y, from.z),
                    new THREE.Vector3(to.x, to.y, to.z)
                );
                }

                return new THREE.Line(g, options.material || lineMaterial());
            },
            drawBox: function (point, size, options) {
                var points = [{
                    x: 0,
                    y: 0
                }, {
                    x: size,
                    y: 0
                }, {
                    x: size,
                    y: -size
                }, {
                    x: 0,
                    y: -size
                }, {
                    x: 0,
                    y: 0
                }];

                var line = this.drawLine(points, options);
                line.position.x = point.x;
                line.position.y = point.y;

                return line;
            },
            drawCircle: function (point, radius, options) {
                options = options || {};
                var g = new THREE.CircleGeometry(radius, 16);

                var circle = new THREE.Mesh(g, options.material || meshMaterial());
                circle.position.x = point.x;
                circle.position.y = point.y;

                return circle;
            },
            drawPlane: function (point, w, h, options) {
                options = options || {};
                var g = new THREE.PlaneGeometry(w, h);

                var plane = new THREE.Mesh(g, options.material || meshMaterial());
                plane.position.x = point.x;
                plane.position.y = point.y;

                return plane;
            }
        };
    };

    function start(data) {
        var scene, camera, renderer, container; // for setup scene
        var helper = helperFactory(data);

        // handle resize
        var delay;
        window.addEventListener('resize', function () {
            clearTimeout(delay);
            delay = setTimeout(function () {
                renderer.setSize(container.clientWidth, container.clientHeight);
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                render();
            }, 310);
        });

        var render = function () {
            TWEEN.update();

            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        var animate = function () {
            requestAnimationFrame(animate);

            if (Effect.active || mouseMove) {
                mouseMove = false;
                render();
            }
        };

        var mouseMove = false;

        var createScene = function () {
            container = document.getElementById('canvas');

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(150, container.clientWidth / container.clientHeight, 0.1, 2000);
            camera.position.z = 70;

            if (window.Detector.webgl) {
                renderer = new THREE.WebGLRenderer();
            } else {
                renderer = new THREE.CanvasRenderer();
            }
            renderer.setClearColor(0xEAEAEA);

            renderer.setSize(container.clientWidth, container.clientHeight);

            container.appendChild(renderer.domElement);

            var projector = new THREE.Projector();
            var effectRadius = 125;
            var effectPower = 3;

            container.addEventListener('mousemove', function (e) {
                if (!Effect.active) {

                    var vector = new THREE.Vector3(
                        ((e.clientX + window.scrollX) / container.offsetWidth) * 2 - 1,
                        -((e.clientY + window.scrollY) / container.offsetHeight) * 2 + 1,
                        0.5
                    );

                    projector.unprojectVector(vector, camera);

                    var dir = vector.sub(camera.position).normalize();

                    var distance = -camera.position.z / dir.z;

                    var pos = camera.position.clone().add(dir.multiplyScalar(distance));

                    //mouseCursor.position.x = pos.x;
                    //mouseCursor.position.y = pos.y;
                    //mouseCursor.position.z = pos.z;

                    for (var i = 0; i < blocks.length; i++) {
                        var d = pos.distanceTo(blocks[i].position);

                        if (d < effectRadius) {
                            blocks[i].position.z = -(effectRadius - d) / (effectRadius / effectPower);
                            blocks[i].material.opacity = d / (effectRadius / 0.3) + 0.7;
                        } else {
                            blocks[i].position.z = 0;
                            blocks[i].material.opacity = 1;
                        }
                    }

                    mouseMove = true;
                }
            });

            render();
        };

        // logic
        createScene();

        var blocks = [];
        var text;

        helper.ready.then(function () {
            data.sort(function (l, r) {
                return +(l.x - r.x);
            });

            var i;
            for (i = 0; i < data.length; i++) {
                var box = helper.drawPlane({
                    x: data[i].x,
                    y: data[i].y
                }, data[i].width, data[i].height, {
                    material: new THREE.MeshBasicMaterial({
                        color: parseInt(data[i].fill.substr(1), 16),
                        transparent: true
                    })
                });

                helper.adjustCoordinate(box.position, {
                    x: data[i].width / 2,
                    y: data[i].height / 2
                });

                blocks.push(box);

                Effect.bounceIn(blocks[i], i, data[i]);
            }

            new THREE.TextureLoader().load('/img/texture/text.png', function (map) {
                var m = new THREE.MeshBasicMaterial({
                    map: map,
                    transparent: true
                });

                text = helper.drawPlane({
                    x: 0,
                    y: -103
                }, 486, 33, {
                    material: m
                });

                animate();
            });
        });

        var Effect = {
            active: 0,
            bounceIn: function (object, order, data) {
                Effect.active++;

                var originX = object.position.x;
                var originY = object.position.y;
                var originZ = object.position.z;

                new TWEEN.Tween({
                    x: 0,
                    y: 20,
                    z: camera.position.z * 2,
                    opacity: 0
                }).to({
                    x: originX,
                    y: originY,
                    z: originZ,
                    opacity: 1
                }, 0.8e3).onUpdate(function (t) {
                    object.position.x = this.x;
                    object.position.y = this.y;
                    object.position.z = this.z;
                    object.material.opacity = t;
                }).onStart(function () {
                    scene.add(object);
                }).onComplete(function () {
                    Effect.active--;

                    if (Effect.active === 0) {
                        // show text
                        Effect.fadeIn(text);
                    }
                }).easing(TWEEN.Easing.Bounce.Out)
                .delay(order * 5 + data.width * 70)
                .start();

            },
            fadeIn: function (object) {
                Effect.active++;

                new TWEEN.Tween({
                    opacity: 0
                }).to({
                    opacity: 1
                }, 3e3).onUpdate(function () {
                    object.material.opacity = this.opacity;
                }).onStart(function () {
                    scene.add(object);
                }).onComplete(function () {
                    Effect.active--;
                }).easing(TWEEN.Easing.Bounce.Out)
                .start();
            }
        };
    }

    window.LOGO = {
        show: function (fallback) {
            var dec = window.Detector;

            if ((dec.canvas || dec.webgl) && window.__logo) {
                start(window.__logo);
            } else {
                fallback();
            }
        }
    };
}());
