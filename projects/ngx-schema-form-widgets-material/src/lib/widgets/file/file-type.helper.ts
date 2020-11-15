import { Injectable } from "@angular/core"

/**
 * 
 */
@Injectable()
export class FileTypeHelper {

    constructor() {

    }

    matchesAccept(accept, mimeType): boolean {
        const a = accept.replace(new RegExp(' ', 'g'), ',').split(',')
        if (-1 !== a.indexOf(mimeType))
            return true
        const mClasses = mimeType.split('/')
        for (const ac of a) {
            if (ac === mimeType) {
                return true
            } else if (-1 !== ac.indexOf('/*')) {
                const aBaseClass = ac.split('/')[0]
                if (aBaseClass === mClasses[0]) {
                    return true
                }
            }
        }
        return false
    }

    async fileSingatureMatchesMimeType(file: File | Blob, accept?: string): Promise<boolean> {
        const fileMimeType = file.type
        const header = await this.getFileHeader(file)
        const fileInfo = this.mimeType(header)
        const validMimeType = -1 !== fileInfo.mimeType.indexOf(fileMimeType)
        return validMimeType
            && /** ... and only if mime-type is conained in accept attribute */(!accept || this.matchesAccept(accept, fileMimeType))
    }

    async getFileHeader(file: File | Blob): Promise<string> {
        const fileInfoAsync = new Promise<string>((resolve, reject) => {
            try {
                const fileReader = new FileReader()
                // Onload of file read the file content
                fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
                    const arrayBuffer: ArrayBuffer = e.target.result as ArrayBuffer
                    const arr = (new Uint8Array(arrayBuffer)).subarray(0, 4)
                    let header = ''
                    for (var i = 0; i < arr.length; i++) {
                        header += arr[i].toString(16)
                    }
                    resolve(header)
                }
                fileReader.onerror = reject
                fileReader.readAsArrayBuffer(file)
            } catch (e) {
                console.error(e)
                reject(e.message)
            }
        })

        const getFileInfo = async (): Promise<string> => {
            try {
                const result = await fileInfoAsync
                return result
            } catch (e) {
                console.error('getFileInfo', e)
                return e.message
            }
        }
        return getFileInfo()
    }

    // Add more from http://en.wikipedia.org/wiki/List_of_file_signatures
    // https://wiki.selfhtml.org/wiki/MIME-Type/%C3%9Cbersicht
    // https://www.garykessler.net/library/file_sigs.html
    // http://string-functions.com/hex-string.aspx
    mimeType(headerString): UploadFileInfo {
        const fileInfo: UploadFileInfo = {
            mimeType: [],
            fileExtension: []
        }
        let _headerString = `${headerString}`.toUpperCase()

        if (_headerString.startsWith('424D')) {
            /**
             * if it has the BMP signature the make it a BMP
             */
            _headerString = '424D'
        }
        switch (_headerString) {
            case '255044462D':
            case '25504446':
                fileInfo.mimeType.push('application/pdf')
                fileInfo.fileExtension.push('pdf')
                break
            case '89504E47':
                fileInfo.mimeType.push('image/png')
                fileInfo.fileExtension.push('png')
                break
            case '47494638':
                fileInfo.mimeType.push('image/gif')
                fileInfo.fileExtension.push('gif')
                break
            case '424D':
                fileInfo.mimeType.push('image/bmp')
                fileInfo.mimeType.push('image/x-bmp')
                fileInfo.mimeType.push('image/x-ms-bmp')
                fileInfo.fileExtension.push('bmp')
                break
            case '49492A00':
            case '4D4D002A':
            case '49492A0':
                fileInfo.mimeType.push('image/tiff')
                fileInfo.mimeType.push('image/x-tiff')
                fileInfo.fileExtension.push('tiff')
                fileInfo.fileExtension.push('tif')
                break
            case 'FFD8FFE0':
            case 'FFD8FFE1':
            case 'FFD8FFE2':
                fileInfo.mimeType.push('image/jpeg')
                fileInfo.fileExtension.push('jpeg')
                fileInfo.fileExtension.push('jpg')
                fileInfo.fileExtension.push('jpe')
                break
            case '3C3F786D':
                fileInfo.mimeType.push('image/svg+xml')
                fileInfo.fileExtension.push('svg')
                break
            default:
                fileInfo.mimeType.push('unknown')
                break;
        }

        return fileInfo;
    }


}

export interface UploadFileInfo {
    mimeType: string[],
    fileExtension: string[]
}