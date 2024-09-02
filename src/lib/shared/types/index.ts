export interface ImageDto {
    id: string;
    url: string;
    title: string;
    tags: string[];
    createdAt: string;
    downloadCount: number;
}

export interface ExifData {
    date_time_original?: string;  // ISO 8601 format timestamp
    x_resolution?: number; // XResolution
    y_resolution?: number; // YResolution
    model?: string; // Model
    f_number?: number;
    exposure_time?: number;
    iso?: number;
    focal_length?: number;
    gps_latitude?: number;
    gps_longitude?: number;
    orientation?: number;
    white_balance?: string;
    software?: string;
    make?: string;
    flash?: string;
    metering_mode?: string;
    exposure_program?: string;
    exposure_bias?: number;
    lens_model?: string;
    shutter_speed_value?: number;
    aperture_value?: number;
    color_space?: string;
    digital_zoom_ratio?: number;
    scene_capture_type?: string;
}
