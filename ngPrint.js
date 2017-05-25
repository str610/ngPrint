(function (angular) {
    'use strict';

    var mod = angular.module('ngPrint', []);

    function printDirective() {
        var printSection = document.getElementById('printSection');

        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }

        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });

            if (window.matchMedia) {
                var mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mql) {
                    if (!mql.matches) {
                        afterPrint();
                    } else {
                        // before print (currently does nothing)
                    }
                });
            }

            window.onafterprint = afterPrint;
        }

        function cloneCanvas(oldCanvas) {
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;
            context.drawImage(oldCanvas, 0, 0);
            return newCanvas;
        }

        function cloneNode(element) {
            var newElement = element.cloneNode(true);

            var nweChildCanvas = newElement.querySelectorAll('canvas');
            var oldChildCanvas = element.querySelectorAll('canvas');
            for (var i = 0; i < oldChildCanvas.length; i++) {
                nweChildCanvas[i].parentNode.replaceChild(cloneCanvas(oldChildCanvas[i]), nweChildCanvas[i]);
            }
            return newElement;
        }

        function afterPrint() {
            // clean the print section before adding new content
            printSection.innerHTML = '';
        }

        function printElement(elem) {
            // clones the element you want to print
            var domClone = cloneNode(true);
            printSection.innerHTML = '';
            printSection.appendChild(domClone);
            window.print();
        }

        return {
            link: link,
            restrict: 'A'
        };
    }

    mod.directive('ngPrint', [printDirective]);
}(window.angular));
