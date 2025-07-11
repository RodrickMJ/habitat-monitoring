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
exports.SaveDataDHT11Controller = void 0;
const dht11_1 = require("../../domain/dht11");
class SaveDataDHT11Controller {
    constructor(saveDHT11DataUseCase) {
        this.saveDHT11DataUseCase = saveDHT11DataUseCase;
    }
    run(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { humidity, temperature, timestamp } = req.body;
                if (humidity === undefined || temperature === undefined) {
                    res.status(400).json({
                        message: 'Invalid data: humidity, temperature, and timestamp are required',
                        success: false,
                    });
                    return;
                }
                const newDHT11 = new dht11_1.DHT11(humidity, temperature);
                yield this.saveDHT11DataUseCase.execute(newDHT11);
                res.status(201).json({
                    message: 'DHT11 data saved successfully',
                    success: true,
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
exports.SaveDataDHT11Controller = SaveDataDHT11Controller;
