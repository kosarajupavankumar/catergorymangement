"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const router = (0, express_1.Router)();
router.post('/', categoryController_1.default.createCategory);
router.put('/:id', categoryController_1.default.updateCategory);
router.delete('/:id', categoryController_1.default.deleteCategory);
router.get('/tree', categoryController_1.default.getCategoriesTree);
exports.default = router;
