const Zip = require('adm-zip')
const path = require('path');

module.exports = (job, settings, action, type) => {

    // fallback to console if no preffered logger provided
    settings.logger = settings.logger ?? console

    return new Promise((resolve, reject) => {
        
        if(type != "prerender"){
            return reject("'action-template-unzip' module should be used only in 'prerender' section")
        }

        if(path.extname(job.template.dest).toLowerCase() != ".zip"){
            settings.logger.log(`[${job.uid}] [action-template-unzip] skipping - template file should have .zip extension`)
            return resolve(job)
        }    
        
        let zip = new Zip(job.template.dest)

        zip.extractAllTo(job.workpath, true)

        let entries = zip.getEntries();
        let template = entries.find(entry =>
            entry.name.toLowerCase().endsWith('.aep') &&
            !entry.entryName.toLowerCase().includes('adobe after effects auto-save')
        )
        if(!template){
            return reject(`[${job.uid}] [action-template-unzip] ERROR - no AE file found in the ZIP (extension .aep)`)
        }
        let newPath = path.normalize(`${job.workpath}/${template.entryName}`)

        settings.logger.log(`[${job.uid}] [action-template-unzip] setting new template path to: ${newPath}`)

        /**
         * Mutate the job object with unzipped AE file
         */
        job.template.dest = newPath
        job.template.extension = "aep"
        resolve(job)
    })
}