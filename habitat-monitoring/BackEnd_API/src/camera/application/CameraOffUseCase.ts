import { CameraRepository } from "../domain/CameraRepository";

export class CameraOffUseCase {
    constructor(private cameraRepository: CameraRepository) {}

    async execute(): Promise<void> {
        await this.cameraRepository.off();
    }
}
