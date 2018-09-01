import wikiUpload from '../utils/wikiUploadUtils'
import mimetypes from 'mime-types'
// Login to wikimedia commons ===============================================
// Login to wikimedia commons ===============================================
const COMMONS_BASE_URL = 'https://commons.wikimedia.org/w/api.php'
const username = process.env.WIKICOMMONS_BOT_USERNAME
const password = process.env.WIKICOMMONS_BOT_PASSWORD

export const uploadFileToWikiCommons = (req, res, next) => {
  const {
    fileTitle,
    description,
    categories,
    licence,
    source,
    sourceUrl,
    sourceAuthors,
    date,
    duration,
    file,
  } = req.body

  let fileMime
  let errors = []

  if (!fileTitle) {
    errors.push('File title is required')
  }
  if (!description) {
    errors.push('Description is required')
  }
  if (!categories || categories.length === 0) {
    errors.push('At least one category is required')
  }
  if (!source) {
    errors.push('Source field is required')
  }
  if (!date) {
    errors.push('Date field is required')
  }
  if (!licence) {
    errors.push('Licence field is required')
  }
  if (source && source === 'others' && !sourceUrl) {
    errors.push('Please specify the source of the file')
  }
  if (file && file[0]) {
    fileMime = mimetypes.lookup(file[0].path)
    if ((fileMime.indexOf('video') > -1 || fileMime.indexOf('gif') > -1) && (!duration || duration == 0)) {
      errors.push('Duration field is required for videos and gifs')
    }
  }

  if (errors.length > 0) {
    console.log(errors)
    return res.status(500).send(errors.join(', '))
  }

  if (file && file[0]) {
    // upload file to mediawiki

    wikiUpload.loginToMediawiki(COMMONS_BASE_URL, username, password)
      .then(() => {
        wikiUpload.uploadFileToMediawiki(file, { filename: fileTitle, text: `${description} ${categories}` })
          .then((result) => {
            if (result.result === 'Success') {
              // update file licencing data
              req.file = {
                path: result.imageinfo.url,
                mimetype: fileMime,
              }

              const wikiFileName = `File:${result.filename}`
              const licenceInfo = `{{${licence}}}`
              wikiUpload.createWikiArticleSection(wikiFileName, '=={{int:license-header}}==', licenceInfo)
                .then(() => {
                  // update file description
                  // TODO handle duration
                  const fileDescription = `
              {{Information
                |description=${description}
                |date=${date}
                |source=${source === 'own' ? `{{${source}}}` : sourceUrl}
                |author=${sourceAuthors}
                ${(fileMime.indexOf('video') > -1 || fileMime.indexOf('gif') > -1) ? `|duration=${duration}` : ''}
                }}
              `
                  wikiUpload.createWikiArticleSection(wikiFileName, '== {{int:filedesc}} ==', fileDescription)
                    .then(() => {
                      next()
                    })
                    .catch((err) => {
                      console.log('error updating desc', err)
                      res.status(500).send('Error')
                    })
                })
                .catch((err) => {
                  console.log('Error updating licence ', err)
                  res.status(500).send('Error')
                })
            } else {
              return res.status(500).send('Something went wrong!')
            }
          })
          .catch((err) => {
            console.log('error uploading file ', err)
            return res.status(500).send('Something went wrong!')
          })
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).send('Something went wrong, please try again')
      })
  } else {
    return res.status(500).send('Error while uploading file')
  }
}
