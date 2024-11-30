"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryService_1 = require("../services/categoryService");
class CategoryController {
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield (0, categoryService_1.createCategory)(req.body);
                res.status(201).json(category);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield (0, categoryService_1.updateCategory)(id, req.body);
                res.status(200).json(category);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield (0, categoryService_1.deleteCategory)(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getCategoriesTree(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield (0, categoryService_1.getCategoriesTree)();
                res.status(200).json(categories);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = new CategoryController();
