export default class UploadAdapter
{
  /**
   * Creates a new adapter instance.
   *
   * @param {module:upload/filerepository~FileLoader} loader
   * @param {String} url
   * @param {module:utils/locale~Locale#t} t
   */
  constructor(loader, url, t)
  {
    /**
     * FileLoader instance to use during the upload.
     *
     * @member {module:upload/filerepository~FileLoader} #loader
     */
    this.loader = loader;

    /**
     * Upload URL.
     *
     * @member {String} #url
     */
    this.url = url;

    /**
     * Locale translation method.
     *
     * @member {module:utils/locale~Locale#t} #t
     */
    this.t = t;
  }

  /**
   * Starts the upload process.
   *
   * @see module:upload/filerepository~UploadAdapter#upload
   * @returns {Promise.<Object>}
   */
  upload()
  {
    return this.loader.file.then(
      file =>
      {
        return new Promise(
          (resolve, reject) =>
          {
            this._init(resolve, reject, file);
            this._sendRequest(file);
          }
        );
      }
    );
  }

  /**
   * Aborts the upload process.
   *
   * @see module:upload/filerepository~UploadAdapter#abort
   */
  abort()
  {
    if(this.xhr)
    {
      this.xhr.abort();
    }
  }

  /**
   * Initializes XMLHttpRequest listeners.
   *
   * @private
   * @param {Function} resolve Callback function to be called when the request is successful.
   * @param {Function} reject Callback function to be called when the request cannot be completed.
   * @param {File} file File instance to be uploaded.
   */
  _init(resolve, reject, file)
  {
    const xhr = this.xhr = new XMLHttpRequest();

    xhr.open('POST', this.url + file.name, true);
    xhr.responseType = 'json';

    const loader = this.loader;
    const t = this.t;
    const genericError = t('Cannot upload file:') + ` ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericError));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener(
      'load',
      () =>
      {
        const response = xhr.response;

        if(!response || !response.uploaded)
        {
          return reject(response && response.error && response.error.message ? response.error.message : genericError);
        }

        resolve({default: response.url});
      }
    );

    // Upload progress when it's supported.
    /* istanbul ignore else */
    if(xhr.upload)
    {
      xhr.upload.addEventListener(
        'progress',
        evt =>
        {
          if(evt.lengthComputable)
          {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        }
      );
    }
  }

  /**
   * Prepares the data and sends the request.
   *
   * @private
   * @param {File} file File instance to be uploaded.
   */
  _sendRequest(file)
  {
    // Prepare form data.
    const data = new FormData();
    data.append('upload', file);

    // Send request.
    this.xhr.send(data);
  }
}
