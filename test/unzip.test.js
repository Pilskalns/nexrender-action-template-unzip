const fs = require('fs')
const { resolve } = require('path')
const unzip = require('../index')

const sample = require('./samples/job.json')

const settings = {
    logger: { // a substitute logger that suppresses all
        log: ()=>{},
        info: ()=>{},
        error: ()=>{},
    }
}

sample.workpath = resolve('./test/tmp')


beforeEach(() => clearTempFiles(sample.workpath))


describe("nexrender-action-template-unzip", ()=>{

    test("returns reject when called from wrong stage", async ()=>{
        sample.template.dest = resolve('./test/samples/ae_sample.zip')

        let result
        
        await unzip(sample, settings, null, 'postrender').catch(e => result = e)
        expect(result).toEqual(
            expect.stringContaining("module should be used only in 'prerender' section")
        )
    })

    test("returns reject when AE project file is missing", async ()=>{
        sample.template.dest = resolve('./test/samples/ae_sample_missing.zip')

        let result
        
        await unzip(sample, settings, null, 'prerender').catch(e => result = e)
        expect(result).toEqual(
            expect.stringContaining("no AE file found in the ZIP")
        )
    })

    test("can do proper extraction", async ()=>{
        sample.template.dest = resolve('./test/samples/ae_sample.zip')

        let expectedPath = resolve('./test/tmp/ae_sample/this is basic.aep')
        
        let result = await unzip(sample, settings, null, 'prerender')

        expect(fs.existsSync(expectedPath)).toBeTruthy()
        expect(result.template.dest).toBe(expectedPath)
        expect(result.template.extension).toBe('aep')
    })

    test("can do nested extraction", async ()=>{
        sample.template.dest = resolve('./test/samples/ae_sample_nested.zip')

        let expectedPath = resolve('./test/tmp/ae_sample_nested/subdirectory/nested.aep')
        
        let result = await unzip(sample, settings, null, 'prerender')

        expect(fs.existsSync(expectedPath)).toBeTruthy()
        expect(result.template.dest).toBe(expectedPath)
        expect(result.template.extension).toBe('aep')
    })


    test("ignores autosave files", async ()=>{
        sample.template.dest = resolve('./test/samples/ae_sample_autosave.zip')

        let expectedPath = resolve('./test/tmp/ae_sample_autosave/basic_anim.aep')
        
        let result = await unzip(sample, settings, null, 'prerender')

        expect(fs.existsSync(expectedPath)).toBeTruthy()
        expect(result.template.dest).toBe(expectedPath)
        expect(result.template.extension).toBe('aep')
    })

})


function clearTempFiles(path){

    for (const file of fs.readdirSync(path)){
        const fullPath = resolve(path, file)
        const stats = fs.statSync(fullPath)

        if(stats.isDirectory()){
            clearTempFiles(fullPath)
            fs.rmdirSync(fullPath)
        } else if(file != '.gitkeep') {
            fs.rmSync(fullPath)
        }
    }
}