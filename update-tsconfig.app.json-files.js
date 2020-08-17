var fs = require('fs');

const findTSFilesInFormsFolder = () => {
    // List all files in a directory in Node.js recursively in a synchronous fashion
    const walkSync = (dir, filelist = []) => {
        var path = path || require('path')
        var fs = fs || require('fs')
        fs.readdirSync(dir).forEach(file => {

            filelist = fs.statSync(path.join(dir, file)).isDirectory()
                ? walkSync(path.join(dir, file), filelist)
                : filelist.concat(path.join(dir, file))

        });
        return filelist;
    }

    const formsDir = 'app/__forms'
    const formsDirPath = `src/${formsDir}`
    let formsTsFiles = walkSync(formsDirPath)
        .filter(element => {
            return element.toLowerCase().endsWith('.ts')
        })
    formsTsFiles.forEach(element => {
        console.log(element)
    });
    formsTsFiles = formsTsFiles.map((element) => {
        return element.replace('src/', '')/*windows...*/.replace('src\\', '')
    })
    return {
        formsTsFiles: formsTsFiles, filterMatchingFormsTsFiles: element => {
            return element.startsWith(formsDir) || element.startsWith(formsDirPath)
        }
    }
}

const updateFilesInTSConfigJSON = (tsconfig_json, formsFolderState) => {
    var tcj = JSON.parse(fs.readFileSync(tsconfig_json));
    let tcj_files = tcj['files'] || []

    // filter out existing entries
    tcj_files = tcj_files.filter(element => {
        return !formsFolderState.filterMatchingFormsTsFiles(element)
    })
    // put all together
    tcj_files = tcj_files.concat(formsFolderState.formsTsFiles)

    tcj['files'] = tcj_files
    // finally write files
    fs.writeFileSync(tsconfig_json, JSON.stringify(tcj, null, 2))
}



const formsFolderState = findTSFilesInFormsFolder()

updateFilesInTSConfigJSON('src/tsconfig.app.json', formsFolderState)
updateFilesInTSConfigJSON('src/tsconfig.spec.json', formsFolderState)
