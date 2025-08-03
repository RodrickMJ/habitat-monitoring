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
exports.GetAllDataDHT11Controller = void 0;
class GetAllDataDHT11Controller {
    constructor(getDataDHT11UseCase) {
        this.getDataDHT11UseCase = getDataDHT11UseCase;
    }
    run(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.getDataDHT11UseCase.execute();
                res.status(200).json({
                    message: 'Data retrieved successfully',
                    success: true,
                    data: data,
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                res.status(500).json({
                    message: errorMessage,
                    success: false,
                });
            }
        });
    }
}
exports.GetAllDataDHT11Controller = GetAllDataDHT11Controller;
