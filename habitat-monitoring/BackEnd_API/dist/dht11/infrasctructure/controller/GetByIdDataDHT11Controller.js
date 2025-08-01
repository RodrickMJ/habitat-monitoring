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
exports.GetDHT11ByIdController = void 0;
class GetDHT11ByIdController {
    constructor(getDHT11ByIdUseCase) {
        this.getDHT11ByIdUseCase = getDHT11ByIdUseCase;
    }
    run(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                if (isNaN(id)) {
                    res.status(400).json({
                        message: 'Invalid ID format',
                        success: false,
                    });
                    return;
                }
                const data = yield this.getDHT11ByIdUseCase.execute(id);
                if (data === null) {
                    res.status(404).json({
                        message: 'DHT11 data not found',
                        success: false,
                    });
                    return;
                }
                res.status(200).json({
                    message: 'DHT11 data retrieved successfully',
                    success: true,
                    data: {
                        temperature: data.temperature,
                        humidity: data.humidity
                    },
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
exports.GetDHT11ByIdController = GetDHT11ByIdController;
