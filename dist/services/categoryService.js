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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCategoriesTree = getCategoriesTree;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
function createCategory(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = new categoryModel_1.default({
            name: data.name,
            parentId: data.parentId || null,
        });
        if (data.parentId) {
            const parent = yield categoryModel_1.default.findById(data.parentId);
            if (parent) {
                parent.children.push(category._id);
                yield parent.save();
            }
        }
        return category.save();
    });
}
function updateCategory(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return categoryModel_1.default.findByIdAndUpdate(id, data, { new: true });
    });
}
function deleteCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield categoryModel_1.default.findById(id);
        if (!category)
            throw new Error("Category not found");
        if (category.parentId) {
            const parent = yield categoryModel_1.default.findById(category.parentId);
            if (parent) {
                parent.children = parent.children.filter((childId) => !childId.equals(category._id));
                yield parent.save();
            }
        }
        return category.deleteOne();
    });
}
function getCategoriesTree() {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield categoryModel_1.default.find().lean();
        const idMap = new Map(categories.map((cat) => [cat._id.toString(), cat]));
        categories.forEach((cat) => {
            if (cat.parentId) {
                const parent = idMap.get(cat.parentId.toString());
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(cat._id);
                }
            }
        });
        return categories.filter((cat) => !cat.parentId);
    });
}
