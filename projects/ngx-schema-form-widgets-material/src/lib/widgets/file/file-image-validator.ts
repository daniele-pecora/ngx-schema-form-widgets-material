import { Injectable } from "@angular/core"

/**
 *
 */
@Injectable()
export class ImageValidator {

    private calculateImageDimensions(imageSource): Promise<{ dim: { w: number, h: number }, screenDPI: { x: number, y: number } }> {
        const calculateScreenDPI = (): { x: number, y: number } => {
            const divtmp = document.createElement('div')
            divtmp.id = '______________________________________div_tmp_will_be_removed_soon'
            divtmp.style.cssText = `visibility:hidden; height: 1in;  width: 1in; left: -100%; position: absolute; top: -100%;`
            document.body.appendChild(divtmp)
            const devicePixelRatio = window.devicePixelRatio || 1
            const dpi_x = divtmp.offsetWidth * devicePixelRatio
            const dpi_y = divtmp.offsetHeight * devicePixelRatio
            divtmp.remove()
            return {
                x: dpi_x,
                y: dpi_y
            }
        }

        let img = document.createElement('img')
        img.id = '______________________________________image_tmp_will_be_removed_soon'
        img.style.cssText = `visibility:hidden; left: -100%; position: absolute; top: -100%;`
        const promise = new Promise<{ dim: { w: number, h: number }, screenDPI: { x: number, y: number } }>((resolve, reject) => {
            img.addEventListener('load', () => {
                let realWidth = img.naturalWidth
                let realHeight = img.naturalHeight
                var screenDPI = calculateScreenDPI()
                img.remove()
                resolve({
                    dim: { w: realWidth, h: realHeight },
                    screenDPI: { x: screenDPI.x, y: screenDPI.y }
                })
            })
            img.addEventListener('error', (error) => {
                console.error('Couldn\'t load image', error)
                img.remove()
                reject(error)
            })
        })
        img.src = imageSource
        document.body.appendChild(img)
        return promise
    }

