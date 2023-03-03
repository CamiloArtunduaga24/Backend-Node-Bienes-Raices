/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\n(function() {\r\n    const lat =  4.5981206;\r\n    const lng = -74.0760435;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa)\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const URL = '/api/propiedades'\r\n            const respuesta = await fetch(URL)\r\n            const propiedades = await respuesta.json()\r\n\r\n            mostrarPropiedades(propiedades)\r\n\r\n            console.log(respuesta);\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    \r\n    const mostrarPropiedades = propiedades => {\r\n        propiedades.forEach(propiedad => {\r\n            console.log(propiedad);\r\n            //Agregar Pines\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan: true\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(`\r\n                <p class=\"text-indigo-600 font-bold\">${propiedad.categoria.nombre}</p>\r\n                <h1 class=\"text-xl font-bold uppercase my-2\">${propiedad?.titulo}</h1>\r\n                <img width=\"480\" height=\"300\" src=\"/uploads/${propiedad?.img}\" alt=\"Imagen de la propiedad ${propiedad?.titulo}\">\r\n                <p class=\"text-gray-600 font-bold\">${propiedad.precio.nombre}</p>\r\n                <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\"> Ver propiedad </a>\r\n            `)\r\n\r\n            markers.addLayer(marker)\r\n        });\r\n    }\r\n\r\n    obtenerPropiedades()\r\n})()\n\n//# sourceURL=webpack://bienes-reices-mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;