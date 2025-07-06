import { CameraRepository } from "../domain/CameraRepository";

export class CameraOnUseCase {
    constructor(private cameraRepository: CameraRepository) {}

    async execute(): Promise<void> {
        await this.cameraRepository.on();
    }
}