    getImageInfo(imageSource): Promise<ImageInfo> {
        return new Promise<ImageInfo>((resolve, reject) => {
            this.calculateImageDimensions(imageSource)
                .then((value: { dim: { w: number, h: number }, screenDPI: { x: number, y: number } }) => {
                    const cm_per_inch = 2.54

                    const w_inch = value.dim.w / value.screenDPI.x
                    const w_cm = w_inch * cm_per_inch

                    const h_inch = value.dim.h / value.screenDPI.y
                    const h_cm = h_inch * cm_per_inch

                    const imageInfo = {
                        screen: {
                            dpi: {
                                x: value.screenDPI.x,
                                y: value.screenDPI.y
                            }
                        },
                        dimensions: {
                            // pixel
                            px: {
                                w: value.dim.w,
                                h: value.dim.h
                            },
                            // inch
                            in: {
                                w: w_inch,
                                h: h_inch
                            },
                            // centimers
                            cm: {
                                w: w_cm,
                                h: h_cm
                            }
                        }
                    }
                    resolve(imageInfo)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

    validate(rules: ImageRules, imageInfo: ImageInfo): ImageValidationResult {

        const defaultUnit = 'px'
        const isValidNumber = (value) => {
            return value > 0
        }
        const isValidOrientation = (value) => {
            return - 1 !== ['landscape', 'portrait', 'square'].indexOf(value)
        }

        /**
         * @param minWidth
         * @param maxWidth 
         * @param minHeight
         * @param maxHeight
         * @param currWidth
         * @param currHeight
         * @param orientation 'landscape', 'portrait', 'square'
         */
        const validate = (minWidth, maxWidth, minHeight, maxHeight, currWidth, currHeight, orientation): {
            minWidth: boolean,
            minHeight: boolean,
            maxWidth: boolean,
            maxHeight: boolean,
            orientation: 'landscape' | 'portrait' | 'square',
            valid: boolean
        } => {
            let maxW = maxWidth
            let minW = minWidth
            let maxH = maxHeight
            let minH = minHeight
            let currW = currWidth
            let currH = currHeight

            const result = {
                minWidth: false,
                minHeight: false,
                maxWidth: false,
                maxHeight: false,
                orientation: null // 'landscape', 'portrait', 'square'
                , valid: false
            }

            if (!isValidNumber(currWidth)) {
                currW = -1
            }
            if (!isValidNumber(currHeight)) {
                currH = -1
            }

            if (!isValidNumber(minW)) {
                minW = currWidth
            }
            if (!isValidNumber(maxW)) {
                maxW = currWidth
            }
            if (!isValidNumber(minH)) {
                minH = currHeight
            }
            if (!isValidNumber(maxH)) {
                maxH = currHeight
            }

            result.minWidth = (currW >= minW)
            result.maxWidth = (currW <= maxW)
            result.minHeight = (currH >= minH)
            result.maxHeight = (currH <= maxH)

            if (currW === currH) {
                result.orientation = 'square'
            } else if (currW > currH) {
                result.orientation = 'landscape'
            } else if (currW < currH) {
                result.orientation = 'portrait'
            }

            result.valid = (!isValidOrientation(orientation) || result.orientation === orientation || 'square' === result.orientation)
                && result.minWidth
                && result.maxWidth
                && result.minHeight
                && result.maxHeight
            return result
        }

        const result: {
            valid: boolean,
            rule?: ImageSingleRule
        } = {
            valid: false
        }
        if (rules && ((rules.oneOf || []).length || (rules.allOf || []).length)) {
            if ((rules.oneOf || []).length) {
                for (const rule of rules.oneOf) {
                    if (rule) {
                        const unit = `${rule.unit || defaultUnit}`.toLowerCase()
                        const unitc = imageInfo.dimensions[unit] || {}
                        const currWidth = unitc.w
                        const currHeight = unitc.h

                        const vr = validate(rule.minWidth, rule.maxWidth, rule.minHeight, rule.maxHeight, currWidth, currHeight, rule.orientation)
                        if (vr.valid) {
                            // does match - return matching rule
                            result.valid = true
                            result.rule = rule
                            break
                        }
                    }
                }
            }
            if ((rules.allOf || []).length) {
                for (const rule of rules.allOf) {
                    if (rule) {
                        result.valid = true
                        const unit = `${rule.unit || defaultUnit}`.toLowerCase()
                        const unitc = imageInfo.dimensions[unit] || {}
                        const currWidth = unitc.w
                        const currHeight = unitc.h

                        const vr = validate(rule.minWidth, rule.maxWidth, rule.minHeight, rule.maxHeight, currWidth, currHeight, rule.orientation)
                        if (!vr.valid) {
                            // doesn't match - return not matching rule
                            result.valid = false
                            result.rule = rule
                            break
                        }
                    }
                }
            }
        } else {
            result.valid = true
        }
        return result
    }
}

export interface ImageValidationResult {
    /**
     * Either `true` or `false`
     */
    valid: boolean
    /**
     * If `valid` is `true` then it contains the matching rule.
     * If `valid` is `false` then it contains the not matching rule.
     */
    rule?: ImageSingleRule
}

export interface ImageInfo {
    screen: {
        dpi: {
            x: number,
            y: number
        }
    },
    dimensions: {
        // pixel
        px: {
            w: number,
            h: number
        },
        // inch
        in: {
            w: number,
            h: number
        },
        // centimers
        cm: {
            w: number,
            h: number
        }
    }
}

export interface ImageRules {
    oneOf: ImageSingleRule[]
    allOf: ImageSingleRule[]
}

export interface ImageSingleRule {
    orientation: 'landscape' | 'portrait' | 'square'
    unit: 'px' | 'in' | 'cm'
    minWidth: number
    maxWidth: number
    minHeight: number
    maxHeight: number
}