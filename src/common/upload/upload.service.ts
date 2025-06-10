import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Injectable()
export class UploadService {

    private getDestinationPath(folder: string): string {
        const uploadPath = join(process.cwd(), 'uploads', folder);
        
        // Crear directorio si no existe
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }
        
        return uploadPath;
    }

    getMulterOptions(folder: string) {
        return {
            storage: diskStorage({
                destination: this.getDestinationPath(folder),
                filename: (req, file, cb) => {
                    // console.log({file});
                    const randomName = randomUUID();
                    const fileExtName = extname(file.originalname);
                    cb(null, `${randomName}${fileExtName}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return cb(new Error('Solo se permiten imágenes (jpg, jpeg, png)'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        };
    }

    getFileUrl(folder: string, filename: string): string {
        return `uploads/${folder}/${filename}`;
    }

}
