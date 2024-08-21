import { deleteImage, saveImage } from "$lib/core/images";
import { json } from "@sveltejs/kit";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.formData();
    const files: File[] = data.getAll('images') as File[]; // Assuming form field name is 'images'

    // Array to store paths of uploaded files
    const uploadedFiles = [];
    const failedFiles = [];

    for (const item of files) {
        try {
            const filePath = await saveImage(item)
            uploadedFiles.push(filePath);
        } catch (error) {
            failedFiles.push(item.name)
        }
    }
    return json({ success: true, files: uploadedFiles, failed: failedFiles })
}

export const GET: RequestHandler = async ({ params }) => {
    // Get all images in the images directory
    const uploadDir = "images"
    const files = await fs.readdir(uploadDir);
    const images = files.map(file => {
        const fileNameOnly = path.parse(file).name
        return {
            id: fileNameOnly,
            url: `/api/v1/images/${file}`,
            title: file,
            tags: [],
            uploadDate: new Date().toISOString()
        }
    })
    return json(images)
}

export const DELETE: RequestHandler = async ({ request }) => {
    const body = await request.json()
    const ids = body.ids as number[]
    try {
        for (const item of ids) {
            await deleteImage(item)
        }
        return new Response(null, { status: 204 })
    } catch (error) {
        return json({ success: false, error }, { status: 500 })
    }
} 