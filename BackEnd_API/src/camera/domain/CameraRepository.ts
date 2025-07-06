
export interface CameraRepository {
    on(): Promise<void>;
    off(): Promise<void>;
}
