/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./context/themeContext.js":
/*!*********************************!*\
  !*** ./context/themeContext.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nfunction ThemeProvider({ children }) {\n    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('light');\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"ThemeProvider.useEffect\": ()=>{\n            const savedTheme = localStorage.getItem('theme') || 'light';\n            const systemPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;\n            const initalTheme = savedTheme === 'dark' || savedTheme === 'system' && systemPreferDark ? 'dark' : 'light';\n            setTheme(initalTheme);\n            document.documentElement.setAttribute('data-theme', initalTheme);\n        }\n    }[\"ThemeProvider.useEffect\"], []);\n    const toggleTheme = ()=>{\n        const newTheme = theme === 'light' ? 'dark' : 'light';\n        setTheme(newTheme);\n        localStorage.setItem('theme', newTheme);\n        document.documentElement.setAttribute('data-theme', newTheme);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/shibah/Library/CloudStorage/GoogleDrive-kevinshighschoolmaterial@gmail.com/My Drive/Programming/Summer Hack Club/Discord_Bot/dashboard/context/themeContext.js\",\n        lineNumber: 20,\n        columnNumber: 9\n    }, this);\n}\nfunction useTheme() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbnRleHQvdGhlbWVDb250ZXh0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBc0U7QUFDdEUsTUFBTUksNkJBQWVKLG9EQUFhQTtBQUUzQixTQUFTSyxjQUFjLEVBQUVDLFFBQVEsRUFBQztJQUNyQyxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR0wsK0NBQVFBLENBQUM7SUFDbkNELGdEQUFTQTttQ0FBQztZQUNOLE1BQU1PLGFBQWFDLGFBQWFDLE9BQU8sQ0FBQyxZQUFZO1lBQ3BELE1BQU1DLG1CQUFtQkMsT0FBT0MsVUFBVSxDQUFDLGdDQUFnQ0MsT0FBTztZQUNsRixNQUFNQyxjQUFjUCxlQUFlLFVBQVdBLGVBQWUsWUFBWUcsbUJBQW9CLFNBQVM7WUFDdEdKLFNBQVNRO1lBQ1RDLFNBQVNDLGVBQWUsQ0FBQ0MsWUFBWSxDQUFDLGNBQWNIO1FBQ3hEO2tDQUFHLEVBQUU7SUFDTCxNQUFNSSxjQUFjO1FBQ2hCLE1BQU1DLFdBQVdkLFVBQVUsVUFBVSxTQUFTO1FBQzlDQyxTQUFTYTtRQUNUWCxhQUFhWSxPQUFPLENBQUMsU0FBU0Q7UUFDOUJKLFNBQVNDLGVBQWUsQ0FBQ0MsWUFBWSxDQUFDLGNBQWNFO0lBQ3hEO0lBQ0EscUJBQ0ksOERBQUNqQixhQUFhbUIsUUFBUTtRQUFDQyxPQUFPO1lBQUNqQjtZQUFPYTtRQUFXO2tCQUM1Q2Q7Ozs7OztBQUdiO0FBQ08sU0FBU21CO0lBQ1osT0FBT3hCLGlEQUFVQSxDQUFDRztBQUN0QiIsInNvdXJjZXMiOlsiL1VzZXJzL3NoaWJhaC9MaWJyYXJ5L0Nsb3VkU3RvcmFnZS9Hb29nbGVEcml2ZS1rZXZpbnNoaWdoc2Nob29sbWF0ZXJpYWxAZ21haWwuY29tL015IERyaXZlL1Byb2dyYW1taW5nL1N1bW1lciBIYWNrIENsdWIvRGlzY29yZF9Cb3QvZGFzaGJvYXJkL2NvbnRleHQvdGhlbWVDb250ZXh0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IFRoZW1lQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIoeyBjaGlsZHJlbn0pIHtcbiAgICBjb25zdCBbdGhlbWUsIHNldFRoZW1lXSA9IHVzZVN0YXRlKCdsaWdodCcpO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNhdmVkVGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSB8fCAnbGlnaHQnO1xuICAgICAgICBjb25zdCBzeXN0ZW1QcmVmZXJEYXJrID0gd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzO1xuICAgICAgICBjb25zdCBpbml0YWxUaGVtZSA9IHNhdmVkVGhlbWUgPT09ICdkYXJrJyB8fCAoc2F2ZWRUaGVtZSA9PT0gJ3N5c3RlbScgJiYgc3lzdGVtUHJlZmVyRGFyaykgPyAnZGFyaycgOiAnbGlnaHQnO1xuICAgICAgICBzZXRUaGVtZShpbml0YWxUaGVtZSk7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCBpbml0YWxUaGVtZSk7XG4gICAgfSwgW10pO1xuICAgIGNvbnN0IHRvZ2dsZVRoZW1lID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdUaGVtZSA9IHRoZW1lID09PSAnbGlnaHQnID8gJ2RhcmsnIDogJ2xpZ2h0JztcbiAgICAgICAgc2V0VGhlbWUobmV3VGhlbWUpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGhlbWUnLCBuZXdUaGVtZSk7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCBuZXdUaGVtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8VGhlbWVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7dGhlbWUsIHRvZ2dsZVRoZW1lfX0+XG4gICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIDwvVGhlbWVDb250ZXh0LlByb3ZpZGVyPlxuICAgICk7XG59XG5leHBvcnQgZnVuY3Rpb24gdXNlVGhlbWUoKSB7XG4gICAgcmV0dXJuIHVzZUNvbnRleHQoVGhlbWVDb250ZXh0KTtcbn0iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIlRoZW1lQ29udGV4dCIsIlRoZW1lUHJvdmlkZXIiLCJjaGlsZHJlbiIsInRoZW1lIiwic2V0VGhlbWUiLCJzYXZlZFRoZW1lIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInN5c3RlbVByZWZlckRhcmsiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImluaXRhbFRoZW1lIiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJ0b2dnbGVUaGVtZSIsIm5ld1RoZW1lIiwic2V0SXRlbSIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VUaGVtZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./context/themeContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _context_themeContext_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context/themeContext.js */ \"(pages-dir-node)/./context/themeContext.js\");\n\n\n\n\nfunction App({ Component, pageProps: { session, ...pageProps } }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n        session: session,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_themeContext_js__WEBPACK_IMPORTED_MODULE_3__.ThemeProvider, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/shibah/Library/CloudStorage/GoogleDrive-kevinshighschoolmaterial@gmail.com/My Drive/Programming/Summer Hack Club/Discord_Bot/dashboard/pages/_app.js\",\n                lineNumber: 9,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/shibah/Library/CloudStorage/GoogleDrive-kevinshighschoolmaterial@gmail.com/My Drive/Programming/Summer Hack Club/Discord_Bot/dashboard/pages/_app.js\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/shibah/Library/CloudStorage/GoogleDrive-kevinshighschoolmaterial@gmail.com/My Drive/Programming/Summer Hack Club/Discord_Bot/dashboard/pages/_app.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQThCO0FBQ29CO0FBQ1M7QUFFNUMsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFdBQVcsRUFBRUMsT0FBTyxFQUFFLEdBQUdELFdBQVcsRUFBRTtJQUM3RSxxQkFDRSw4REFBQ0osNERBQWVBO1FBQUNLLFNBQVNBO2tCQUN4Qiw0RUFBQ0osbUVBQWFBO3NCQUNaLDRFQUFDRTtnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyIvVXNlcnMvc2hpYmFoL0xpYnJhcnkvQ2xvdWRTdG9yYWdlL0dvb2dsZURyaXZlLWtldmluc2hpZ2hzY2hvb2xtYXRlcmlhbEBnbWFpbC5jb20vTXkgRHJpdmUvUHJvZ3JhbW1pbmcvU3VtbWVyIEhhY2sgQ2x1Yi9EaXNjb3JkX0JvdC9kYXNoYm9hcmQvcGFnZXMvX2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJAL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xuaW1wb3J0IHsgU2Vzc2lvblByb3ZpZGVyIH0gZnJvbSBcIm5leHQtYXV0aC9yZWFjdFwiO1xuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gXCIuLi9jb250ZXh0L3RoZW1lQ29udGV4dC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wczogeyBzZXNzaW9uLCAuLi5wYWdlUHJvcHMgfSB9KSB7XG4gIHJldHVybiAoXG4gICAgPFNlc3Npb25Qcm92aWRlciBzZXNzaW9uPXtzZXNzaW9ufT5cbiAgICAgIDxUaGVtZVByb3ZpZGVyPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgPC9TZXNzaW9uUHJvdmlkZXI+XG4gICk7XG59XG5cbiJdLCJuYW1lcyI6WyJTZXNzaW9uUHJvdmlkZXIiLCJUaGVtZVByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwic2Vzc2lvbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./pages/_app.js"));
module.exports = __webpack_exports__;

})();