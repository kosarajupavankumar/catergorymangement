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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MongoConnection {
    constructor(uri, dbName = 'landmark') {
        this.uri = uri;
        this.dbName = dbName;
    }
    // Connect to the database
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If a cached connection exists, return it
                if (MongoConnection.cachedConnection) {
                    console.log(`Using cached database connection.`);
                    return MongoConnection.cachedConnection;
                }
                console.log(`Connecting to MongoDB cluster...`);
                yield mongoose_1.default.connect(this.uri, { dbName: this.dbName });
                MongoConnection.cachedConnection = mongoose_1.default.connection; // Cache the connection
                console.log(`Connected to the cluster and using database: ${this.dbName}`);
                return MongoConnection.cachedConnection;
            }
            catch (error) {
                console.error('Error connecting to the database:', error.message);
                process.exit(1); // Exit if database connection fails
            }
        });
    }
}
MongoConnection.cachedConnection = null; // Cache the connection
const mongoConnection = new MongoConnection(process.env.MONGO_URI, 'landmark');
exports.default = mongoConnection;
